import { useState, useEffect, useCallback } from 'react'

// ── Palette ──────────────────────────────────────────────────────────────────
const G   = '#74b83e'   // bright green — primary
const D   = '#3d6b1f'   // dark green   — secondary / labels
const S   = '#0f1a0f'   // screen bg
const K   = '#1a3320'   // case bg
const EYE = '#0f1a0f'   // character eye / detail color

// ── Types ────────────────────────────────────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'

// ── Neru character ───────────────────────────────────────────────────────────
// Head: 48×48px square
// Eyes: two 8×8px squares (#0f1a0f), 8px apart, centered
// Mouth: 3 pixel-blocks arranged by expression
// Antenna: 4px stem 16px tall + 6px ball
// Body: 32×24px, 4px below head
// Arms: 8×8px each side, offset 4px from top of body
// Total height ≈ 110px
function Neru({ expr }: { expr: Expr }) {
  const sleeping = expr === 'sleeping'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Floating z z Z */}
      {sleeping && (
        <div style={{
          position: 'absolute', top: 4, right: -30,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        }}>
          <span className="zzz-c" style={{ fontSize: 9,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block' }}>Z</span>
          <span className="zzz-b" style={{ fontSize: 7,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 2 }}>z</span>
          <span className="zzz-a" style={{ fontSize: 5,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 5 }}>z</span>
        </div>
      )}

      {/* Antenna */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 6,  height: 6,  borderRadius: '50%', background: G }} />
        <div style={{ width: 4,  height: 16, background: G }} />
      </div>

      {/* Head — 48×48 */}
      <div style={{ position: 'relative', width: 48, height: 48, background: G, flexShrink: 0 }}>

        {/* Eyes — open: 8×8 squares; sleeping: thin 8×3 lines */}
        {sleeping ? (
          <>
            <div style={{ position: 'absolute', left: 12, top: 18, width: 8, height: 3, background: EYE }} />
            <div style={{ position: 'absolute', left: 28, top: 18, width: 8, height: 3, background: EYE }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', left: 12, top: 14, width: 8, height: 8, background: EYE }} />
            <div style={{ position: 'absolute', left: 28, top: 14, width: 8, height: 8, background: EYE }} />
          </>
        )}

        {/* Mouth */}
        {expr === 'happy' && (
          // U-shape smile: corners level, center drops
          <>
            <div style={{ position: 'absolute', left: 10, top: 34, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 22, top: 38, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 34, top: 34, width: 4, height: 4, background: EYE }} />
          </>
        )}
        {expr === 'neutral' && (
          // Flat horizontal line
          <>
            <div style={{ position: 'absolute', left: 12, top: 36, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 22, top: 36, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 32, top: 36, width: 4, height: 4, background: EYE }} />
          </>
        )}
        {expr === 'sleeping' && (
          // ∩-shape frown: corners drop, center rises
          <>
            <div style={{ position: 'absolute', left: 10, top: 38, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 22, top: 34, width: 4, height: 4, background: EYE }} />
            <div style={{ position: 'absolute', left: 34, top: 38, width: 4, height: 4, background: EYE }} />
          </>
        )}
      </div>

      {/* Body 32×24 + arms 8×8 */}
      <div style={{ position: 'relative', marginTop: 4, flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: -8, top: 4,  width: 8, height: 8, background: G }} />
        <div style={{ position: 'absolute', right: -8, top: 4, width: 8, height: 8, background: G }} />
        <div style={{ width: 32, height: 24, background: G }} />
      </div>

      {/* Nametag */}
      <div style={{
        marginTop: 7,
        fontSize: 6,
        color: D,
        fontFamily: "'Press Start 2P', monospace",
        border: `1px solid ${D}`,
        padding: '2px 5px',
        letterSpacing: 1,
      }}>
        NERU
      </div>
    </div>
  )
}

// ── Status bar ───────────────────────────────────────────────────────────────
function StatusBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Press Start 2P', monospace", fontSize: 6 }}>
      <span style={{ color: D, width: 16, display: 'inline-block' }}>{label}</span>
      <span style={{ color: D }}>[</span>
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ width: 9, height: 6, background: i < value ? G : '#152a15', flexShrink: 0 }} />
        ))}
      </div>
      <span style={{ color: D }}>]</span>
      <span style={{ color: G, minWidth: 32, textAlign: 'right' }}>{value}/{max}</span>
    </div>
  )
}

