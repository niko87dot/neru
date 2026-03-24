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
      <div
        className="card-border w-full flex flex-col"
        style={{ maxWidth: 360, minHeight: 'calc(100vh - 32px)' }}
      >

        {/* ── SCREEN ZONE ─────────────────────────────────────────────── */}
        {/* Gameboy green background + scanline overlay */}
        <div className="scanlines bg-gb-bg p-5 flex flex-col gap-5">

          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-gb-dark" style={{ fontSize: 10 }}>
              NERU
            </span>
            <span className="text-gb-mid" style={{ fontSize: 6 }}>
              {todayDisplay()}
            </span>
          </div>

          {/* Character */}
          <div className="flex justify-center py-1">
            <NeruCharacter mood={mood} />
          </div>

          {/* Status bars */}
          <StatusBars doneCount={doneCount} total={total} />

        </div>

        {/* ── DIVIDER ─────────────────────────────────────────────────── */}
        <div style={{ height: 2, backgroundColor: '#306230' }} />

        {/* ── CONTROLS ZONE ───────────────────────────────────────────── */}
        <div className="bg-lcd-bg p-5 flex flex-col gap-5 flex-1">

          {/* Habit list */}
          <HabitList habits={habits} onToggle={toggle} />

          {/* HUD bar */}
          <div className="mt-auto">
            <div style={{ height: 1, backgroundColor: '#306230', marginBottom: 12 }} />
            <div className="flex justify-between items-center">
              <span className="text-lcd-green" style={{ fontSize: 6 }}>
                NERU LVL 1
              </span>
              <span className="text-lcd-green" style={{ fontSize: 6 }}>
                {doneCount}/{total}{doneCount === total ? ' ★' : ''}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
