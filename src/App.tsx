import { useState, useEffect, useCallback } from 'react'
import PixelCanvas from './PixelCanvas'
import WakeUp from './WakeUp'

// ── Palette ───────────────────────────────────────────────────────────────────
const G   = '#74b83e'
const D   = '#3d6b1f'
const S   = '#0f1a0f'
const EYE = '#0a1a0a'

// ── Types ─────────────────────────────────────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'

// ── SVG Egg Shell ─────────────────────────────────────────────────────────────
// Symmetric cubic-bezier egg, 6px inset from the 460×740 bounds.
// Narrower at top, wider in middle — classic egg silhouette.
const EGG = 'M 230,6 C 420,6 454,180 454,370 C 454,580 380,734 230,734 C 80,734 6,580 6,370 C 6,180 40,6 230,6 Z'

// 4-step hard shading zones (drawn bottom→top, all clipped to egg).
// Each zone is a straight-edge polygon — hard pixel boundaries, no smooth edges.
// Rendered order: base → deep shadow → shadow → highlight → bright → outline
function EggShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: 460, height: 740, marginTop: -2 }}>

      {/* ── SVG shell — pixel-art 5-layer shading ─────────────────────── */}
      <svg
        width="460" height="740" viewBox="0 0 460 740"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id="egg-clip">
            <path d={EGG} />
          </clipPath>
        </defs>

        {/* 1. Base midtone — fills entire egg */}
        <path d={EGG} fill="#1a3320" shapeRendering="crispEdges" />

        {/* 2. Deep shadow — thin triangle at bottom-right edge */}
        <polygon
          points="140,740 460,510 460,740"
          fill="#070f07"
          clipPath="url(#egg-clip)"
          shapeRendering="crispEdges"
        />

        {/* 3. Shadow — lower-right third */}
        <polygon
          points="0,545 460,390 460,740 0,740"
          fill="#0d1a0d"
          clipPath="url(#egg-clip)"
          shapeRendering="crispEdges"
        />

        {/* 4. Highlight — upper-left zone */}
        <polygon
          points="0,0 310,0 190,355 0,400"
          fill="#2d5535"
          clipPath="url(#egg-clip)"
          shapeRendering="crispEdges"
        />

        {/* 5. Brightest highlight — small corner top-left */}
        <polygon
          points="0,0 130,0 55,205 0,225"
          fill="#3d6b2f"
          clipPath="url(#egg-clip)"
          shapeRendering="crispEdges"
        />

        {/* Outline — drawn last, on top of all shading */}
        <path
          d={EGG}
          fill="none"
          stroke="#0a1208"
          strokeWidth="3"
          shapeRendering="crispEdges"
        />
      </svg>

      {/* ── Content layer — sits above the SVG ────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 68, paddingBottom: 62,
        boxSizing: 'border-box',
      }}>
        {children}
      </div>

    </div>
  )
}

// ── SVG Button circles — 3-step hard shading ─────────────────────────────────
// Each button gets its own unique clipPath id to avoid conflicts.
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

      {/* Base */}
      <circle cx="26" cy="26" r="23"
        fill={down ? '#080e08' : '#0d1f10'}
        shapeRendering="crispEdges"
      />

      {/* Shadow — lower portion */}
      <polygon
        points="2,32 50,22 50,50 2,50"
        fill={down ? '#040804' : '#050f05'}
        clipPath={`url(#${clip})`}
        shapeRendering="crispEdges"
      />

      {/* Highlight — upper-left (only when not pressed) */}
      {!down && (
        <polygon
          points="2,2 42,2 26,22 2,26"
          fill="#2d5535"
          clipPath={`url(#${clip})`}
          shapeRendering="crispEdges"
        />
      )}

      {/* Outline */}
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
        {/* Label floats above SVG */}
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

// ── SVG Screen Frame — layered pixel-art rects ────────────────────────────────
// Outer 330×382: 4px dark border #0a1208 → 2px ring #1a2e1a → LCD 318×370
const FW = 330, FH = 382   // frame outer dims
const LW = 318, LH = 370   // LCD dims
const LX = 6,   LY = 6     // LCD offset (4px outer + 2px ring)

