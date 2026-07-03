import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { OnboardingFlow } from '../app/screens/Onboarding'
import { AppShell } from '../app/Shell'
import { Phone } from '../ui/components'
import { Color, Font } from '../ui/tokens'

function PhoneScaler({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const update = () => {
      const availH = Math.max(420, window.innerHeight - 120)
      const availW = Math.max(320, window.innerWidth - 48)
      setScale(Math.min(1, availH / 874, availW / 402))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return (
    <div style={{
      width: 402, height: 874,
      transform: `scale(${scale})`, transformOrigin: 'top center',
    }}>
      {children}
    </div>
  )
}

export default function AppFlow() {
  const { onboarded, resetAll } = useUser()
  const [justFinished, setJustFinished] = useState(false)

  // If onboarding wrote to context, flip to dashboard
  // We check every render since completeOnboarding triggers a re-render
  const showDashboard = onboarded || justFinished

  return (
    <div style={{
      minHeight: '100vh',
      background: '#151515',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,110,80,0.04) 0%, transparent 60%)',
      color: Color.text,
      fontFamily: Font.sans, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 24,
    }}>
      <PhoneScaler>
        {showDashboard ? (
          <AppShell />
        ) : (
          <Phone statusTime="9:41">
            <OnboardingFlowWithCallback onComplete={() => setJustFinished(true)} />
          </Phone>
        )}
      </PhoneScaler>
      {showDashboard && (
        <button
          onClick={() => { resetAll(); setJustFinished(false) }}
          style={{
            background: 'transparent', border: `1px solid ${Color.faint}`,
            borderRadius: 8, padding: '8px 20px', cursor: 'pointer',
            fontFamily: Font.mono, fontSize: 11, letterSpacing: 1,
            color: Color.mute, textTransform: 'uppercase',
          }}
        >
          Reset &amp; re-onboard
        </button>
      )}
    </div>
  )
}

// Wrapper that detects when onboarding completes (context.onboarded flips to true)
function OnboardingFlowWithCallback({ onComplete }) {
  const { onboarded } = useUser()
  const [wasOnboarded] = useState(onboarded)

  // If onboarded changed from false to true during this render cycle, fire callback
  if (onboarded && !wasOnboarded) {
    // Schedule for next tick to avoid setState-during-render
    setTimeout(onComplete, 0)
  }

  return <OnboardingFlow />
}
