import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface HabitFormProps {
  onClose: () => void
}

export function HabitForm({ onClose }: HabitFormProps) {
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="space-y-2">
        <label className="text-sm font-medium">Habit Name</label>
        <Input placeholder="e.g. Read 10 Pages" autoFocus />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring glass">
            <option>Health</option>
            <option>Productivity</option>
            <option>Learning</option>
            <option>Mindfulness</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Icon (Emoji)</label>
          <Input placeholder="📚" maxLength={2} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Frequency Target</label>
        <select className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring glass">
          <option>Every Day</option>
          <option>Weekdays</option>
          <option>Weekends</option>
          <option>Custom</option>
        </select>
      </div>
      
      <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Habit</Button>
      </div>
    </form>
  )
}
