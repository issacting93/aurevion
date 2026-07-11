import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Color, Space, Font, Radius } from './tokens'
import { Phone, FLabel } from './components'
import { useSpring, SpringPreset } from './motion'

// ── Shader: single opaque mesh, Fresnel glow on active group ────────────────

const BODY_VERT = /* glsl */ `
  attribute vec3 color;
  uniform int   uActiveGroup;
  uniform float uInflate;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying vec3  vWorldPos;
  varying float vWeight;
  varying float vIsActive;

  void main() {
    // Decode group ID from R channel: byte was (gi+1)*20, GLTF normalizes to 0-1
    float rawR = color.r * 255.0;
    int groupId = int(rawR / 20.0 + 0.5) - 1;

    // G channel = boundary weight (0-1)
    vWeight = color.g;

    // Check match
    vIsActive = (uActiveGroup >= 0 && groupId == uActiveGroup) ? 1.0 : 0.0;

    // Slight inflation on active vertices to make glow pop above surface
    vec3 pos = position + normal * uInflate * vIsActive;

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vNormal   = normalize(normalMatrix * normal);
    vViewDir  = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const BODY_FRAG = /* glsl */ `
  uniform vec3  uGroupColor;
  uniform float uTime;
  uniform float uGlow;
  uniform int   uActiveGroup;

  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying vec3  vWorldPos;
  varying float vWeight;
  varying float vIsActive;

  void main() {
    // ── Base body: dark metallic with rim light ──
    vec3 baseColor = vec3(0.23, 0.24, 0.27);
    float diff = max(dot(vNormal, normalize(vec3(0.3, 0.4, 0.5))), 0.0);
    vec3 body = baseColor * (0.3 + 0.7 * diff);

    // Subtle blue rim on the whole body for that sci-fi scan look
    float bodyRim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    body += vec3(0.05, 0.12, 0.2) * bodyRim * 0.4;

    if (vIsActive < 0.5 || uActiveGroup < 0) {
      gl_FragColor = vec4(body, 1.0);
      return;
    }

    // ── Fresnel glow for active muscle group ──
    float w = smoothstep(0.0, 1.0, vWeight);
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);

    // Animated pulse wave
    float wave = sin(vWorldPos.y * 12.0 - uTime * 3.0) * 0.5 + 0.5;
    float pulse = 0.7 + 0.3 * wave;

    // Bright rim
    vec3 rim = uGroupColor * fresnel * 2.0;

    // Inner glow (facing camera)
    float inner = pow(max(dot(vNormal, vViewDir), 0.0), 1.5) * 0.4;
    vec3 innerGlow = uGroupColor * inner;

    // Core color
    vec3 core = uGroupColor * 0.2;

    // Compose: base body + additive glow
    vec3 glow = (core + rim + innerGlow) * pulse * w * uGlow;

    gl_FragColor = vec4(body + glow, 1.0);
  }
