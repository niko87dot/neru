import { useRef, useEffect } from 'react'

// ── Canvas dimensions ─────────────────────────────────────────────────────────
const CW = 80    // canvas pixels wide
const CH = 130   // canvas pixels tall

// ── Egg shape ─────────────────────────────────────────────────────────────────
// Two half-ellipses joined at cy=65:
//   upper half (dy ≤ 0): rx=29 ry=62 → narrow / pointed top
//   lower half (dy > 0):  rx=35 ry=56 → wide  / rounded bottom
const CX = 40, CY = 65

function insideEgg(x: number, y: number): boolean {
  const dx = x - CX
  const dy = y - CY
  if (dy <= 0) return (dx * dx) / (29 * 29) + (dy * dy) / (62 * 62) <= 1
  return (dx * dx) / (35 * 35) + (dy * dy) / (56 * 56) <= 1
}

function isEdge(x: number, y: number): boolean {
  if (!insideEgg(x, y)) return false
  return (
    !insideEgg(x - 1, y) || !insideEgg(x + 1, y) ||
    !insideEgg(x, y - 1) || !insideEgg(x, y + 1)
  )
}

// ── Shading zones (scaled from 460×740 SVG space → 80×130) ───────────────────
// Shadow:      above line from (0, 96) → (80, 69)
// Deep shadow: above line from (24, 130) → (80, 89)
// Highlight:   below line from (0, 70) → (54, 0)
// Bright:      below line from (0, 40) → (23, 0)

function inShadow(x: number, y: number): boolean {
  // line: y = 96 - (27/80)*x
  return y >= 96 - (27 / 80) * x
}

function inDeepShadow(x: number, y: number): boolean {
  if (x < 24) return false
  // line: y = 130 - (41/56)*(x-24)
  return y >= 130 - (41 / 56) * (x - 24)
}

function inHighlight(x: number, y: number): boolean {
  if (x > 54) return false
  // line: y = 70*(1 - x/54)
  return y <= 70 * (1 - x / 54)
}

function inBrightHighlight(x: number, y: number): boolean {
  if (x > 23) return false
  // line: y = 40*(1 - x/23)
  return y <= 40 * (1 - x / 23)
}

// ── Draw ─────────────────────────────────────────────────────────────────────
function drawEgg(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, CW, CH)

  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (!insideEgg(x, y)) continue

      // Layer order matches SVG: shadow overrides base, bright overrides highlight
      let color: string
      if (inDeepShadow(x, y))        color = '#070f07'
      else if (inShadow(x, y))       color = '#0d1a0d'
      else if (inBrightHighlight(x, y)) color = '#3d6b2f'
      else if (inHighlight(x, y))    color = '#2d5535'
      else                           color = '#1a3320'

      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  }

  // Outline pass — drawn last so it sits on top
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      if (isEdge(x, y)) {
        ctx.fillStyle = '#0a1208'
        ctx.fillRect(x, y, 1, 1)
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
    drawEgg(ctx)
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
      } as React.CSSProperties}
    />
  )
}
