import { useState, useEffect, useCallback } from 'react'
import WakeUp from './WakeUp'
import PixelShell from './PixelShell'

// ── Palette ───────────────────────────────────────────────────────────────────
const G   = '#74b83e'
const D   = '#3d6b1f'
const EYE = '#0a1a0a'

// ── Types ─────────────────────────────────────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'

// ── SVG Button circles — 3-step hard shading ─────────────────────────────────
function BtnCircle({ uid, down }: { uid: string; down: boolean }) {
  const clip = `bc-${uid}`
  return (
    <svg width="52" height="52" viewBox="0 0 52 52"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <defs>
        <clipPath id={clip}>
          <circle cx="26" cy="26" r="23" shapeRendering="crispEdges" />
        </clipPath>
      </defs>
      <circle cx="26" cy="26" r="23"
        fill={down ? '#080e08' : '#0d1f10'}
        shapeRendering="crispEdges"
      />
      <polygon
        points="2,32 50,22 50,50 2,50"
        fill={down ? '#040804' : '#050f05'}
        clipPath={`url(#${clip})`}
        shapeRendering="crispEdges"
      />
      {!down && (
        <polygon
          points="2,2 42,2 26,22 2,26"
          fill="#2d5535"
          clipPath={`url(#${clip})`}
          shapeRendering="crispEdges"
        />
      )}
      <circle cx="26" cy="26" r="23"
        fill="none" stroke="#0a1208" strokeWidth="2"
        shapeRendering="crispEdges"
      />
    </svg>
  )
}

function Btn({ label, sub, uid, onPress }: {
  label: string; sub: string; uid: string; onPress: () => void
}) {
  const [down, setDown] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        onPointerDown={(e) => { e.preventDefault(); setDown(true) }}
        onPointerUp={(e)   => { e.preventDefault(); setDown(false); onPress() }}
        onPointerLeave={()  => setDown(false)}
        style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          position: 'relative',
          transform: down ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 50ms',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        <BtnCircle uid={uid} down={down} />
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: G, fontFamily: "'Press Start 2P', monospace", fontSize: 12,
          pointerEvents: 'none',
        }}>
          {label}
        </span>
      </button>
      <span style={{ color: D, fontSize: 7, fontFamily: "'Press Start 2P', monospace" }}>
        {sub}
      </span>
    </div>
  )
}

// ── Neru character ────────────────────────────────────────────────────────────
function Neru({ expr }: { expr: Expr }) {
  const sleeping = expr === 'sleeping'
  const eyeY = 15
  const twoTone = `linear-gradient(to bottom, ${G} 50%, ${D} 50%)`

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      {sleeping && (
        <div style={{ position: 'absolute', top: 4, right: -42, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="zzz-c" style={{ fontSize: 10, color: D, fontFamily: "'Press Start 2P', monospace", display: 'block' }}>Z</span>
          <span className="zzz-b" style={{ fontSize: 8,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 2 }}>z</span>
          <span className="zzz-a" style={{ fontSize: 6,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 4 }}>z</span>
        </div>
      )}

      {/* Antenna */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: G }} />
        <div style={{ width: 3, height: 16, background: G }} />
      </div>

      {/* Head 60×50 */}
      <div style={{ position: 'relative', width: 60, height: 50, background: twoTone, flexShrink: 0 }}>
        {sleeping ? (
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY, width: 10, height: 10, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY, width: 10, height: 10, background: EYE }} />
            <div style={{ position: 'absolute', left: 22, top: eyeY + 1, width: 2, height: 2, background: '#c8e6a0' }} />
            <div style={{ position: 'absolute', left: 42, top: eyeY + 1, width: 2, height: 2, background: '#c8e6a0' }} />
          </>
        )}
        {expr === 'happy' && (<>
          <div style={{ position: 'absolute', left: 13, top: 38, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 28, top: 43, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 42, top: 38, width: 5, height: 5, background: EYE }} />
        </>)}
        {expr === 'neutral' && (<>
          <div style={{ position: 'absolute', left: 13, top: 40, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 28, top: 40, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 42, top: 40, width: 5, height: 5, background: EYE }} />
        </>)}
        {expr === 'sleeping' && (<>
          <div style={{ position: 'absolute', left: 13, top: 43, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 28, top: 38, width: 5, height: 5, background: EYE }} />
          <div style={{ position: 'absolute', left: 42, top: 43, width: 5, height: 5, background: EYE }} />
        </>)}
      </div>

      {/* Body 33×26 + arms */}
      <div style={{ position: 'relative', marginTop: 5, flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: -7, top: 5,  width: 7, height: 13, background: G }} />
        <div style={{ position: 'absolute', right: -7, top: 5, width: 7, height: 13, background: D }} />
        <div style={{ width: 33, height: 26, background: twoTone }} />
      </div>

      {/* Nametag */}
      <div style={{
        marginTop: 8, fontSize: 7, color: D,
        fontFamily: "'Press Start 2P', monospace",
        border: `1px solid ${D}`, padding: '3px 6px', letterSpacing: 1,
      }}>NERU</div>
    </div>
  )
}

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Press Start 2P', monospace", fontSize: 7 }}>
      <span style={{ color: D, width: 18, display: 'inline-block' }}>{label}</span>
      <span style={{ color: D }}>[</span>
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ width: 11, height: 7, background: i < value ? G : '#152a15', flexShrink: 0 }} />
        ))}
      </div>
      <span style={{ color: D }}>]</span>
      <span style={{ color: G, minWidth: 36, textAlign: 'right' }}>{value}/{max}</span>
    </div>
  )
}