`

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractGeo(scene) {
  let geo = null
  scene.traverse((c) => { if (c.isMesh && !geo) geo = c.geometry })
  return geo
}

// ── Body mesh with raycasting ───────────────────────────────────────────────

function BodyMesh({ url, activeGroupIndex, groupColor, onGroupTap }) {
  const gltf = useGLTF(url)
  const matRef = useRef()

  const geo = useMemo(() => {
    const g = extractGeo(gltf.scene)
    if (!g) return null
    g.computeVertexNormals()
    if (!g.attributes.color) {
      const n = g.attributes.position.count
      g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3))
    }
    return g
  }, [gltf.scene])

  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uActiveGroup: { value: -1 },
        uGroupColor:  { value: new THREE.Color(1, 0, 0) },
        uTime:        { value: 0 },
        uGlow:        { value: 0 },
        uInflate:     { value: 0.002 },
      },
      vertexShader: BODY_VERT,
      fragmentShader: BODY_FRAG,
      side: THREE.DoubleSide,
    })
    matRef.current = m
    return m
  }, [])

  // Update group uniform
  useEffect(() => {
    const u = matRef.current.uniforms
    u.uActiveGroup.value = activeGroupIndex
    if (groupColor) {
      u.uGroupColor.value.setRGB(groupColor[0] / 255, groupColor[1] / 255, groupColor[2] / 255)
    }
  }, [activeGroupIndex, groupColor])

  // Animate glow + time
  useFrame((st, dt) => {
    const u = matRef.current.uniforms
    u.uTime.value = st.clock.elapsedTime
    const target = activeGroupIndex >= 0 ? 1 : 0
    u.uGlow.value = THREE.MathUtils.lerp(u.uGlow.value, target, dt * 8)
  })

  // Tap handler: decode group ID from hit triangle vertex colors
  const pointerDown = useRef(null)

  const handleDown = useCallback((e) => {
    pointerDown.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleUp = useCallback((e) => {
    e.stopPropagation()
    if (!geo || !pointerDown.current) return
    // Tap vs swipe guard: <8px movement
    const dx = e.clientX - pointerDown.current.x
    const dy = e.clientY - pointerDown.current.y
    if (dx * dx + dy * dy > 64) return

    const colorAttr = geo.attributes.color
    const idx = geo.index
    if (!idx || e.faceIndex == null) return

    const fi = e.faceIndex
    const ids = [0, 1, 2].map(i => {
      const vi = idx.getX(fi * 3 + i)
      const r = colorAttr.getX(vi) * 255
      return Math.round(r / 20) - 1
    })

    // Majority vote
    const counts = {}
    ids.forEach(id => { counts[id] = (counts[id] || 0) + 1 })
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const groupId = parseInt(winner[0])
    onGroupTap(groupId >= 0 ? groupId : null)
  }, [geo, onGroupTap])

  if (!geo) return null
  return (
    <mesh
      geometry={geo}
      material={mat}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
    />
  )
}

// ── Variant pills ───────────────────────────────────────────────────────────

function VariantPills({ variants, activeId, onChange }) {
  return (
    <div style={{
      position: 'absolute', top: 58, left: 0, right: 0, zIndex: 10,
      display: 'flex', gap: Space[1], padding: `0 ${Space[4]}px`,
      overflowX: 'auto', WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      <style>{`.variant-pills::-webkit-scrollbar { display: none; }`}</style>
      {variants.map(v => (
        <button key={v.id} onClick={() => onChange(v.id)} style={{
          padding: `${Space[1]}px ${Space[3]}px`, borderRadius: Radius.full,
          border: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          background: activeId === v.id ? Color.accentDim : 'rgba(255,255,255,0.04)',
          color: activeId === v.id ? Color.accent : Color.mute,
          fontFamily: Font.mono, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          cursor: 'pointer', transition: 'all 0.15s',
        }}>{v.label}</button>
      ))}
    </div>
  )
}

// ── Bottom sheet ────────────────────────────────────────────────────────────

function MuscleSheet({ group, onClose }) {
  const open = !!group
  const y = useSpring(open ? 0 : 400, SpringPreset.snappy)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) setVisible(true)
    else {
      const t = setTimeout(() => setVisible(false), 350)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible && !open) return null

  const c = group?.color?.join(',') || '255,255,255'
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 20,
          background: open ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'background 0.2s',
        }}
      />
      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        transform: `translateY(${y}px)`,
        background: Color.surface2,
        borderRadius: `${Radius.xl}px ${Radius.xl}px 0 0`,
        padding: `${Space[4]}px ${Space[5]}px ${Space[16]}px`,
        maxHeight: '55%', overflowY: 'auto', touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: Radius.full,
          background: Color.faint, margin: `0 auto ${Space[4]}px`,
        }} />
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Space[2], marginBottom: Space[3] }}>
          <div style={{
            width: 10, height: 10, borderRadius: Radius.full,
            background: `rgb(${c})`,
            boxShadow: `0 0 12px rgba(${c},0.5)`,
          }} />
          <span style={{ fontFamily: Font.sans, fontSize: 17, fontWeight: 600, color: Color.text }}>
            {group?.label}
          </span>
        </div>
        <FLabel>Exercises</FLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Space[1] }}>
          {group?.exercises?.map(ex => (
            <div key={ex} style={{
              padding: `${Space[3]}px ${Space[4]}px`, borderRadius: Radius.lg,
              background: `rgba(${c},0.06)`, border: `1px solid rgba(${c},0.12)`,
              fontFamily: Font.sans, fontSize: 14, color: Color.text,
            }}>{ex}</div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function BodyViewer() {
  const [manifest, setManifest] = useState(null)
  const [activeVariantId, setActiveVariantId] = useState(null)
  const [activeGroupKey, setActiveGroupKey] = useState(null)

  useEffect(() => {
    fetch('/models/manifest.json')
      .then(r => r.json())
      .then(m => { setManifest(m); setActiveVariantId(m.variants[0]?.id) })
  }, [])

  const variant = manifest?.variants.find(v => v.id === activeVariantId)
  const groupData = activeGroupKey ? manifest?.muscleGroups[activeGroupKey] : null
  const activeGroupIndex = groupData?.index ?? -1

  // Map group index → key
  const indexToKey = useMemo(() => {
    if (!manifest) return {}
    const m = {}
    Object.entries(manifest.muscleGroups).forEach(([k, g]) => { m[g.index] = k })
    return m
  }, [manifest])

  const handleGroupTap = useCallback((idx) => {
    if (idx == null || idx < 0) {
      setActiveGroupKey(null)
    } else {
      const key = indexToKey[idx]
      setActiveGroupKey(prev => prev === key ? null : key)
    }
  }, [indexToKey])

  const handleVariantChange = useCallback((id) => {
    setActiveVariantId(id)
    setActiveGroupKey(null)
  }, [])

  if (!manifest) return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 28, height: 28, border: `2px solid ${Color.faint}`,
          borderTopColor: Color.accent, borderRadius: '50%',
          animation: 'aurevion-spin 0.8s linear infinite',
        }} />
      </div>
    </Phone>
  )

  return (
    <Phone>
      <div style={{ flex: 1, position: 'relative', background: Color.bg }}>
        <VariantPills
          variants={manifest.variants}
          activeId={activeVariantId}
          onChange={handleVariantChange}
        />

        <Canvas
          camera={{ position: [0, 0, 2.2], fov: 45 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          style={{ touchAction: 'none' }}
          onPointerMissed={() => setActiveGroupKey(null)}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} color="#a0c4ff" />
          <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#6080c0" />
          <pointLight position={[0, 0, 3]} intensity={0.6} color="#80b0ff" distance={6} />

          <Suspense fallback={null}>
            {variant && (
              <group key={variant.id}>
                <BodyMesh
                  url={variant.file}
                  activeGroupIndex={activeGroupIndex}
                  groupColor={groupData?.color}
                  onGroupTap={handleGroupTap}
                />
              </group>
            )}
          </Suspense>

          <OrbitControls
            enablePan={false}
            minDistance={1.2}
            maxDistance={4}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.85}
            enableDamping
            dampingFactor={0.05}
            touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
          />
        </Canvas>

        <MuscleSheet group={groupData} onClose={() => setActiveGroupKey(null)} />
      </div>
    </Phone>
  )
}