// ── Device button ────────────────────────────────────────────────────────────
function Btn({ label, sub, onPress }: { label: string; sub: string; onPress: () => void }) {
  const [down, setDown] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <button
        onPointerDown={(e) => { e.preventDefault(); setDown(true) }}
        onPointerUp={(e)   => { e.preventDefault(); setDown(false); onPress() }}
        onPointerLeave={()  => setDown(false)}
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: '#0d1f10',
          border: '2px solid #2d5535',
          boxShadow: down
            ? '0 1px 0 #051008, inset 0 1px 2px rgba(0,0,0,0.4)'
            : '0 4px 0 #051008, 0 5px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(45,85,53,0.4)',
          transform: down ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 50ms, box-shadow 50ms',
          cursor: 'pointer',
          color: G,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        {label}
      </button>
      <span style={{ color: D, fontSize: 6, fontFamily: "'Press Start 2P', monospace" }}>{sub}</span>
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
  const [habits, setHabits] = useState<Habit[]>(() =>
    loadHabits() ?? HABITS_INIT.map(h => ({ ...h }))
  )
  const [focus, setFocus] = useState(0)

  useEffect(() => { persist(habits) }, [habits])

  useEffect(() => {
    const id = setInterval(() => {
      if (!loadHabits()) {
        const fresh = HABITS_INIT.map(h => ({ ...h }))
        setHabits(fresh)
        persist(fresh)
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Strap loop */}
        <div style={{
          width: 26,
          height: 16,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          background: '#0a1a0e',
          border: '1px solid #2d5535',
          borderBottom: 'none',
          position: 'relative',
          zIndex: 2,
        }} />

        {/* ── EGG CASE 340×580 ───────────────────────────────────────────── */}
        <div style={{
          width: 340,
          height: 580,
          borderRadius: '50% 50% 45% 45% / 40% 40% 50% 50%',
          background: K,
          border: '3px solid #0d1f10',
          boxShadow: [
            '0 10px 40px rgba(0,0,0,0.85)',
            'inset 0 1px 0 rgba(255,255,255,0.04)',
            'inset 2px 0 0 rgba(45,85,53,0.25)',
          ].join(', '),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 36,
          paddingBottom: 32,
          marginTop: -2,
          position: 'relative',
        }}>

          {/* Brand engraving */}
          <div style={{ fontSize: 7, color: '#2d5535', letterSpacing: 5, marginBottom: 6, opacity: 0.9 }}>
            NERU
          </div>
          <div style={{ width: 44, height: 1, background: '#2d5535', opacity: 0.4, marginBottom: 16 }} />

          {/* ── SCREEN 280×320 ─────────────────────────────────────────── */}
          {/* Outer bezel */}
          <div style={{
            width: 280,
            borderRadius: 12,
            background: '#0c180c',
            padding: 3,
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.6)',
          }}>
            {/* Inner LCD panel */}
            <div style={{
              width: '100%',
              height: 320,
              borderRadius: 9,
              background: S,
              border: '1px solid #192a19',
              boxShadow: 'inset 0 0 20px rgba(116,184,62,0.07)',
              padding: '11px 12px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 7, color: G }}>NERU</span>
                <span style={{ fontSize: 7, color: D }}>{displayDate()}</span>
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 8 }} />

              {/* Character zone */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 130, flexShrink: 0 }}>
                <Neru expr={expr} />
              </div>

              {/* Status bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
                <StatusBar label="HP" value={hp} max={10} />
                <StatusBar label="EN" value={en} max={8} />
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 6 }} />

              {/* Log section */}
              <div style={{ fontSize: 6, color: D, marginBottom: 6 }}>// DAILY LOG</div>

              {/* Habits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {habits.map((h, i) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 6 }}>
                    <span style={{ width: 9, color: G, display: 'inline-block', flexShrink: 0 }}>
                      {i === focus ? '►' : ''}
                    </span>
                    <span style={{ color: h.done ? G : D, flexShrink: 0 }}>
                      {h.done ? '[X]' : '[ ]'}
                    </span>
                    <span style={{ color: h.done ? D : G }}>
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom HUD */}
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 5 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 6 }}>
                <span style={{ color: G }}>♥ LVL 1</span>
                <span className="cursor-blink" style={{ color: D }}>_</span>
                <span style={{ color: G }}>{done}/{total} DONE</span>
              </div>

            </div>
          </div>

          {/* Speaker dots */}
          <div style={{ display: 'flex', gap: 7, marginTop: 16, marginBottom: 8 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#193520', border: '1px solid #2d5535' }} />
            ))}
          </div>

          {/* ── BUTTONS ────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 8 }}>
            <Btn label="▲" sub="UP" onPress={up} />
            <Btn label="●" sub="OK" onPress={ok} />
            <Btn label="▼" sub="DN" onPress={dn} />
          </div>

        </div>
      </div>
    </div>
  )
}
