import * as React from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Dialog } from "@/components/ui/Dialog"
import { HabitForm } from "@/components/habits/HabitForm"
import { HabitCard } from "@/components/habits/HabitCard"

const MOCK_HABITS = [
  { id: "1", name: "Morning Workout", category: "Health", icon: "💪", color: "#10b981", streak: 12, completed: true, target: "Every Day" },
  { id: "2", name: "Read 10 Pages", category: "Learning", icon: "📚", color: "#3b82f6", streak: 5, completed: false, target: "Every Day" },
  { id: "3", name: "Meditation", category: "Mindfulness", icon: "🧘", color: "#8b5cf6", streak: 30, completed: true, target: "Weekdays" },
  { id: "4", name: "Drink Water", category: "Health", icon: "💧", color: "#0ea5e9", streak: 45, completed: false, target: "Every Day" },
  { id: "5", name: "Journaling", category: "Mindfulness", icon: "📓", color: "#f59e0b", streak: 2, completed: false, target: "Weekends" },
];

export function Habits() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits Management</h1>
          <p className="text-muted-foreground mt-1">Manage your habits, goals, and routines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 glass hidden md:flex">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Add Habit
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-4 overflow-x-auto scrollbar-hide">
        <Button variant="default" className="rounded-full px-6">All Habits</Button>
        <Button variant="glass" className="rounded-full px-6 whitespace-nowrap text-muted-foreground hover:text-foreground">Health (2)</Button>
        <Button variant="glass" className="rounded-full px-6 whitespace-nowrap text-muted-foreground hover:text-foreground">Mindfulness (2)</Button>
        <Button variant="glass" className="rounded-full px-6 whitespace-nowrap text-muted-foreground hover:text-foreground">Learning (1)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_HABITS.map(habit => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        
        {/* Empty state "Add Habit" card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-card min-h-[200px] p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all border-dashed border-2 border-border/50 bg-transparent dark:bg-transparent shadow-none hover:shadow-md hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Create New Habit</span>
        </button>
      </div>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Habit"
      >
        <HabitForm onClose={() => setIsModalOpen(false)} />
      </Dialog>
    </div>
  );
}

