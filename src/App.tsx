import { useState, useEffect, useCallback } from 'react'

// ── Palette ──────────────────────────────────────────────────────────────────
const G  = '#74b83e'  // bright green — primary
const D  = '#3d6b1f'  // dark green   — secondary / labels
const S  = '#0f1a0f'  // screen bg
const K  = '#1a3320'  // case bg

// ── Types ────────────────────────────────────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'
type PxVal = 0 | 1 | 2   // 0=transparent  1=bright  2=dark
type Row = PxVal[]

// ── Pixel size ───────────────────────────────────────────────────────────────
const P = 3  // px per pixel

// ── Pixel art data ───────────────────────────────────────────────────────────
// Head 10×10 grid.  0=transparent  1=#74b83e  2=#3d6b1f
// Mouth rows (6–7):
//   happy   → smile (U)    row6=[1,0,...,0,1]  row7=[1,1,0,0,0,0,0,0,1,1]
//   neutral → flat line    row6=[1,1,...,1,1]  row7=[1,1,0,0,0,0,0,0,1,1]
//   sleeping→ frown (∩)   row6=[1,1,0,0,0,0,0,0,1,1]  row7=[1,0,...,0,1]

const HEADS: Record<Expr, Row[]> = {
  happy: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,1,0,0,0,0,0,0,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
  ],
  neutral: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,2,2,1,1,2,2,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
  ],
  sleeping: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],  // eyes closed (no 2-block)
    [1,2,2,2,1,1,2,2,2,1],  // single-line closed eyes
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0,0,1,1],  // frown top
    [1,0,1,1,1,1,1,1,0,1],  // frown corners
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
  ],
}

// Body 12×5 (cols 0-2 & 9-11 are arms, active only rows 1-2)
const BODY: Row[] = [
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
]

// ── Pixel renderer ───────────────────────────────────────────────────────────
function PixelGrid({ rows }: { rows: Row[] }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', imageRendering: 'pixelated' }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map((c, ci) => (
            <div
              key={ci}
              style={{
                width: P,
                height: P,
                background: c === 0 ? 'transparent' : c === 1 ? G : D,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Neru character ───────────────────────────────────────────────────────────
function Neru({ expr }: { expr: Expr }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Floating z z Z when sleeping */}
      {expr === 'sleeping' && (
        <div style={{ position: 'absolute', top: 2, right: -22, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
          <span className="zzz-c" style={{ fontSize: 7, color: D, fontFamily: "'Press Start 2P', monospace", display: 'block' }}>Z</span>
          <span className="zzz-b" style={{ fontSize: 5, color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 1 }}>z</span>
          <span className="zzz-a" style={{ fontSize: 4, color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 3 }}>z</span>
        </div>
      )}

      {/* Antenna — width anchored to head (P*10 = 30px) */}
      <div style={{ width: P * 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: P * 3, height: P * 3, borderRadius: '50%', background: G, flexShrink: 0 }} />
        <div style={{ width: P * 2, height: P * 4, background: G, flexShrink: 0 }} />
      </div>

      {/* Head */}
      <PixelGrid rows={HEADS[expr]} />

      {/* Body + arms */}
      <div style={{ marginTop: P * 2 }}>
        <PixelGrid rows={BODY} />
      </div>

      {/* Nametag */}
      <div style={{
        marginTop: 5,
        fontSize: 5,
        color: D,
        fontFamily: "'Press Start 2P', monospace",
        border: `1px solid ${D}`,
        padding: '1px 4px',
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: "'Press Start 2P', monospace", fontSize: 5 }}>
      <span style={{ color: D, width: 14, display: 'inline-block' }}>{label}</span>
      <span style={{ color: D }}>[</span>
      <div style={{ display: 'flex', gap: 1 }}>
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            style={{ width: 7, height: 5, background: i < value ? G : '#152a15', flexShrink: 0 }}
          />
        ))}
      </div>
      <span style={{ color: D }}>]</span>
      <span style={{ color: G, minWidth: 28, textAlign: 'right' }}>{value}/{max}</span>
    </div>
  )
}

