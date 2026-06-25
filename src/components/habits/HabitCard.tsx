import * as React from "react"
import { cn } from "@/utils/cn"
import { MoreHorizontal, Calendar, Flame, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface HabitCardProps {
  habit: {
    id: string
    name: string
    category: string
    icon: string
    color: string
    streak: number
    completed: boolean
    target: string
  }
}

export function HabitCard({ habit }: HabitCardProps) {
  const [completed, setCompleted] = React.useState(habit.completed)

  return (
    <div className="glass-card p-5 group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Decorative top border based on habit color */}
      <div 
        className="absolute top-0 left-0 right-0 h-1" 
        style={{ backgroundColor: habit.color }} 
      />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-white/20"
            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{habit.name}</h3>
            <p className="text-xs text-muted-foreground">{habit.category}</p>
          </div>
        </div>
        
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-center gap-2 text-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-medium">{habit.streak} Day Streak</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{habit.target}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <Button 
          variant={completed ? "default" : "outline"}
          className={cn(
            "w-full gap-2 transition-all duration-300", 
            completed ? "bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary" : "glass"
          )}
          onClick={() => setCompleted(!completed)}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
            completed ? "border-transparent bg-white/20 text-white" : "border-muted-foreground/40"
          )}>
            {completed && <Check className="w-3 h-3" />}
          </div>
          {completed ? "Completed" : "Mark as Done"}
        </Button>
      </div>
    </div>
  )
}