// ── State & persistence ───────────────────────────────────────────────────────
const HABITS_INIT = [
  { id: 'water', label: 'DRINK WATER',    done: false },
  { id: 'move',  label: 'MOVE YOUR BODY', done: false },
  { id: 'ship',  label: 'SHIP SOMETHING', done: false },
]
type Habit = typeof HABITS_INIT[number]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function displayDate() {
  const d = new Date()
  const M = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${String(d.getDate()).padStart(2,'0')} ${M[d.getMonth()]}`
}

function loadHabits(): Habit[] | null {
  try {
    const s = localStorage.getItem('neru-v2')
    if (!s) return null
    const { habits, date } = JSON.parse(s)
    if (date !== todayKey()) return null
    return habits
  } catch { return null }
}

function persist(habits: Habit[]) {
  localStorage.setItem('neru-v2', JSON.stringify({ habits, date: todayKey() }))
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => !localStorage.getItem('neru_intro_seen')
  )

  const [habits, setHabits] = useState<Habit[]>(() =>
    loadHabits() ?? HABITS_INIT.map(h => ({ ...h }))
  )
  const [focus, setFocus] = useState(0)

  useEffect(() => { persist(habits) }, [habits])

  useEffect(() => {
    const id = setInterval(() => {
      if (!loadHabits()) {
        const fresh = HABITS_INIT.map(h => ({ ...h }))
        setHabits(fresh); persist(fresh)
      }
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const up = useCallback(() => setFocus(f => Math.max(0, f - 1)), [])
  const dn = useCallback(() => setFocus(f => Math.min(HABITS_INIT.length - 1, f + 1)), [])
  const ok = useCallback(() => {
    setHabits(prev => prev.map((h, i) => i === focus ? { ...h, done: !h.done } : h))
  }, [focus])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')                     { e.preventDefault(); up() }
      else if (e.key === 'ArrowDown')              { e.preventDefault(); dn() }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); ok() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [up, dn, ok])

  const done  = habits.filter(h => h.done).length
  const total = habits.length
  const hp    = Math.round((done / total) * 10)
  const en    = Math.round((done / total) * 8)
  const expr: Expr = done === total ? 'happy' : done === 0 ? 'sleeping' : 'neutral'

  if (showIntro) return <WakeUp onDone={() => setShowIntro(false)} />

  // Canvas button centers (pixel canvas 46×74 → scaled ×10 → 460×740px)
  // bx values: 13, 22, 31 — center_x = (bx + 1.5) * 10; center_y = (41 + 1.5) * 10 = 425
  const buttons = [
    { label: '▲', sub: 'UP', uid: 'up', onPress: up, cx: 145 },
    { label: '●', sub: 'OK', uid: 'ok', onPress: ok, cx: 235 },
    { label: '▼', sub: 'DN', uid: 'dn', onPress: dn, cx: 325 },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>

        {/* ── PixelShell — hand-coded canvas egg ─────────────────────────── */}
        <PixelShell>
          <div style={{
            width: '100%', height: '100%',
            padding: '10px 11px',
            display: 'flex', flexDirection: 'column',
            boxSizing: 'border-box',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 8, color: G }}>NERU</span>
              <span style={{ fontSize: 8, color: D }}>{displayDate()}</span>
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 6 }} />

            {/* Neru character — scaled to fit 240px screen */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: 78, flexShrink: 0, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
                <Neru expr={expr} />
              </div>
            </div>

            {/* Status bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
              <StatusBar label="HP" value={hp} max={10} />
              <StatusBar label="EN" value={en} max={8} />
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 5 }} />

            {/* Log label */}
            <div style={{ fontSize: 7, color: D, marginBottom: 4 }}>// DAILY LOG</div>

            {/* Habits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
              {habits.map((h, i) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 7 }}>
                  <span style={{ width: 10, color: G, display: 'inline-block', flexShrink: 0 }}>
                    {i === focus ? '►' : ''}
                  </span>
                  <span style={{ color: h.done ? G : D, flexShrink: 0 }}>
                    {h.done ? '[X]' : '[ ]'}
                  </span>
                  <span style={{ color: h.done ? D : G }}>{h.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom HUD */}
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 7 }}>
              <span style={{ color: G }}>♥ LVL 1</span>
              <span className="cursor-blink" style={{ color: D }}>_</span>
              <span style={{ color: G }}>{done}/{total} DONE</span>
            </div>

          </div>
        </PixelShell>

        {/* ── Buttons — overlaid on canvas-drawn button pixels ───────────── */}
        {buttons.map(({ label, sub, uid, onPress, cx }) => (
          <div key={uid} style={{ position: 'absolute', top: 399, left: cx - 26 }}>
            <Btn label={label} sub={sub} uid={uid} onPress={onPress} />
          </div>
        ))}

      </div>
    </div>
  )
}
