import { useState, useEffect, useCallback, useRef } from 'react'

// ── Canvas — only draws the egg shell ────────────────────────────────────────
const CW = 92, CH = 148   // internal px; CSS 460×740 (5× scale)

// ── Palette ───────────────────────────────────────────────────────────────────
const G   = '#74b83e'
const D   = '#3d6b1f'
const S   = '#0f1a0f'
const EYE = '#0a1a0a'

// ── Egg geometry ──────────────────────────────────────────────────────────────
const ECX = 46, ECY = 74

function inEgg(x: number, y: number): boolean {
  const dx = x - ECX, dy = y - ECY
  if (dy <= 0) return (dx * dx) / (42 * 42) + (dy * dy) / (73 * 73) <= 1
  return (dx * dx) / (44 * 44) + (dy * dy) / (73 * 73) <= 1
}
function isEggEdge(x: number, y: number): boolean {
  if (!inEgg(x, y)) return false
  return !inEgg(x - 1, y) || !inEgg(x + 1, y) || !inEgg(x, y - 1) || !inEgg(x, y + 1)
}

// ── Shading zones — SVG polygon boundaries ÷5 ────────────────────────────────
function inDeepShadow(x: number, y: number): boolean {
  return x >= 28 && y >= 148 - (46 / 64) * (x - 28)
}
function inShadow(x: number, y: number): boolean {
  return y >= 109 - (31 / 92) * x
}
function inHighlight(x: number, y: number): boolean {
  if (x < 0 || y < 0) return false
  return x >= 38 ? y <= 71 * (62 - x) / 24 : y <= 80 - (9 / 38) * x
}
function inBright(x: number, y: number): boolean {
  if (x < 0 || y < 0) return false
  return x >= 11 ? y <= 41 * (26 - x) / 15 : y <= 45 - (4 / 11) * x
}
function eggColor(x: number, y: number): string {
  if (inDeepShadow(x, y) || inShadow(x, y)) return '#0d1a0d'
  if (inBright(x, y))    return '#3d6b2f'
  if (inHighlight(x, y)) return '#2d5535'
  return '#1a3320'
}

function drawEgg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, CW, CH)
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (!inEgg(x, y)) continue
      ctx.fillStyle = eggColor(x, y)
      ctx.fillRect(x, y, 1, 1)
    }
  }
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (isEggEdge(x, y)) {
        ctx.fillStyle = '#050e05'
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
}

// ── Screen frame — identical to App.tsx ──────────────────────────────────────
const FW = 330, FH = 382, LW = 318, LH = 370, LX = 6, LY = 6

function ScreenFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', width: FW, height: FH }}>
      <svg width={FW} height={FH} viewBox={`0 0 ${FW} ${FH}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <rect x="0" y="0" width={FW} height={FH} rx="14" fill="#0a1208" shapeRendering="crispEdges" />
        <rect x="4" y="4" width={FW - 8} height={FH - 8} rx="11" fill="#1a2e1a" shapeRendering="crispEdges" />
        <rect x={LX} y={LY} width={LW} height={LH} rx="9" fill={S} shapeRendering="crispEdges" />
      </svg>
      <div style={{
        position: 'absolute', top: LY, left: LX,
        width: LW, height: LH, borderRadius: 9, overflow: 'hidden',
        boxSizing: 'border-box', padding: '11px 11px',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Neru character — identical to App.tsx ────────────────────────────────────
type Expr = 'happy' | 'neutral' | 'sleeping'

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: G }} />
        <div style={{ width: 3, height: 16, background: G }} />
      </div>
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
      <div style={{ position: 'relative', marginTop: 5, flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: -7, top: 5,  width: 7, height: 13, background: G }} />
        <div style={{ position: 'absolute', right: -7, top: 5, width: 7, height: 13, background: D }} />
        <div style={{ width: 33, height: 26, background: twoTone }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 7, color: D, fontFamily: "'Press Start 2P', monospace", border: `1px solid ${D}`, padding: '3px 6px', letterSpacing: 1 }}>NERU</div>
    </div>
  )
}

// ── Status bar — identical to App.tsx ────────────────────────────────────────
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

// ── Buttons — SVG pixel-art circles, size-parameterised ──────────────────────
// Scales shading polygons from the 52×52 originals proportionally.
function PxBtnCircle({ uid, size, down }: { uid: string; size: number; down: boolean }) {
  const clip = `pbc-${uid}`
  const cx = size / 2, r = cx - 3
  const p = (v: number) => +((v / 52) * size).toFixed(1)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <defs>
        <clipPath id={clip}>
          <circle cx={cx} cy={cx} r={r} shapeRendering="crispEdges" />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill={down ? '#080e08' : '#0d1f10'} shapeRendering="crispEdges" />
      <polygon
        points={`${p(2)},${p(32)} ${p(50)},${p(22)} ${p(50)},${p(50)} ${p(2)},${p(50)}`}
        fill={down ? '#040804' : '#050f05'}
        clipPath={`url(#${clip})`}
        shapeRendering="crispEdges"
      />
      {!down && (
        <polygon
          points={`${p(2)},${p(2)} ${p(42)},${p(2)} ${p(26)},${p(22)} ${p(2)},${p(26)}`}
          fill="#2d5535"
          clipPath={`url(#${clip})`}
          shapeRendering="crispEdges"
        />
      )}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#0a1208" strokeWidth="2" shapeRendering="crispEdges" />
    </svg>
  )
}

