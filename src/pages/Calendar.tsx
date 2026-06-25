import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDatabaseStore } from "@/store/databaseStore";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";

export function Calendar() {
  const { entries, habits, toggleEntry } = useDatabaseStore();
  const [currentWeekStart, setCurrentWeekStart] = React.useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  // Circle Progress Component
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex justify-center items-center my-6 relative">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
          <circle 
            cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
            className="text-[#89A878] dark:text-[#7ca982] transition-all duration-500" 
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold text-gray-700 dark:text-gray-200">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-w-max">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Tasks View</h1>
          <p className="text-muted-foreground mt-1">Review your daily progress column by column.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-black/50 p-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
          <button onClick={prevWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 dark:text-white"/></button>
          <span className="text-lg font-bold min-w-[200px] text-center text-gray-800 dark:text-gray-100">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 dark:text-white"/></button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {weekDays.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const dayName = format(date, "EEEE");
          const formattedDate = format(date, "dd.MM.yyyy");
          
          let completedCount = 0;
          habits.forEach(h => {
            if (entries[`${h.id}-${dateStr}`]?.completed) completedCount++;
          });
          const percentage = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);
          
          return (
            <div key={dateStr} className="min-w-[260px] flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm flex flex-col">
              {/* Header */}
              <div className="bg-[#89A878] dark:bg-[#5b7a4c] text-white text-center py-2 font-bold text-lg">
                {dayName}
              </div>
              {/* Subheader Date */}
              <div className="bg-[#A8C799] dark:bg-[#729c5e] text-white text-center py-1 font-medium text-sm border-b border-white/20">
                {formattedDate}
              </div>
              
              <div className="p-4 flex-1 flex flex-col bg-[#fbfdfa] dark:bg-gray-900">
                <CircularProgress percentage={percentage} />
                
                <div className="bg-[#A8C799] dark:bg-[#729c5e] text-white text-center py-1 text-xs font-bold uppercase tracking-wider mb-2 rounded-sm">
                  Tasks
                </div>
                
                <div className="flex flex-col gap-1 flex-1">
                  {habits.map((habit, index) => {
                    const isChecked = entries[`${habit.id}-${dateStr}`]?.completed || false;
                    const isEven = index % 2 === 0;
                    
                    const todayStr = format(new Date(), "yyyy-MM-dd");
                    const isEditable = dateStr === todayStr;

                    return (
                      <div 
                        key={habit.id} 
                        onClick={() => { if (isEditable) toggleEntry(habit.id, dateStr) }}
                        className={`flex items-center gap-3 p-2 transition-colors ${isEven ? 'bg-[#eef5eb] dark:bg-gray-800/50' : 'bg-transparent'} ${isEditable ? 'cursor-pointer hover:bg-[#dcedd9] dark:hover:bg-gray-800' : 'cursor-not-allowed opacity-80'}`}
                      >
                        <div className={`w-4 h-4 border flex items-center justify-center shrink-0 rounded-[2px] transition-colors ${isChecked ? 'bg-gray-600 border-gray-600 dark:bg-gray-400 dark:border-gray-400' : 'bg-white border-gray-400 dark:bg-gray-900 dark:border-gray-600'}`}>
                          {isChecked && <svg className="w-3 h-3 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs font-medium leading-tight ${isChecked ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                          {habit.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
