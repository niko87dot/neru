import type { Habit } from '../types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

export default function HabitList({ habits, onToggle }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <span style={{ fontFamily: '"Press Start 2P"', fontSize: 7, color: '#74b83e' }}>
        DAILY LOG
      </span>

      <div className="flex flex-col">
        {habits.map((habit, idx) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 cursor-pointer"
            style={{
              padding: '9px 0',
              borderTop: idx > 0 ? '1px solid #1a1a1a' : 'none',
            }}
            onClick={() => onToggle(habit.id)}
          >
            {/* Pixel bracket checkbox */}
            <span
              style={{
                fontFamily: '"Press Start 2P"',
                fontSize: 8,
                color: '#74b83e',
                flexShrink: 0,
                letterSpacing: -1,
              }}
            >
              {habit.done ? '[X]' : '[ ]'}
            </span>

            <span
              style={{
                fontFamily: '"Press Start 2P"',
                fontSize: 7,
                lineHeight: '1.6',
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
