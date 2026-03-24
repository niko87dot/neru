import type { Habit } from '../types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

export default function HabitList({ habits, onToggle }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-lcd-green" style={{ fontSize: 8 }}>
        DAILY LOG
      </span>

      {/* Bordered habit list */}
      <div style={{ border: '1px solid #333' }}>
        {habits.map((habit, idx) => (
          <label
            key={habit.id}
            className="flex items-center gap-3 cursor-pointer"
            style={{
              padding: '10px 12px',
              borderTop: idx === 0 ? 'none' : '1px solid #1e1e1e',
            }}
          >
            <input
              type="checkbox"
              className="pixel-checkbox"
              checked={habit.done}
              onChange={() => onToggle(habit.id)}
            />
            <span
              style={{
                fontSize: 7,
                lineHeight: '1.6',
                textDecoration: habit.done ? 'line-through' : 'none',
              }}
              className={habit.done ? 'text-lcd-green opacity-40' : 'text-lcd-green'}
            >
              {habit.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
