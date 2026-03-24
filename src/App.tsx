import { useHabits } from './store'
import NeruCharacter from './components/NeruCharacter'
import StatusBars from './components/StatusBars'
import HabitList from './components/HabitList'
import type { CharacterMood } from './types'

const GREEN  = '#74b83e'
const DARK   = '#3d6b1f'
const BG     = '#0a0a0a'

function getMood(doneCount: number, total: number): CharacterMood {
  if (doneCount === total) return 'happy'
  if (doneCount === 0) return 'sad'
  return 'neutral'
}

function todayDisplay(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`
}

export default function App() {
  const { habits, toggle, doneCount, total } = useHabits()
  const mood = getMood(doneCount, total)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16 }}>

      {/* Outer border — #3d6b1f */}
      <div style={{ border: `1px solid ${DARK}`, padding: 4, width: '100%', maxWidth: 360 }}>

        {/* Inner border — #74b83e */}
        <div style={{ border: `1px solid ${GREEN}`, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 50px)' }}>

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div style={{ padding: '16px 16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 14, color: GREEN }}>
                NERU
              </span>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 5, color: DARK }}>
                {todayDisplay()}
              </span>
            </div>
            {/* Double pixel divider: thick green + thin dark */}
            <div style={{ marginTop: 14, height: 2, backgroundColor: GREEN }} />
            <div style={{ marginTop: 2,  height: 1, backgroundColor: DARK  }} />
          </div>

          {/* ── CHARACTER ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 16px 12px' }}>
            <NeruCharacter mood={mood} />
          </div>

          {/* ── STATUS BARS ────────────────────────────────────────────── */}
          <div style={{ padding: '0 16px 16px' }}>
            <StatusBars doneCount={doneCount} total={total} />
          </div>

          {/* ── SECTION DIVIDER ────────────────────────────────────────── */}
          <div style={{ height: 1, backgroundColor: '#111', margin: '0 16px' }} />

          {/* ── HABIT LIST ─────────────────────────────────────────────── */}
          <div style={{ padding: 16, flex: 1 }}>
            <HabitList habits={habits} onToggle={toggle} />
          </div>

          {/* ── BOTTOM HUD ─────────────────────────────────────────────── */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ height: 1, backgroundColor: GREEN, marginBottom: 10 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: GREEN }}>
                ♥ LVL 1
              </span>
              <span className="cursor-blink" style={{ fontFamily: '"Press Start 2P"', fontSize: 10, color: DARK }}>
                _
              </span>
              <span style={{ fontFamily: '"Press Start 2P"', fontSize: 6, color: GREEN }}>
                {doneCount}/{total} DONE
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
