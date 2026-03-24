import type { Habit } from '../types'

interface Props {
  habits: Habit[]
  onToggle: (id: string) => void
}

// Lives in the dark controls zone — uses lcd-green (#74b83e) palette.
export default function HabitList({ habits, onToggle }: Props) {
  return (
    <div className="w-full flex flex-col gap-4">
      <span className="text-lcd-green" style={{ fontSize: 8 }}>
        DAILY LOG
      </span>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <label key={habit.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="pixel-checkbox"
              checked={habit.done}
              onChange={() => onToggle(habit.id)}
            />
            <span
              style={{ fontSize: 7, lineHeight: '1.6' }}
              className={habit.done ? 'text-lcd-green opacity-40 line-through' : 'text-lcd-green'}
            >
              {habit.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
