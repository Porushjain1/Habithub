import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HabitDef {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface SpreadsheetState {
  habits: HabitDef[];
  // Key is "habitId-day" (day is 1-31)
  completions: Record<string, boolean>;
  toggleCompletion: (habitId: string, day: number) => void;
  addHabit: (habit: HabitDef) => void;
}

const DEFAULT_HABITS: HabitDef[] = [
  { id: '1', name: 'Morning Workout', color: '#10b981', icon: '💪' },
  { id: '2', name: 'Read 10 Pages', color: '#3b82f6', icon: '📚' },
  { id: '3', name: 'Meditation', color: '#8b5cf6', icon: '🧘' },
  { id: '4', name: 'Drink Water', color: '#0ea5e9', icon: '💧' },
  { id: '5', name: 'Journaling', color: '#f59e0b', icon: '📓' },
];

export const useSpreadsheetStore = create<SpreadsheetState>()(
  persist(
    (set) => ({
      habits: DEFAULT_HABITS,
      completions: {},
      toggleCompletion: (habitId, day) => set((state) => {
        const key = `${habitId}-${day}`;
        return {
          completions: {
            ...state.completions,
            [key]: !state.completions[key]
          }
        };
      }),
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, habit]
      }))
    }),
    {
      name: 'habitbub-spreadsheet-storage',
    }
  )
);
