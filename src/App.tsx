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

// "▓▓░ 2/3" — filled blocks for done, empty for remaining
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

        {/* ── SCREEN BEZEL ────────────────────────────────────────────── */}
        {/* Dark bezel (#1a1a1a) wrapping the green LCD area */}
        <div style={{ backgroundColor: '#1a1a1a', padding: 8 }}>
          {/* Inner thin #306230 border — simulates LCD panel edge */}
          <div style={{ border: '2px solid #306230' }}>
            <div className="scanlines bg-gb-bg p-4 flex flex-col gap-4">

              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-gb-dark" style={{ fontSize: 13, letterSpacing: 1 }}>
                  NERU
                </span>
                <span className="text-gb-mid" style={{ fontSize: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 8 }}>▦</span>
                  {todayDisplay()}
                </span>
              </div>

              {/* Double pixel divider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ height: 2, backgroundColor: '#0f380f' }} />
                <div style={{ height: 1, backgroundColor: '#306230' }} />
              </div>

              {/* Character */}
              <div className="flex justify-center py-1">
                <NeruCharacter mood={mood} />
              </div>

              {/* Status bars */}
              <StatusBars doneCount={doneCount} total={total} />

            </div>
          </div>
        </div>

        {/* ── ZONE DIVIDER ─────────────────────────────────────────────── */}
        <div style={{ height: 2, backgroundColor: '#306230' }} />

        {/* ── CONTROLS ZONE ───────────────────────────────────────────── */}
        <div className="bg-lcd-bg p-5 flex flex-col gap-5 flex-1">

          <HabitList habits={habits} onToggle={toggle} />

          {/* HUD bar */}
          <div className="mt-auto">
            <div style={{ height: 1, backgroundColor: '#306230', marginBottom: 10 }} />
            <div className="flex justify-between items-center">
              <span className="text-lcd-green" style={{ fontSize: 6 }}>
                ♥ NERU LVL 1
              </span>
              <span className="text-lcd-green" style={{ fontSize: 6 }}>
                {doneBlocks(doneCount, total)} {doneCount}/{total}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
