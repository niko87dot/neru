import { useRef, useEffect } from 'react'

// ── Canvas dimensions ─────────────────────────────────────────────────────────
// 92×148 internal → 460×740 CSS (5× integer scale, same as SVG device)
const CW = 92
const CH = 148

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:    '#0a0a0a',
  e1:    '#0d1a0d',  // zone 1 — shadow (darkest)
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

// ── Egg: two half-ellipses joined at ECY=74 (midpoint of 148px) ───────────────
// Matches SVG egg proportions: top y≈1, bottom y≈147, widest at y=74 (radius ≈45)
// RX_TOP slightly narrower than RX_BOT for classic egg silhouette
const ECX = 46, ECY = 74

function inEgg(x: number, y: number): boolean {
  const dx = x - ECX, dy = y - ECY
  if (dy <= 0) return (dx * dx) / (42 * 42) + (dy * dy) / (73 * 73) <= 1
  return (dx * dx) / (44 * 44) + (dy * dy) / (73 * 73) <= 1
}

function isEggEdge(x: number, y: number): boolean {
  if (!inEgg(x, y)) return false
  return !inEgg(x - 1, y) || !inEgg(x + 1, y) ||
         !inEgg(x, y - 1) || !inEgg(x, y + 1)
}

// ── Shading zones — SVG polygon boundaries ÷5 (460×740 → 92×148) ─────────────
//
//  Deep shadow:  SVG "140,740 460,510 460,740"  →  (28,148)(92,102)(92,148)
//  Shadow:       SVG "0,545 460,390 460,740 0,740"→ (0,109)(92,78)(92,148)(0,148)
//  Highlight:    SVG "0,0 310,0 190,355 0,400"  →  (0,0)(62,0)(38,71)(0,80)
//  Bright:       SVG "0,0 130,0 55,205 0,225"   →  (0,0)(26,0)(11,41)(0,45)

function inDeepShadow(x: number, y: number): boolean {
  if (x < 28) return false
  // line (28,148)→(92,102): y = 148 - (46/64)*(x-28)
  return y >= 148 - (46 / 64) * (x - 28)
}

function inShadow(x: number, y: number): boolean {
  // line (0,109)→(92,78): y = 109 - (31/92)*x
  return y >= 109 - (31 / 92) * x
}

function inHighlight(x: number, y: number): boolean {
  if (x < 0 || y < 0) return false
  if (x >= 38) {
    // segment (62,0)→(38,71): y = 71*(62-x)/24
    return y <= 71 * (62 - x) / 24
  }
  // segment (38,71)→(0,80): y = 80 - (9/38)*x
  return y <= 80 - (9 / 38) * x
}

function inBright(x: number, y: number): boolean {
  if (x < 0 || y < 0) return false
  if (x >= 11) {
    // segment (26,0)→(11,41): y = 41*(26-x)/15
    return y <= 41 * (26 - x) / 15
  }
  // segment (11,41)→(0,45): y = 45 - (4/11)*x
  return y <= 45 - (4 / 11) * x
}

function eggColor(x: number, y: number): string {
  if (inDeepShadow(x, y) || inShadow(x, y)) return C.e1
  if (inBright(x, y))     return C.e4
  if (inHighlight(x, y))  return C.e3
  return C.e2
}

// ── Neru 8×8 head sprite — 3px per cell = 24×24 on canvas ────────────────────
// 0 = transparent, 1 = green, 2 = dark
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
const HEAD_X = 28
const HEAD_Y = 27

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
const BTN_Y = 88

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D) {
  // 1. Background
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, CW, CH)

  // 2. Egg fill — pixel by pixel
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (!inEgg(x, y)) continue
      ctx.fillStyle = eggColor(x, y)
      ctx.fillRect(x, y, 1, 1)
    }
  }

  // 3. Egg outline
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (isEggEdge(x, y)) {
        ctx.fillStyle = C.eEdge
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  // 4. Screen (border + fill)
  ctx.fillStyle = C.scrBr
  ctx.fillRect(20, 24, 39, 48)
  ctx.fillStyle = C.scrBg
  ctx.fillRect(21, 25, 37, 46)

  // 5. Neru head
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const v = HEAD[r][c]
      if (v === 0) continue
      ctx.fillStyle = v === 1 ? C.green : C.dark
      ctx.fillRect(HEAD_X + c * HEAD_SCALE, HEAD_Y + r * HEAD_SCALE, HEAD_SCALE, HEAD_SCALE)
    }
  }

  // 6. Three buttons
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
        width: 460,
        height: 740,
        imageRendering: 'pixelated',
        display: 'block',
      } as React.CSSProperties}
    />
  )
}
