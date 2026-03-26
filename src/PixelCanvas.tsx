import { useRef, useEffect } from 'react'

// ── Canvas size ───────────────────────────────────────────────────────────────
const CW = 80   // internal canvas width  (each pixel = 5 display px)
const CH = 130  // internal canvas height

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:    '#0a0a0a',
  e1:    '#0d1a0d',  // zone 1 — darkest (shadow)
  e2:    '#1a3320',  // zone 2 — base midtone
  e3:    '#2d5535',  // zone 3 — highlight upper-left
  e4:    '#3d6b2f',  // zone 4 — brightest point
  eEdge: '#050e05',  // egg outline
  scrBg: '#0f1a0f',
  scrBr: '#3d6b1f',
  green: '#74b83e',
  dark:  '#0f1a0f',
  btnLo: '#0d1a0d',
  btnHi: '#2d5535',
}

// ── Egg: two half-ellipses joined at ECY ──────────────────────────────────────
// Upper (dy≤0): rx=30 ry=60 → narrow/pointed top
// Lower (dy>0): rx=35 ry=56 → wide/rounded bottom
const ECX = 40, ECY = 66

function inEgg(x: number, y: number): boolean {
  const dx = x - ECX, dy = y - ECY
  if (dy <= 0) return (dx * dx) / (30 * 30) + (dy * dy) / (60 * 60) <= 1
  return (dx * dx) / (35 * 35) + (dy * dy) / (56 * 56) <= 1
}

// Zone boundaries — diagonal lines scaled from 460×740 SVG shading zones
function eggColor(x: number, y: number): string {
  // Shadow zone: below line (0,96)→(80,68)
  const shadow = y >= 96 - 0.35 * x
  // Deep shadow: x≥24 and below line (24,130)→(80,89)
  const deepShadow = x >= 24 && y >= 130 - (41 / 56) * (x - 24)
  // Highlight: x≤54 and above line (54,0)→(0,70)
  const highlight = x <= 54 && y <= 70 * (1 - x / 54)
  // Bright highlight: x≤23 and above line (23,0)→(0,40)
  const bright = x <= 23 && y <= 40 * (1 - x / 23)

  if (deepShadow || shadow) return C.e1
  if (bright)               return C.e4
  if (highlight)            return C.e3
  return C.e2
}

function isEggEdge(x: number, y: number): boolean {
  if (!inEgg(x, y)) return false
  return !inEgg(x - 1, y) || !inEgg(x + 1, y) ||
         !inEgg(x, y - 1) || !inEgg(x, y + 1)
}

// ── Neru 8×8 head sprite — drawn at 3px per cell = 24×24 on canvas ───────────
// 0 = transparent, 1 = green, 2 = dark (eyes / mouth)
const HEAD = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 1, 1, 2, 2, 1],  // eyes
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 1, 1, 1, 1, 2, 1],  // smile corners
  [1, 1, 2, 2, 2, 2, 1, 1],  // smile arc
  [0, 1, 1, 1, 1, 1, 1, 0],
]
const HEAD_SCALE = 3
const HEAD_X = 28   // top-left x in canvas pixels
const HEAD_Y = 27   // top-left y in canvas pixels

// ── 7×7 pixel-circle pattern ─────────────────────────────────────────────────
const CIRCLE = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 0, 0],
]
const BTN_CENTERS_X = [20, 40, 60]
const BTN_Y = 88  // button circle center y

// ── Draw everything ───────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D) {
  // 1. Background
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, CW, CH)

  // 2. Egg — pixel by pixel with zone color
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (!inEgg(x, y)) continue
      ctx.fillStyle = eggColor(x, y)
      ctx.fillRect(x, y, 1, 1)
    }
  }

  // 3. Egg outline (drawn after fill so it sits on top)
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (isEggEdge(x, y)) {
        ctx.fillStyle = C.eEdge
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  // 4. Screen — border rect then inner fill
  ctx.fillStyle = C.scrBr
  ctx.fillRect(20, 24, 39, 48)   // 1-px border ring
  ctx.fillStyle = C.scrBg
  ctx.fillRect(21, 25, 37, 46)   // LCD background

  // 5. Neru head — 8×8 sprite at HEAD_SCALE px/cell
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = HEAD[r][c]
      if (v === 0) continue
      ctx.fillStyle = v === 1 ? C.green : C.dark
      ctx.fillRect(HEAD_X + c * HEAD_SCALE, HEAD_Y + r * HEAD_SCALE, HEAD_SCALE, HEAD_SCALE)
    }
  }

  // 6. Three buttons — 7×7 pixel circles, two-tone shading
  for (const bx of BTN_CENTERS_X) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (!CIRCLE[r][c]) continue
        ctx.fillStyle = r + c < 6 ? C.btnHi : C.btnLo
        ctx.fillRect(bx - 3 + c, BTN_Y - 3 + r, 1, 1)
      }
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PixelCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    draw(ctx)
  }, [])

  return (
    <canvas
      ref={ref}
      width={CW}
      height={CH}
      style={{
        width: 400,
        height: 650,
        imageRendering: 'pixelated',
        display: 'block',
      } as React.CSSProperties}
    />
  )
}
