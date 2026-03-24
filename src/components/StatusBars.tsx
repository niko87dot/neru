interface Props {
  doneCount: number
  total: number
}

// HP [████████░░] 8/10  — 10 segments scaled from habit count
function StatBar({ label, doneCount, total }: { label: string; doneCount: number; total: number }) {
  const SEG = 10
  const filled = Math.round((doneCount / total) * SEG)
  const bar = Array.from({ length: SEG }, (_, i) => (i < filled ? '█' : '░')).join('')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#74b83e', minWidth: 22 }}>
        {label}
      </span>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#74b83e' }}>
        [{bar}]
      </span>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#3d6b1f' }}>
        {filled}/10
      </span>
    </div>
  )
}

export default function StatusBars({ doneCount, total }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <StatBar label="HP" doneCount={doneCount} total={total} />
      <StatBar label="EN" doneCount={doneCount} total={total} />
    </div>
  )
}
