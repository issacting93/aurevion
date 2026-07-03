import { createContext, useContext, useState, useCallback, useRef } from 'react'

const NavigationContext = createContext(null)

export function NavigationProvider({ children }) {
  const [activeTab, setActiveTab] = useState('home')
  const [detailStack, setDetailStack] = useState([])
  const [transitioning, setTransitioning] = useState(false)
  const timerRef = useRef(null)

  const switchTab = useCallback((tabId) => {
    if (tabId === activeTab && detailStack.length === 0) return
    setTransitioning(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveTab(tabId)
      setDetailStack([])
      setTransitioning(false)
    }, 150)
  }, [activeTab, detailStack.length])

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
