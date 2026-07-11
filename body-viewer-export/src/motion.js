/* Aurevion Motion System — subset used by the 3D body viewer */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Ease } from './tokens'

export const SpringPreset = Object.freeze({
  default:  { stiffness: 180, damping: 12 },
  snappy:   { stiffness: 300, damping: 24 },
  gentle:   { stiffness: 120, damping: 14 },
  stiff:    { stiffness: 400, damping: 30 },
})

export function useSpring(target, config = {}) {
  const { stiffness = 180, damping = 12, mass = 1, precision = 0.01 } = config
  const [value, setValue] = useState(target)
  const state = useRef({ position: target, velocity: 0 })
  const targetRef = useRef(target)
  const configRef = useRef({ stiffness, damping, mass, precision })

  targetRef.current = target
  configRef.current = { stiffness, damping, mass, precision }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setValue(target); state.current.position = target; return }

    let active = true
    const tick = () => {
      if (!active) return
      const s = state.current
      const { stiffness: k, damping: d, mass: m, precision: p } = configRef.current
      const displacement = s.position - targetRef.current
      const accel = (-k * displacement - d * s.velocity) / m
      s.velocity += accel / 60
      s.position += s.velocity / 60

      if (Math.abs(s.velocity) < p && Math.abs(displacement) < p) {
        s.position = targetRef.current
        s.velocity = 0
        setValue(s.position)
        return
      }
      setValue(s.position)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return () => { active = false }
  }, [target])

  return value
}
