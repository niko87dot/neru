import { useState, useEffect, useRef } from 'react'

type Phase = 'silence' | 'typing' | 'pause' | 'fadeout'

const FULL_TEXT = 'Wake up Neru...'

export default function WakeUp({ onDone }: { onDone: () => void }) {
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('silence')
  const [fadeOut, setFadeOut] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(false)
  const cursorBlinks = useRef(0)

  useEffect(() => {
    if (phase === 'silence') {
      const t = setTimeout(() => {
        setCursorVisible(true)
        setPhase('typing')
      }, 300)
      return () => clearTimeout(t)
    }

    if (phase === 'typing') {
      let idx = 0
      const interval = setInterval(() => {
        idx++
        setDisplayText(FULL_TEXT.slice(0, idx))
        if (idx >= FULL_TEXT.length) {
          clearInterval(interval)
          cursorBlinks.current = 0
          const blinkInterval = setInterval(() => {
            cursorBlinks.current++
            setCursorVisible(v => !v)
            if (cursorBlinks.current >= 4) {
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
      const t = setTimeout(() => setPhase('fadeout'), 600)
      return () => clearTimeout(t)
    }

    if (phase === 'fadeout') {
      setFadeOut(true)
      const t = setTimeout(() => {
        localStorage.setItem('neru_intro_seen', 'true')
        onDone()
      }, 500)
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
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 500ms ease-in-out',
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '14px',
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
