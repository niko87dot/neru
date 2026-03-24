import { useHabits } from './store'
import NeruCharacter from './components/NeruCharacter'
import StatusBars from './components/StatusBars'
import HabitList from './components/HabitList'
import type { CharacterMood } from './types'

function getMood(doneCount: number, total: number): CharacterMood {
  if (doneCount === total) return 'happy'
  if (doneCount === 0) return 'sad'
  return 'neutral'
}

function todayDisplay(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export default function App() {
  const { habits, toggle, doneCount, total } = useHabits()
  const mood = getMood(doneCount, total)

  return (
    <div className="min-h-screen bg-lcd-bg flex items-start justify-center px-4 py-4">
      {/* Nokia-sized screen container */}
      <div
        className="relative w-full scanlines"
        style={{ maxWidth: 360 }}
      >
        {/* Screen border */}
        <div
          className="pixel-border bg-lcd-bg p-5 flex flex-col gap-6"
          style={{ minHeight: '100vh' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-lcd-green lcd-glow" style={{ fontSize: 10 }}>
              NERU
            </span>
            <span className="text-lcd-dark" style={{ fontSize: 6 }}>
              {todayDisplay()}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-lcd-dark" />

          {/* Character */}
          <div className="flex justify-center py-2">
            <NeruCharacter mood={mood} />
          </div>

          {/* Status bars */}
          <StatusBars doneCount={doneCount} total={total} />

          {/* Divider */}
          <div className="w-full h-px bg-lcd-dark" />

          {/* Habit list */}
          <HabitList habits={habits} onToggle={toggle} />

          {/* Footer */}
          <div className="mt-auto pt-4">
            <div className="w-full h-px bg-lcd-dark mb-3" />
            <div className="flex justify-between items-center">
              <span className="text-lcd-dark" style={{ fontSize: 6 }}>
                {doneCount}/{total} DONE
              </span>
              <span className="text-lcd-dark" style={{ fontSize: 6 }}>
                {doneCount === total ? 'ALL CLEAR!' : 'KEEP GOING'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
