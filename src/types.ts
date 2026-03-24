export interface Habit {
  id: string
  label: string
  done: boolean
}

export interface DailyState {
  date: string // YYYY-MM-DD
  habits: Habit[]
}

export type CharacterMood = 'happy' | 'neutral' | 'sad'
