import { useState, useEffect } from 'react'
import type { Habit, DailyState } from './types'

const STORAGE_KEY = 'neru_state'

const DEFAULT_HABITS: Omit<Habit, 'done'>[] = [
  { id: 'water', label: 'DRINK WATER' },
  { id: 'move', label: 'MOVE YOUR BODY' },
  { id: 'ship', label: 'SHIP SOMETHING' },
]

function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function freshState(): DailyState {
  return {
    date: todayString(),
    habits: DEFAULT_HABITS.map((h) => ({ ...h, done: false })),
  }
}

function loadState(): DailyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return freshState()
    const parsed: DailyState = JSON.parse(raw)
    // daily reset if stored date differs from today
    if (parsed.date !== todayString()) return freshState()
    return parsed
  } catch {
    return freshState()
  }
}

function saveState(state: DailyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useHabits() {
  const [state, setState] = useState<DailyState>(loadState)

  // Check for midnight reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayString()
      if (state.date !== today) {
        const next = freshState()
        setState(next)
        saveState(next)
      }
    }, 60_000)
    return () => clearInterval(interval)
  }, [state.date])

  function toggle(id: string) {
    setState((prev) => {
      const next: DailyState = {
        ...prev,
        habits: prev.habits.map((h) =>
          h.id === id ? { ...h, done: !h.done } : h
        ),
      }
      saveState(next)
      return next
    })
  }

  const doneCount = state.habits.filter((h) => h.done).length
  const total = state.habits.length

  return { habits: state.habits, toggle, doneCount, total }
}
