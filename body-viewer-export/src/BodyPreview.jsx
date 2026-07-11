/**
 * Lightweight inline 3D body preview — reusable across screens.
 *
 * Props:
 *   variant    – variant ID string (e.g. "male-lean", "female-heavy")
 *   height     – CSS height of the canvas (default 220)
 *   autoRotate – slow turntable (default true)
 *   activeGroup – muscle group index to highlight (-1 = none)
 *   groupColor  – [r,g,b] array for the active group
 *   onGroupTap  – callback(groupIndex) when a muscle group is tapped
 */

import React, { useRef, useMemo, useEffect, useCallback, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ── Shader ──────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  attribute vec3 color;
  uniform int   uActiveGroup;
  uniform float uInflate;
  varying vec3  vNormal;
  varying vec3  vViewDir;
  varying vec3  vWorldPos;
  varying float vWeight;
  varying float vIsActive;
  void main() {
    float rawR = color.r * 255.0;
    int groupId = int(rawR / 20.0 + 0.5) - 1;
    vWeight = color.g;
    vIsActive = (uActiveGroup >= 0 && groupId == uActiveGroup) ? 1.0 : 0.0;
    vec3 pos = position + normal * uInflate * vIsActive;
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorldPos = wp.xyz;
    vNormal   = normalize(normalMatrix * normal);
    vViewDir  = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const FRAG = /* glsl */ `
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
    vec3 baseColor = vec3(0.23, 0.24, 0.27);
    float diff = max(dot(vNormal, normalize(vec3(0.3, 0.4, 0.5))), 0.0);
    vec3 body = baseColor * (0.3 + 0.7 * diff);
    float bodyRim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    body += vec3(0.05, 0.12, 0.2) * bodyRim * 0.4;
    if (vIsActive < 0.5 || uActiveGroup < 0) {
      gl_FragColor = vec4(body, 1.0);
      return;
    }
    float w = smoothstep(0.0, 1.0, vWeight);
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);
    float wave = sin(vWorldPos.y * 12.0 - uTime * 3.0) * 0.5 + 0.5;
    float pulse = 0.7 + 0.3 * wave;
    vec3 rim = uGroupColor * fresnel * 2.0;
    float inner = pow(max(dot(vNormal, vViewDir), 0.0), 1.5) * 0.4;
    vec3 glow = (uGroupColor * 0.2 + rim + uGroupColor * inner) * pulse * w * uGlow;
    gl_FragColor = vec4(body + glow, 1.0);
  }
`

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractGeo(scene) {
  let geo = null
  scene.traverse((c) => { if (c.isMesh && !geo) geo = c.geometry })
  return geo
}

// ── Mesh ────────────────────────────────────────────────────────────────────

function BodyMeshInner({ url, activeGroup, groupColor, onGroupTap, autoRotate }) {
  const gltf = useGLTF(url)
  const matRef = useRef()
  const groupRef = useRef()

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
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    })
    matRef.current = m
    return m
  }, [])

  useEffect(() => {
    const u = matRef.current.uniforms
    u.uActiveGroup.value = activeGroup ?? -1
    if (groupColor) {
      u.uGroupColor.value.setRGB(groupColor[0] / 255, groupColor[1] / 255, groupColor[2] / 255)
    }
  }, [activeGroup, groupColor])

  useFrame((st, dt) => {
    const u = matRef.current.uniforms
    u.uTime.value = st.clock.elapsedTime
    u.uGlow.value = THREE.MathUtils.lerp(u.uGlow.value, (activeGroup ?? -1) >= 0 ? 1 : 0, dt * 8)
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += dt * 0.3
    }
  })

  // Tap → raycast → decode group
  const ptrDown = useRef(null)
  const handleDown = useCallback((e) => { ptrDown.current = { x: e.clientX, y: e.clientY } }, [])
  const handleUp = useCallback((e) => {
    e.stopPropagation()
    if (!geo || !ptrDown.current || !onGroupTap) return
    const dx = e.clientX - ptrDown.current.x, dy = e.clientY - ptrDown.current.y
    if (dx * dx + dy * dy > 64) return
    const colorAttr = geo.attributes.color
    const idx = geo.index
    if (!idx || e.faceIndex == null) return
    const fi = e.faceIndex
    const ids = [0, 1, 2].map(i => {
      const vi = idx.getX(fi * 3 + i)
      return Math.round(colorAttr.getX(vi) * 255 / 20) - 1
    })
    const counts = {}
    ids.forEach(id => { counts[id] = (counts[id] || 0) + 1 })
    const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const gid = parseInt(winner[0])
    onGroupTap(gid >= 0 ? gid : null)
  }, [geo, onGroupTap])

  if (!geo) return null
  return (
    <group ref={groupRef}>
      <mesh geometry={geo} material={mat} onPointerDown={handleDown} onPointerUp={handleUp} />
    </group>
  )
}

// ── Public component ────────────────────────────────────────────────────────

export default function BodyPreview({
  variant = 'male-athletic',
  height = 220,
  autoRotate = true,
  activeGroup = -1,
  groupColor = null,
  onGroupTap = null,
}) {
  const url = `/models/${variant}.glb`

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 40 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, alpha: true }}
        style={{ touchAction: 'none', background: 'transparent' }}
        onPointerMissed={() => onGroupTap?.(null)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.0} color="#a0c4ff" />
        <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#6080c0" />

        <Suspense fallback={null}>
          <BodyMeshInner
            key={variant}
            url={url}
            activeGroup={activeGroup}
            groupColor={groupColor}
            onGroupTap={onGroupTap}
            autoRotate={autoRotate}
          />
        </Suspense>

        {!autoRotate && (
          <OrbitControls
            enablePan={false} enableZoom={false}
            minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.8}
            enableDamping dampingFactor={0.03}
            rotateSpeed={0.8}
            touches={{ ONE: THREE.TOUCH.ROTATE }}
          />
        )}
      </Canvas>
    </div>
  )
}
