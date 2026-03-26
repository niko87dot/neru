import { useState, useEffect, useRef } from 'react'

type Phase = 'silence' | 'typing' | 'pause' | 'fadeout' | 'done'

const FULL_TEXT = 'Wake up Neru...'

export default function WakeUp({ onDone }: { onDone: () => void }) {
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('silence')
  const [opacity, setOpacity] = useState(1)
  const [cursorVisible, setCursorVisible] = useState(false)
  const cursorBlinks = useRef(0)

  // Phase transitions
  useEffect(() => {
    if (phase === 'silence') {
      const t = setTimeout(() => {
        setCursorVisible(true)
        setPhase('typing')
      }, 800)
      return () => clearTimeout(t)
    }

    if (phase === 'typing') {
      let idx = 0
      const interval = setInterval(() => {
        idx++
        setDisplayText(FULL_TEXT.slice(0, idx))
        if (idx >= FULL_TEXT.length) {
          clearInterval(interval)
          // Blink cursor 3x then go to pause
          cursorBlinks.current = 0
          const blinkInterval = setInterval(() => {
            cursorBlinks.current++
            setCursorVisible(v => !v)
            if (cursorBlinks.current >= 6) {
              clearInterval(blinkInterval)
              setCursorVisible(false)
              setPhase('pause')
            }
          }, 500)
        }
      }, 80)
      return () => clearInterval(interval)
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('fadeout'), 1500)
      return () => clearTimeout(t)
    }

    if (phase === 'fadeout') {
      setOpacity(0)
      const t = setTimeout(() => {
        localStorage.setItem('neru_intro_seen', 'true')
        onDone()
      }, 600)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity,
        transition: phase === 'fadeout' ? 'opacity 600ms ease' : 'none',
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 'clamp(16px, 2.5vw, 18px)',
          color: '#74b83e',
          letterSpacing: '0.15em',
          fontWeight: 'normal',
          textShadow: '0 0 8px rgba(116, 184, 62, 0.4)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {displayText}
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: '1em',
            background: '#74b83e',
            marginLeft: 2,
            visibility: cursorVisible ? 'visible' : 'hidden',
            boxShadow: '0 0 6px rgba(116, 184, 62, 0.4)',
          }}
        />
      </div>
    </div>
  )
}