// ── Device button ────────────────────────────────────────────────────────────
function Btn({ label, sub, onPress }: { label: string; sub: string; onPress: () => void }) {
  const [down, setDown] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button
        onPointerDown={(e) => { e.preventDefault(); setDown(true) }}
        onPointerUp={(e)   => { e.preventDefault(); setDown(false); onPress() }}
        onPointerLeave={()  => setDown(false)}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#0d1f10',
          border: '2px solid #2d5535',
          boxShadow: down
            ? '0 1px 0 #051008, inset 0 1px 2px rgba(0,0,0,0.4)'
            : '0 3px 0 #051008, 0 4px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(45,85,53,0.4)',
          transform: down ? 'translateY(2px)' : 'translateY(0)',
          transition: 'transform 50ms, box-shadow 50ms',
          cursor: 'pointer',
          color: G,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
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
      <span style={{ color: D, fontSize: 5, fontFamily: "'Press Start 2P', monospace" }}>{sub}</span>
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

  // Persist on every change
  useEffect(() => { persist(habits) }, [habits])

  // Midnight reset check
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

  // Button actions
  const up = useCallback(() => setFocus(f => Math.max(0, f - 1)), [])
  const dn = useCallback(() => setFocus(f => Math.min(HABITS_INIT.length - 1, f + 1)), [])
  const ok = useCallback(() => {
    setHabits(prev => prev.map((h, i) => i === focus ? { ...h, done: !h.done } : h))
  }, [focus])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')                { e.preventDefault(); up() }
      else if (e.key === 'ArrowDown')         { e.preventDefault(); dn() }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); ok() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [up, dn, ok])

  // Derived state
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
          width: 22,
          height: 14,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          background: '#0a1a0e',
          border: '1px solid #2d5535',
          borderBottom: 'none',
          position: 'relative',
          zIndex: 2,
        }} />

        {/* ── EGG CASE ───────────────────────────────────────────────────── */}
        <div style={{
          width: 280,
          height: 480,
          borderRadius: '50% 50% 45% 45% / 40% 40% 50% 50%',
          background: K,
          border: '3px solid #0d1f10',
          boxShadow: [
            '0 8px 32px rgba(0,0,0,0.85)',
            'inset 0 1px 0 rgba(255,255,255,0.04)',
            'inset 2px 0 0 rgba(45,85,53,0.25)',
          ].join(', '),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 30,
          paddingBottom: 28,
          marginTop: -2,
          position: 'relative',
        }}>
          {/* Brand engraving */}
          <div style={{ fontSize: 6, color: '#2d5535', letterSpacing: 4, marginBottom: 5, opacity: 0.9 }}>
            NERU
          </div>
          <div style={{ width: 36, height: 1, background: '#2d5535', opacity: 0.45, marginBottom: 14 }} />

          {/* ── SCREEN ─────────────────────────────────────────────────── */}
          {/* Outer bezel */}
          <div style={{
            width: 220,
            borderRadius: 10,
            background: '#0c180c',
            padding: 3,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
          }}>
            {/* Inner LCD panel */}
            <div style={{
              width: '100%',
              height: 256,
              borderRadius: 7,
              background: S,
              border: '1px solid #192a19',
              boxShadow: 'inset 0 0 18px rgba(116,184,62,0.07)',
              padding: '9px 9px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 6, color: G }}>NERU</span>
                <span style={{ fontSize: 6, color: D }}>{displayDate()}</span>
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 6 }} />

              {/* Character zone */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 102, flexShrink: 0 }}>
                <Neru expr={expr} />
              </div>

              {/* Status bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
                <StatusBar label="HP" value={hp} max={10} />
                <StatusBar label="EN" value={en} max={8} />
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 5 }} />

              {/* Log section */}
              <div style={{ fontSize: 5, color: D, marginBottom: 5 }}>// DAILY LOG</div>

              {/* Habits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {habits.map((h, i) => (
                  <div
                    key={h.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 5 }}
                  >
                    <span style={{ width: 7, color: G, display: 'inline-block', flexShrink: 0 }}>
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
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 5 }}>
                <span style={{ color: G }}>♥ LVL 1</span>
                <span className="cursor-blink" style={{ color: D }}>_</span>
                <span style={{ color: G }}>{done}/{total} DONE</span>
              </div>

            </div>
          </div>

          {/* Speaker dots */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, marginBottom: 6 }}>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                style={{ width: 4, height: 4, borderRadius: '50%', background: '#193520', border: '1px solid #2d5535' }}
              />
            ))}
          </div>

          {/* ── BUTTONS ────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 6 }}>
            <Btn label="▲" sub="UP" onPress={up} />
            <Btn label="●" sub="OK" onPress={ok} />
            <Btn label="▼" sub="DN" onPress={dn} />
          </div>

        </div>
      </div>
    </div>
  )
}
