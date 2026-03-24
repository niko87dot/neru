interface Props {
  doneCount: number
  total: number
}

function BlockBar({ filled, total }: { filled: number; total: number }) {
  const segments = total * 4
  const filledSegments = Math.round((filled / total) * segments)

  return (
    <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, lineHeight: 1 }}>
      {Array.from({ length: segments }, (_, i) => (
        <span key={i} style={{ color: i < filledSegments ? '#306230' : '#8bac0f' }}>
          █
        </span>
      ))}
    </span>
  )
}

export default function StatusBars({ doneCount, total }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">

      <div className="flex flex-col gap-1">
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#306230' }}>
          MOOD
        </span>
        <BlockBar filled={doneCount} total={total} />
      </div>

      <div className="flex flex-col gap-1">
        <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#306230' }}>
          ENERGY
        </span>
        <BlockBar filled={doneCount} total={total} />
      </div>

    </div>
  )
}
