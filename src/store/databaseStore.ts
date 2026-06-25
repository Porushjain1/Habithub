import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  frequency: string;
  target: number;
  createdAt: string;
}

export interface HabitEntry {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface DatabaseState {
  user: {
    name: string;
    perfectDays: number;
  };
  habits: Habit[];
  entries: Record<string, HabitEntry>; // Key: habitId-YYYY-MM-DD
  
  // Actions
  toggleEntry: (habitId: string, date: string) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, name: string) => void;
  deleteHabit: (id: string) => void;
  updateUserName: (name: string) => void;
  resetData: () => void;
}

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Workout', category: 'Health', color: '#10b981', frequency: 'daily', target: 1, createdAt: new Date().toISOString() },
  { id: '2', name: 'Read Books', category: 'Growth', color: '#3b82f6', frequency: 'daily', target: 1, createdAt: new Date().toISOString() },
  { id: '3', name: 'Meditate', category: 'Mind', color: '#8b5cf6', frequency: 'daily', target: 1, createdAt: new Date().toISOString() },
  { id: '4', name: 'Drink Water', category: 'Health', color: '#0ea5e9', frequency: 'daily', target: 1, createdAt: new Date().toISOString() },
];

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set) => ({
      user: { name: 'Alex Doe', perfectDays: 3 },
      habits: INITIAL_HABITS,
      entries: {},

      resetData: () => set((state) => ({ 
        entries: {}, 
        user: { ...state.user, perfectDays: 0 } 
      })),

      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, name) => set((state) => ({ habits: state.habits.map(h => h.id === id ? { ...h, name } : h) })),
      deleteHabit: (id) => set((state) => ({ habits: state.habits.filter(h => h.id !== id) })),
      updateUserName: (name) => set((state) => ({ user: { ...state.user, name } })),
      
      toggleEntry: (habitId, date) => set((state) => {
        const key = `${habitId}-${date}`;
        const isCurrentlyCompleted = state.entries[key]?.completed || false;
        const newCompleted = !isCurrentlyCompleted;
        
        let perfectDayCount = state.user.perfectDays;
        
        // Check if perfect day (all active habits completed for this date)
        const activeHabits = state.habits.length;
        const completedToday = Object.values({
            ...state.entries, 
            [key]: { habitId, date, completed: newCompleted }
        }).filter(e => e.date === date && e.completed).length;

        if (completedToday === activeHabits && newCompleted) {
            perfectDayCount += 1;
        }

        return {
          entries: {
            ...state.entries,
            [key]: { habitId, date, completed: newCompleted }
          },
          user: {
            ...state.user,
            perfectDays: perfectDayCount
          }
        };
      })
    }),
    { name: 'habitbub-db' }
  )
);
