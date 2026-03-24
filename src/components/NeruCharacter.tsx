import type { CharacterMood } from '../types'

interface Props {
  mood: CharacterMood
}

// Pure CSS pixel art — no images, no SVG files.
// Each row is an array of booleans (true = filled pixel).
// Resolution: 9×9 face grid inside a 16×16 bounding box.

const PIXEL = 8 // px per pixel cell

// Mouth shapes per mood (rows 6-8 in the face grid)
const MOUTH: Record<CharacterMood, boolean[][]> = {
  happy: [
    [false, false, false, false, false, false, false, false, false],
    [true,  false, false, false, false, false, false, false, true ],
    [false, true,  true,  true,  true,  true,  true,  false, false],
  ],
  neutral: [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [true,  true,  true,  true,  true,  true,  true,  false, false],
  ],
  sad: [
    [false, true,  true,  true,  true,  true,  true,  false, false],
    [true,  false, false, false, false, false, false, false, true ],
    [false, false, false, false, false, false, false, false, false],
  ],
}

// Eyes: same for all moods (2 rows)
const EYES: boolean[][] = [
  [false, false, true,  false, false, false, true,  false, false],
  [false, false, true,  false, false, false, true,  false, false],
]

// Head outline — top/bottom bars + side bars
function buildFaceGrid(mood: CharacterMood): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 11 }, () =>
    Array(9).fill(false)
  )

  // Top border row 0
  for (let c = 0; c < 9; c++) grid[0][c] = true
  // Bottom border row 10
  for (let c = 0; c < 9; c++) grid[10][c] = true
  // Side borders rows 1-9
  for (let r = 1; r < 10; r++) {
    grid[r][0] = true
    grid[r][8] = true
  }

  // Eyes at rows 2-3
  EYES.forEach((row, ri) => {
    row.forEach((on, ci) => {
      if (on) grid[2 + ri][ci] = true
    })
  })

  // Mouth at rows 6-8
  MOUTH[mood].forEach((row, ri) => {
    row.forEach((on, ci) => {
      if (on) grid[6 + ri][ci] = true
    })
  })

  return grid
}

export default function NeruCharacter({ mood }: Props) {
  const grid = buildFaceGrid(mood)

  const moodLabel = mood === 'happy' ? '>:)' : mood === 'neutral' ? ':-|' : ':-('

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Pixel face */}
      <div
        style={{ width: 9 * PIXEL, height: 11 * PIXEL }}
        className="relative"
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
                  backgroundColor: '#74b83e',
                }}
              />
            ) : null
          )
        )}
      </div>

      {/* Mood label */}
      <span className="text-lcd-text lcd-glow" style={{ fontSize: 8 }}>
        {moodLabel}
      </span>
    </div>
  )
}
