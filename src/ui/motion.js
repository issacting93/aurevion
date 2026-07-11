/* Aurevion Motion System — ESM version for Vite/React app */

import { useState, useEffect, useRef, useMemo, useCallback, Children, createElement } from 'react'
import { Ease } from './tokens'

export const MotionEase = Object.freeze({
  ...Ease,
  enter:  'cubic-bezier(0.0, 0.0, 0.2, 1)',
  exit:   'cubic-bezier(0.4, 0.0, 1, 1)',
  spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
  bounce: 'cubic-bezier(0.22, 1, 0.36, 1)',
})

export const MotionDuration = Object.freeze({
  micro:   80,
  fast:    120,
  normal:  200,
  enter:   300,
  morph:   400,
  page:    340,
  stagger: 40,
})

/* ── Spring physics ───────────────────────────────────────── */

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

/* ── Scroll reveal ───────────────────────────────────────── */

export function useScrollReveal(ref, opts = {}) {
  const { threshold = 0.15, once = true } = opts
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return visible
}

/* ── Transition lock ─────────────────────────────────────── */

export function useTransitionLock(duration = MotionDuration.enter) {
  const locked = useRef(false)
  return useCallback(() => {
    if (locked.current) return false
    locked.current = true
    setTimeout(() => { locked.current = false }, duration)
    return true
  }, [duration])
}

/* ── Stagger entrance ────────────────────────────────────── */

export function useStaggerEntrance(itemCount, opts) {
  const { delay = 40, duration = 300, distance = 10 } = opts || {}
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return useCallback((index) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return {}
    return {
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : `translateY(${distance}px)`,
      transition: `opacity ${duration}ms ${MotionEase.enter} ${index * delay}ms, transform ${duration}ms ${MotionEase.enter} ${index * delay}ms`,
    }
  }, [revealed, delay, duration, distance])
}

export function usePageTransition(key) {
  const [state, setState] = useState('entering')
  const [displayKey, setDisplayKey] = useState(key)

  useEffect(() => {
    if (key !== displayKey) {
      setState('exiting')
      const timer = setTimeout(() => {
        setDisplayKey(key)
        setState('entering')
      }, MotionDuration.fast + 60)
      return () => clearTimeout(timer)
    }
  }, [key, displayKey])

  useEffect(() => {
    if (state === 'entering') {
      const timer = setTimeout(() => setState('entered'), MotionDuration.enter)
      return () => clearTimeout(timer)
    }
  }, [state])

  const style = useMemo(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return { opacity: 1 }
    switch (state) {
      case 'entering': return {
        opacity: 0, transform: 'translateY(8px)',
        transition: `opacity ${MotionDuration.enter}ms ${MotionEase.enter}, transform ${MotionDuration.enter}ms ${MotionEase.enter}`,
      }
      case 'entered': return {
        opacity: 1, transform: 'translateY(0)',
        transition: `opacity ${MotionDuration.enter}ms ${MotionEase.enter}, transform ${MotionDuration.enter}ms ${MotionEase.enter}`,
      }
      case 'exiting': return {
        opacity: 0, transform: 'translateY(-4px)',
        transition: `opacity ${MotionDuration.fast + 60}ms ${MotionEase.exit}, transform ${MotionDuration.fast + 60}ms ${MotionEase.exit}`,
      }
      default: return { opacity: 1 }
    }
  }, [state])

  return { style, state, displayKey }
}

export function MotionGroup({ children, stagger = 40, distance = 10, duration = 300, as: Tag = 'div', style = {}, ...rest }) {
  const items = Children.toArray(children)
  const getStyle = useStaggerEntrance(items.length, { delay: stagger, duration, distance })
  return createElement(Tag, { style, ...rest },
    items.map((child, i) =>
      createElement('div', { key: child.key || i, style: getStyle(i) }, child)
    )
  )
}
