interface Props {
  doneCount: number
  total: number
}

// Render a bar made of pixel blocks
function PixelBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{ width: 18, height: 10 }}
          className={i < filled ? 'bg-lcd-green' : 'bg-lcd-dim border border-lcd-dark'}
        />
      ))}
    </div>
  )
}

export default function StatusBars({ doneCount, total }: Props) {
  // happiness = ratio of done habits
  const happiness = doneCount
  // hunger fills inversely (all done = full = not hungry)
  const hunger = doneCount

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Happiness */}
      <div className="flex flex-col gap-1">
        <span className="text-lcd-text lcd-glow" style={{ fontSize: 7 }}>
          HAPPINESS
        </span>
        <PixelBar filled={happiness} total={total} />
      </div>

      {/* Hunger */}
      <div className="flex flex-col gap-1">
        <span className="text-lcd-text lcd-glow" style={{ fontSize: 7 }}>
          ENERGY
        </span>
        <PixelBar filled={hunger} total={total} />
      </div>
    </div>
  )
}
