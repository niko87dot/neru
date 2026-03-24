import type { CharacterMood } from '../types'

interface Props {
  mood: CharacterMood
}

const PIXEL = 6  // px per pixel cell
const COLS = 16
const ROWS = 20

type Coord = [number, number] // [row, col]

// ─── Base pixels (always drawn) ──────────────────────────────────────────────

const BASE: Coord[] = [
  // Antenna
  [0, 7], [0, 8],
  [1, 7], [1, 8],
  [2, 6], [2, 7], [2, 8], [2, 9],

  // Head outline — rounded rectangle cols 2-13, rows 3-12
  // top edge (corners cut = no [3,2] or [3,13])
  [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12],
  // left side
  [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2],
  // right side
  [4, 13], [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13], [11, 13],
  // bottom edge
  [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11], [12, 12],

  // Ears (one pixel wide, poking outside the head)
  [5, 1], [6, 1], [7, 1],
  [5, 14], [6, 14], [7, 14],

  // Nose dot
  [8, 7], [8, 8],

  // Body ───────────────────────────────────────────────────────────────────────
  // Neck
  [13, 6], [13, 7], [13, 8], [13, 9],
  // Body block
  [14, 5], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10],
  [15, 5], [15, 6], [15, 7], [15, 8], [15, 9], [15, 10],
  [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [16, 10],
  [17, 5], [17, 6], [17, 7], [17, 8], [17, 9], [17, 10],
  // Left arm
  [14, 3], [14, 4],
  [15, 3], [15, 4],
  [16, 4],
  // Right arm
  [14, 11], [14, 12],
  [15, 11], [15, 12],
  [16, 11],
]

// ─── Mood-specific pixels ─────────────────────────────────────────────────────

const EYES: Record<CharacterMood, Coord[]> = {
  // Happy: squinted crescents — just single-pixel-tall arcs (^ ^)
  happy: [
    [5, 4], [5, 5], [5, 6],
    [6, 3], [6, 7],
    [5, 9], [5, 10], [5, 11],
    [6, 8], [6, 12],
  ],
  // Neutral: solid 2×2 blocks
  neutral: [
    [5, 4], [5, 5],
    [6, 4], [6, 5],
    [5, 10], [5, 11],
    [6, 10], [6, 11],
  ],
  // Sad: droopy single-pixel dashes, shifted down one row (tired look)
  sad: [
    [7, 4], [7, 5], [7, 6],
    [7, 9], [7, 10], [7, 11],
  ],
}

const MOUTHS: Record<CharacterMood, Coord[]> = {
  // Happy: open smile curve (U shape facing up = big grin)
  happy: [
    [9, 4], [9, 11],
    [10, 5], [10, 10],
    [11, 6], [11, 7], [11, 8], [11, 9],
  ],
  // Neutral: flat line
  neutral: [
    [9, 5], [9, 6], [9, 7], [9, 8], [9, 9], [9, 10],
  ],
  // Sad: downward arc (frown)
  sad: [
    [9, 6], [9, 7], [9, 8], [9, 9],
    [10, 5], [10, 10],
    [11, 4], [11, 11],
  ],
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function buildGrid(mood: CharacterMood): boolean[][] {
  const grid: boolean[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  )
  const paint = ([r, c]: Coord) => {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = true
  }
  BASE.forEach(paint)
  EYES[mood].forEach(paint)
  MOUTHS[mood].forEach(paint)
  return grid
}

// Small CSS sparkle cross rendered at (top, left) relative to the character div
function Sparkle({ top, left, dim }: { top: number; left: number; dim?: boolean }) {
  const color = dim ? '#306230' : '#0f380f'
  const s = dim ? 4 : 6
  return (
    <div style={{ position: 'absolute', top, left, width: s * 3, height: s * 3 }}>
      {/* center */}
      <div style={{ position: 'absolute', top: s, left: s, width: s, height: s, backgroundColor: color }} />
      {/* arms */}
      <div style={{ position: 'absolute', top: 0, left: s, width: s, height: s, backgroundColor: color }} />
      <div style={{ position: 'absolute', top: s * 2, left: s, width: s, height: s, backgroundColor: color }} />
      <div style={{ position: 'absolute', top: s, left: 0, width: s, height: s, backgroundColor: color }} />
      <div style={{ position: 'absolute', top: s, left: s * 2, width: s, height: s, backgroundColor: color }} />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NeruCharacter({ mood }: Props) {
  const grid = buildGrid(mood)
  const W = COLS * PIXEL
  const H = ROWS * PIXEL

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Outer wrapper — gives room for zzz / sparkles that overflow */}
      <div style={{ position: 'relative', width: W + 40, paddingTop: 20 }}>

        {/* Sleeping zzz (sad state) */}
        {mood === 'sad' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 2,
            }}
          >
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#306230', lineHeight: 1 }}>Z</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#306230', lineHeight: 1 }}>Z</span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 9, color: '#0f380f', lineHeight: 1 }}>Z</span>
          </div>
        )}

        {/* Pixel character */}
        <div
          style={{ position: 'relative', width: W, height: H, margin: '0 auto' }}
          role="img"
          aria-label={`Neru is ${mood}`}
        >
          {grid.map((row, ri) =>
            row.map((on, ci) =>
              on ? (
                <div
                  key={`${ri}-${ci}`}
                  style={{
                    position: 'absolute',
                    left: ci * PIXEL,
                    top: ri * PIXEL,
                    width: PIXEL,
                    height: PIXEL,
                    backgroundColor: '#0f380f',
                  }}
                />
              ) : null
            )
          )}

          {/* Happy sparkles — positioned relative to character */}
          {mood === 'happy' && (
            <>
              <Sparkle top={-8} left={-24} />
              <Sparkle top={-12} left={W - 4} />
              <Sparkle top={24} left={-20} dim />
              <Sparkle top={20} left={W + 4} dim />
            </>
          )}
        </div>
      </div>

      {/* Name tag */}
      <div
        style={{
          border: '1px solid #306230',
          padding: '3px 8px',
          marginTop: 4,
        }}
      >
        <span
          style={{
            fontFamily: '"Press Start 2P"',
            fontSize: 6,
            color: '#0f380f',
            letterSpacing: 2,
          }}
        >
          NERU
        </span>
      </div>
    </div>
  )
}
