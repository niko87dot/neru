import type { CharacterMood } from '../types'

interface Props {
  mood: CharacterMood
}

// Session 1 character — exact original, restored.
// 9-wide × 11-tall grid, PIXEL = 8px.

const PIXEL = 8

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

const EYES: boolean[][] = [
  [false, false, true, false, false, false, true, false, false],
  [false, false, true, false, false, false, true, false, false],
]

function buildFaceGrid(mood: CharacterMood): boolean[][] {
  const grid: boolean[][] = Array.from({ length: 11 }, () => Array(9).fill(false))

  for (let c = 0; c < 9; c++) grid[0][c] = true
  for (let c = 0; c < 9; c++) grid[10][c] = true
  for (let r = 1; r < 10; r++) { grid[r][0] = true; grid[r][8] = true }

  EYES.forEach((row, ri) =>
    row.forEach((on, ci) => { if (on) grid[2 + ri][ci] = true })
  )
  MOUTH[mood].forEach((row, ri) =>
    row.forEach((on, ci) => { if (on) grid[6 + ri][ci] = true })
  )

  return grid
}

export default function NeruCharacter({ mood }: Props) {
  const grid = buildFaceGrid(mood)
  const label = mood === 'happy' ? '>:)' : mood === 'neutral' ? ':-|' : ':-('

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div
        style={{ position: 'relative', width: 9 * PIXEL, height: 11 * PIXEL }}
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
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: '#74b83e' }}>
        {label}
      </span>
    </div>
  )
}
