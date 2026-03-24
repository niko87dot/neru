interface Props {
  doneCount: number
  total: number
}

function BlockBar({ filled, total }: { filled: number; total: number }) {
  const segments = total * 4
  const filledSegments = Math.round((filled / total) * segments)

  return (
    <span
      style={{
        fontFamily: '"Press Start 2P"',
        fontSize: 8,
        letterSpacing: 1,
        lineHeight: 1,
      }}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          style={{ color: i < filledSegments ? '#306230' : '#9bbc0f' }}
        >
          █
        </span>
      ))}
    </span>
  )
}

export default function StatusBars({ doneCount, total }: Props) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mood */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, lineHeight: 1 }}>💧</span>
          <span
            style={{
              fontFamily: '"Press Start 2P"',
              fontSize: 6,
              color: '#306230',
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
              color: '#306230',
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
