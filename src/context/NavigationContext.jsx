import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const NavigationContext = createContext(null)

export function NavigationProvider({ children, initialTab, initialDetail }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'home')
  const [detailStack, setDetailStack] = useState(initialDetail ? [{ screen: initialDetail, title: initialDetail, data: {} }] : [])
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef(null)

  // Sync with external prop changes (test agents cycling through flows)
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
    setDetailStack(initialDetail ? [{ screen: initialDetail, title: initialDetail, data: {} }] : [])
  }, [initialTab, initialDetail])

  const stateRef = useRef({ activeTab: 'home', detailLen: 0 })
  stateRef.current = { activeTab, detailLen: detailStack.length }

  const switchTab = useCallback((tabId) => {
    const { activeTab: curTab, detailLen } = stateRef.current
    if (tabId === curTab && detailLen === 0) return
    setTransitioning(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveTab(tabId)
      setDetailStack([])
      setTransitioning(false)
    }, 150)
  }, [])

  const pushDetail = useCallback((screen, title, data) => {
    setDetailStack(s => [...s, { screen, title, data }])
  }, [])

  const popDetail = useCallback(() => {
    setDetailStack(s => s.slice(0, -1))
  }, [])

  return (
    <NavigationContext.Provider value={{
      activeTab,
      detailStack,
      transitioning,
      showingDetail: detailStack.length > 0,
      currentDetail: detailStack[detailStack.length - 1] || null,
      switchTab,
      pushDetail,
      popDetail,
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNav() {
  const ctx = useContext(NavigationContext)
  if (!ctx) return { activeTab: 'home', detailStack: [], showingDetail: false, currentDetail: null, transitioning: false, switchTab() {}, pushDetail() {}, popDetail() {} }
  return ctx
}
