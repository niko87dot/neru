interface Props {
  doneCount: number
  total: number
}

// Fills a bar with █ and ░ block characters
function BlockBar({ filled, total }: { filled: number; total: number }) {
  // Each habit gets 4 block segments → smoother feel
  const segments = total * 4
  const filledSegments = Math.round((filled / total) * segments)

  return (
    <span
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 8,
        color: '#74b83e',
        letterSpacing: 1,
        lineHeight: 1,
      }}
      className="lcd-glow"
    >
      {Array.from({ length: segments }, (_, i) =>
        i < filledSegments ? '█' : '░'
      ).join('')}
    </span>
  )
}

export default function StatusBars({ doneCount, total }: Props) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Happiness */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, lineHeight: 1 }}>💧</span>
          <span
            style={{
              fontFamily: '"Press Start 2P"',
              fontSize: 6,
              color: '#3d6b1f',
              letterSpacing: 1,
            }}
          >
            MOOD
          </span>
        </div>
        <BlockBar filled={doneCount} total={total} />
      </div>

      {/* Energy */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, lineHeight: 1 }}>⚡</span>
          <span
            style={{
              fontFamily: '"Press Start 2P"',
              fontSize: 6,
              color: '#3d6b1f',
              letterSpacing: 1,
            }}
          >
            ENERGY
          </span>
        </div>
        <BlockBar filled={doneCount} total={total} />
      </div>
    </div>
  )
}
