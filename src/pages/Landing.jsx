/* Consumer Landing Page — loads the existing landing.html content */

import { useEffect, useRef } from 'react'

export default function Landing() {
  const containerRef = useRef(null)

  useEffect(() => {
    // Fetch the standalone landing HTML and inject into container
    fetch('/landing.html')
      .then(r => r.text())
      .then(html => {
        if (!containerRef.current) return

        // Parse the HTML to extract body and styles
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        // Inject styles
        const styles = doc.querySelectorAll('style')
        styles.forEach(style => {
          const clone = document.createElement('style')
          clone.textContent = style.textContent
          clone.setAttribute('data-landing', 'true')
          document.head.appendChild(clone)
        })

        // Set body content
        containerRef.current.innerHTML = doc.body.innerHTML

        // Execute scripts
        const scripts = containerRef.current.querySelectorAll('script')
        scripts.forEach(script => {
          const newScript = document.createElement('script')
          if (script.src) {
            newScript.src = script.src
          } else {
            newScript.textContent = script.textContent
          }
          script.replaceWith(newScript)
        })

        // Make body visible (landing.html sets opacity:0 for motion entrance)
        document.body.style.opacity = '1'
      })

    return () => {
      // Cleanup injected styles on unmount
      document.querySelectorAll('style[data-landing]').forEach(s => s.remove())
    }
  }, [])

  return <div ref={containerRef} style={{ minHeight: '100vh' }} />
}
