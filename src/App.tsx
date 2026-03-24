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

function doneBlocks(done: number, total: number): string {
  return '▓'.repeat(done) + '░'.repeat(total - done)
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
        <div className="bg-gb-bg p-4 flex flex-col gap-4">

          {/* Header */}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: '#0f380f' }}>
              NERU
            </span>
            <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: '#306230' }}>
              {todayDisplay()}
            </span>
          </div>

          {/* Single divider */}
          <div style={{ height: 1, backgroundColor: '#306230' }} />

          {/* Character */}
          <div className="flex justify-center py-1">
            <NeruCharacter mood={mood} />
          </div>

          {/* Status bars */}
          <StatusBars doneCount={doneCount} total={total} />

        </div>

        {/* ── ZONE DIVIDER ────────────────────────────────────────────── */}
        <div style={{ height: 1, backgroundColor: '#306230' }} />

        {/* ── CONTROLS ZONE ───────────────────────────────────────────── */}
        <div className="bg-lcd-bg p-4 flex flex-col gap-5 flex-1">

          <HabitList habits={habits} onToggle={toggle} />

          {/* HUD */}
          <div className="mt-auto">
            <div style={{ height: 1, backgroundColor: '#1a1a1a', marginBottom: 8 }} />
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#74b83e' }}>
                ♥ NERU LVL 1
              </span>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: '#74b83e' }}>
                {doneBlocks(doneCount, total)} {doneCount}/{total}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
