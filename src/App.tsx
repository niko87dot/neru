import { useState, useEffect, useCallback } from 'react'

// ── Palette ──────────────────────────────────────────────────────────────────
const G   = '#74b83e'   // bright green — primary
const D   = '#3d6b1f'   // dark green   — secondary / labels
const S   = '#0f1a0f'   // screen bg
const K   = '#1a3320'   // case bg
const EYE = '#0a1a0a'   // character eye / detail color

// ── Types ────────────────────────────────────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'

// ── Neru character ───────────────────────────────────────────────────────────
// All blocks at 5px unit.
// Head: 60×50px  Eyes: 10×10px, 10px apart, centered
// Mouth: 5×5px blocks  Antenna: 3px stem × 16px + 8px ball
// Body: 33×26px  Arms: 7×13px  Total height ≈ 120px
function Neru({ expr }: { expr: Expr }) {
  const sleeping = expr === 'sleeping'
  const eyeY = 15  // 15px from top of 50px head

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Floating z z Z */}
      {sleeping && (
        <div style={{
          position: 'absolute', top: 4, right: -38,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        }}>
          <span className="zzz-c" style={{ fontSize: 10, color: D, fontFamily: "'Press Start 2P', monospace", display: 'block' }}>Z</span>
          <span className="zzz-b" style={{ fontSize: 8,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 2 }}>z</span>
          <span className="zzz-a" style={{ fontSize: 6,  color: D, fontFamily: "'Press Start 2P', monospace", display: 'block', marginRight: 4 }}>z</span>
        </div>
      )}

      {/* Antenna — 3px stem, 8px ball */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 8,  height: 8,  borderRadius: '50%', background: G }} />
        <div style={{ width: 3,  height: 16, background: G }} />
      </div>

      {/* Head — 60×50 */}
      <div style={{ position: 'relative', width: 60, height: 50, background: G, flexShrink: 0 }}>

        {/* Eyes — open: 10×10; sleeping: 10×3 closed lines */}
        {sleeping ? (
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY, width: 10, height: 10, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY, width: 10, height: 10, background: EYE }} />
          </>
        )}

        {/* Mouth — 5×5px blocks */}
        {expr === 'happy' && (
          // U-shape: corners higher, center drops 5px
          <>
            <div style={{ position: 'absolute', left: 13, top: 38, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 28, top: 43, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 42, top: 38, width: 5, height: 5, background: EYE }} />
          </>
        )}
        {expr === 'neutral' && (
          // Flat line
          <>
            <div style={{ position: 'absolute', left: 13, top: 40, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 28, top: 40, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 42, top: 40, width: 5, height: 5, background: EYE }} />
          </>
        )}
        {expr === 'sleeping' && (
          // ∩-frown: center rises 5px, corners drop
          <>
            <div style={{ position: 'absolute', left: 13, top: 43, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 28, top: 38, width: 5, height: 5, background: EYE }} />
            <div style={{ position: 'absolute', left: 42, top: 43, width: 5, height: 5, background: EYE }} />
          </>
        )}
      </div>

      {/* Body 33×26 + arms 7×13 */}
      <div style={{ position: 'relative', marginTop: 5, flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: -7, top: 5,  width: 7, height: 13, background: G }} />
        <div style={{ position: 'absolute', right: -7, top: 5, width: 7, height: 13, background: G }} />
        <div style={{ width: 33, height: 26, background: G }} />
      </div>

      {/* Nametag */}
      <div style={{
        marginTop: 8,
        fontSize: 7,
        color: D,
        fontFamily: "'Press Start 2P', monospace",
        border: `1px solid ${D}`,
        padding: '3px 6px',
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

// ── Device button ────────────────────────────────────────────────────────────
function Btn({ label, sub, onPress }: { label: string; sub: string; onPress: () => void }) {
  const [down, setDown] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        onPointerDown={(e) => { e.preventDefault(); setDown(true) }}
        onPointerUp={(e)   => { e.preventDefault(); setDown(false); onPress() }}
        onPointerLeave={()  => setDown(false)}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#0d1f10',
          border: '2px solid #2d5535',
          boxShadow: down
            ? '0 1px 0 #040c06, inset 0 2px 0 #162812, inset 0 -1px 0 #040c06'
            : '0 4px 0 #051008, inset 0 2px 0 #2d5535, inset 0 -2px 0 #051008',
          transform: down ? 'translateY(4px)' : 'translateY(0)',
          transition: 'transform 50ms, box-shadow 50ms',
          cursor: 'pointer',
          color: G,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
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
      <span style={{ color: D, fontSize: 7, fontFamily: "'Press Start 2P', monospace" }}>{sub}</span>
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
          width: 34,
          height: 20,
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          background: '#0a1a0e',
          border: '1px solid #2d5535',
          borderBottom: 'none',
          position: 'relative',
          zIndex: 2,
        }} />

        {/* ── EGG CASE 460×740 ───────────────────────────────────────────── */}
        <div style={{
          width: 460,
          height: 740,
          borderRadius: '48% 48% 44% 44% / 38% 38% 52% 52%',
          background: K,
          borderTop:    '3px solid #2d5535',
          borderLeft:   '3px solid #2d5535',
          borderBottom: '3px solid #0a1208',
          borderRight:  '3px solid #0a1208',
          boxShadow: [
            '0 12px 40px rgba(0,0,0,0.9)',
            '0 4px 12px rgba(0,0,0,0.6)',
            'inset 0 4px 8px rgba(0,0,0,0.4)',
            'inset 0 -2px 4px rgba(255,255,255,0.03)',
          ].join(', '),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 68,
          paddingBottom: 62,
          marginTop: -2,
          position: 'relative',
        }}>

          {/* Brand engraving */}
          <div style={{ fontSize: 7, color: '#2d5535', letterSpacing: 5, marginBottom: 8, opacity: 0.9 }}>
            NERU
          </div>
          <div style={{ width: 50, height: 1, background: '#2d5535', opacity: 0.4, marginBottom: 22 }} />

          {/* ── SCREEN 330×370 ─────────────────────────────────────────── */}
          {/* Outer bezel */}
          <div style={{
            width: 330,
            borderRadius: 14,
            background: '#0c180c',
            padding: 3,
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.6)',
          }}>
            {/* Inner LCD panel */}
            <div style={{
              width: '100%',
              height: 370,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 8, color: G }}>NERU</span>
                <span style={{ fontSize: 8, color: D }}>{displayDate()}</span>
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 10 }} />

              {/* Character zone */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160, flexShrink: 0 }}>
                <Neru expr={expr} />
              </div>

              {/* Status bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 9 }}>
                <StatusBar label="HP" value={hp} max={10} />
                <StatusBar label="EN" value={en} max={8} />
              </div>
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 8 }} />

              {/* Log section */}
              <div style={{ fontSize: 7, color: D, marginBottom: 8 }}>// DAILY LOG</div>

              {/* Habits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {habits.map((h, i) => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 7 }}>
                    <span style={{ width: 10, color: G, display: 'inline-block', flexShrink: 0 }}>
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
              <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 6 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 7 }}>
                <span style={{ color: G }}>♥ LVL 1</span>
                <span className="cursor-blink" style={{ color: D }}>_</span>
                <span style={{ color: G }}>{done}/{total} DONE</span>
              </div>

            </div>
          </div>

          {/* Speaker dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 14 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#193520', border: '1px solid #2d5535' }} />
            ))}
          </div>

          {/* ── BUTTONS ────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 14 }}>
            <Btn label="▲" sub="UP" onPress={up} />
            <Btn label="●" sub="OK" onPress={ok} />
            <Btn label="▼" sub="DN" onPress={dn} />
          </div>

        </div>
      </div>
    </div>
  )
}
