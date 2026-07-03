import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { SCREENS } from '../app/screens'

const DemoContext = createContext()

export function DemoProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState(0)

  const go = useCallback((next) => {
    if (next < 0 || next >= SCREENS.length || next === currentScreen) return
    setCurrentScreen(next)
  }, [currentScreen])

  const next = useCallback(() => go(currentScreen + 1), [go, currentScreen])
  const prev = useCallback(() => go(currentScreen - 1), [go, currentScreen])
  const goTo = useCallback((id) => {
    const idx = SCREENS.findIndex(s => s.id === id)
    if (idx >= 0) go(idx)
  }, [go])

  return (
    <DemoContext.Provider value={{ currentScreen, screens: SCREENS, go, next, prev, goTo }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  return useContext(DemoContext)
}