function PxBtn({ label, sub, uid, size, onPress }: {
  label: string; sub: string; uid: string; size: number; onPress: () => void
}) {
  const [down, setDown] = useState(false)
  const fontSize = Math.round(12 * size / 52)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <button
        onPointerDown={(e) => { e.preventDefault(); setDown(true) }}
        onPointerUp={(e)   => { e.preventDefault(); setDown(false); onPress() }}
        onPointerLeave={()  => setDown(false)}
        style={{
          width: size, height: size,
          borderRadius: '50%', background: 'transparent',
          border: 'none', padding: 0, cursor: 'pointer',
          position: 'relative',
          transform: down ? 'translateY(3px)' : 'translateY(0)',
          transition: 'transform 50ms',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        <PxBtnCircle uid={uid} size={size} down={down} />
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: G, fontFamily: "'Press Start 2P', monospace", fontSize,
          pointerEvents: 'none',
        }}>
          {label}
        </span>
      </button>
      <span style={{ color: D, fontSize: 8, fontFamily: "'Press Start 2P', monospace" }}>{sub}</span>
    </div>
  )
}

// ── Habit state & persistence — own localStorage key ─────────────────────────
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
    const s = localStorage.getItem('neru-canvas-v1')
    if (!s) return null
    const { habits, date } = JSON.parse(s)
    if (date !== todayKey()) return null
    return habits
  } catch { return null }
}
function persist(habits: Habit[]) {
  localStorage.setItem('neru-canvas-v1', JSON.stringify({ habits, date: todayKey() }))
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [habits, setHabits] = useState<Habit[]>(() =>
    loadHabits() ?? HABITS_INIT.map(h => ({ ...h }))
  )
  const [focus, setFocus] = useState(0)

  // Draw egg shell once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawEgg(ctx)
  }, [])

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

  const done  = habits.filter(h => h.done).length
  const total = habits.length
  const hp    = Math.round((done / total) * 10)
  const en    = Math.round((done / total) * 8)
  const expr: Expr = done === total ? 'happy' : done === 0 ? 'sleeping' : 'neutral'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Press Start 2P', monospace" }}>

      {/* Strap loop — identical to App.tsx */}
      <svg width="38" height="22" viewBox="0 0 38 22"
        style={{ marginBottom: -3, position: 'relative', zIndex: 2 }}>
        <ellipse cx="19" cy="14" rx="16" ry="11"
          fill="#0d1a0d" stroke="#0a1208" strokeWidth="2" shapeRendering="crispEdges" />
      </svg>

      {/* ── Egg container: canvas shell + HTML overlay ───────────────────── */}
      <div style={{ position: 'relative', width: 460, height: 740, marginTop: -2 }}>

        {/* Pixel canvas shell (egg only) */}
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: 460, height: 740,
            imageRendering: 'pixelated',
          } as React.CSSProperties}
        />

        {/* HTML content overlay — mirrors EggShell content div from App.tsx */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 68, paddingBottom: 62,
          boxSizing: 'border-box',
        }}>

          {/* Brand engraving */}
          <div style={{ fontSize: 7, color: '#2d5535', letterSpacing: 5, marginBottom: 8, opacity: 0.9 }}>
            NERU
          </div>
          <div style={{ width: 50, height: 1, background: '#2d5535', opacity: 0.4, marginBottom: 22 }} />

          {/* Screen */}
          <ScreenFrame>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 8, color: G }}>NERU</span>
              <span style={{ fontSize: 8, color: D }}>{displayDate()}</span>
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 10 }} />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160, flexShrink: 0 }}>
              <Neru expr={expr} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 9 }}>
              <StatusBar label="HP" value={hp} max={10} />
              <StatusBar label="EN" value={en} max={8} />
            </div>
            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 8 }} />

            <div style={{ fontSize: 7, color: D, marginBottom: 8 }}>// DAILY LOG</div>

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

            <div style={{ height: 1, background: D, opacity: 0.35, marginBottom: 6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 7 }}>
              <span style={{ color: G }}>♥ LVL 1</span>
              <span className="cursor-blink" style={{ color: D }}>_</span>
              <span style={{ color: G }}>{done}/{total} DONE</span>
            </div>

          </ScreenFrame>

          {/* Speaker dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 14 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d1a0d', border: '1px solid #2d5535' }} />
            ))}
          </div>

          {/* Buttons — 56px outer, 64px middle */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 14 }}>
            <PxBtn label="▲" sub="UP" uid="pc-up" size={56} onPress={up} />
            <PxBtn label="●" sub="OK" uid="pc-ok" size={64} onPress={ok} />
            <PxBtn label="▼" sub="DN" uid="pc-dn" size={56} onPress={dn} />
          </div>

        </div>
      </div>
    </div>
  )
}