function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: FW, height: FH }}>

      {/* SVG frame layers */}
      <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>

        {/* Outer pixel frame */}
        <rect x="0" y="0" width={FW} height={FH} rx="14"
          fill="#0a1208" shapeRendering="crispEdges" />

        {/* Inner ring */}
        <rect x="4" y="4" width={FW-8} height={FH-8} rx="11"
          fill="#1a2e1a" shapeRendering="crispEdges" />

        {/* LCD background */}
        <rect x={LX} y={LY} width={LW} height={LH} rx="9"
          fill={S} shapeRendering="crispEdges" />

      </svg>

      {/* LCD content */}
      <div style={{
        position: 'absolute', top: LY, left: LX,
        width: LW, height: LH,
        borderRadius: 9,
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '11px 11px',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>

    </div>
  )
}

// ── Neru character ────────────────────────────────────────────────────────────
// Top half: #74b83e (lit), bottom half: #3d6b1f (shadow) — hard vertical split
// Eyes: dark 10×10 blocks + 2×2 bright shine at top-right
function Neru({ expr }: { expr: Expr }) {
  const sleeping = expr === 'sleeping'
  const eyeY = 15
  const twoTone = `linear-gradient(to bottom, ${G} 50%, ${D} 50%)`

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* z z Z */}
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
          // Closed: thin horizontal line eyes
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY + 4, width: 10, height: 3, background: EYE }} />
          </>
        ) : (
          // Open: 10×10 dark + 2×2 shine top-right
          <>
            <div style={{ position: 'absolute', left: 15, top: eyeY, width: 10, height: 10, background: EYE }} />
            <div style={{ position: 'absolute', left: 35, top: eyeY, width: 10, height: 10, background: EYE }} />
            <div style={{ position: 'absolute', left: 22, top: eyeY + 1, width: 2, height: 2, background: '#c8e6a0' }} />
            <div style={{ position: 'absolute', left: 42, top: eyeY + 1, width: 2, height: 2, background: '#c8e6a0' }} />
          </>
        )}

        {/* Mouth */}
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

      {/* Body 33×26 + arms (left=lit, right=shadow) */}
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Press Start 2P', monospace",
    }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>

        {/* ── Canvas preview ─────────────────────────────────────── */}
        <PixelCanvas />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Strap loop — SVG for crisp pixel look */}
        <svg width="38" height="22" viewBox="0 0 38 22"
          style={{ marginBottom: -3, position: 'relative', zIndex: 2 }}>
          <ellipse cx="19" cy="14" rx="16" ry="11"
            fill="#0d1a0d" stroke="#0a1208" strokeWidth="2"
            shapeRendering="crispEdges"
          />
        </svg>

        {/* ── EGG DEVICE ─────────────────────────────────────────────── */}
        <EggShell>

          {/* Brand engraving */}
          <div style={{ fontSize: 7, color: '#2d5535', letterSpacing: 5, marginBottom: 8, opacity: 0.9 }}>
            NERU
          </div>
          <div style={{ width: 50, height: 1, background: '#2d5535', opacity: 0.4, marginBottom: 22 }} />

          {/* Screen */}
          <ScreenFrame>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 8, color: G }}>NERU</span>
              <span style={{ fontSize: 8, color: D }}>{displayDate()}</span>
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 10 }} />

            {/* Character */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160, flexShrink: 0 }}>
              <Neru expr={expr} />
            </div>

            {/* Status bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 9 }}>
              <StatusBar label="HP" value={hp} max={10} />
              <StatusBar label="EN" value={en} max={8} />
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 8 }} />

            {/* Log */}
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
                  <span style={{ color: h.done ? D : G }}>{h.label}</span>
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

          </ScreenFrame>

          {/* Speaker dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 14 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d1a0d', border: '1px solid #2d5535' }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 14 }}>
            <Btn label="▲" sub="UP" uid="up" onPress={up} />
            <Btn label="●" sub="OK" uid="ok" onPress={ok} />
            <Btn label="▼" sub="DN" uid="dn" onPress={dn} />
          </div>

        </EggShell>
      </div>

      </div>
    </div>
  )
}
