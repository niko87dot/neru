import type { Habit } from '../types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

export default function HabitList({ habits, onToggle }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#3d6b1f' }}>
        // DAILY LOG
      </span>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {habits.map((habit, idx) => (
          <div
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 0',
              borderTop: idx > 0 ? '1px solid #111' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 8, color: '#74b83e', flexShrink: 0 }}>
              {habit.done ? '[x]' : '[ ]'}
            </span>
            <span
              style={{
                fontFamily: '"Press Start 2P"',
                fontSize: 7,
                lineHeight: 1.8,
                color: habit.done ? '#3d6b1f' : '#74b83e',
                textDecoration: habit.done ? 'line-through' : 'none',
              }}
            >
              {habit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
