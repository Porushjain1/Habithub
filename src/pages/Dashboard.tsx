import { useDatabaseStore } from '@/store/databaseStore';
import { Target, Flame } from 'lucide-react';
import { getDaysInMonth, format, subDays } from 'date-fns';
import * as React from 'react';

export function Dashboard() {
  const { habits, entries } = useDatabaseStore();
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const daysInMonth = getDaysInMonth(currentDate);

  // 1. Overall Progress
  const totalPossible = habits.length * daysInMonth;
  let totalCompletedThisMonth = 0;
  habits.forEach(h => {
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      if (entries[`${h.id}-${dStr}`]?.completed) totalCompletedThisMonth++;
    }
  });
  const overallProgress = totalPossible === 0 ? 0 : Math.round((totalCompletedThisMonth / totalPossible) * 100);

  // 2. Individual Habit Stats (Current Month)
  const habitStats = React.useMemo(() => {
    return habits.map(h => {
      let doneThisMonth = 0;
      for (let i = 1; i <= daysInMonth; i++) {
        const dStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        if (entries[`${h.id}-${dStr}`]?.completed) doneThisMonth++;
      }
      const progress = Math.round((doneThisMonth / daysInMonth) * 100);

      // Longest streak calculation
      const completedDates = Object.values(entries)
        .filter(e => e.habitId === h.id && e.completed)
        .map(e => e.date)
        .sort();
      
      let longestStreak = 0;
      let tempStreak = 0;
      let previousDate: Date | null = null;
      
      completedDates.forEach(dateStr => {
        const d = new Date(dateStr);
        if (!previousDate) {
          tempStreak = 1;
        } else {
          // Calculate difference in days safely without timezone issues
          // Using UTC to avoid daylight saving time gaps
          const utc1 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
          const utc2 = Date.UTC(previousDate.getFullYear(), previousDate.getMonth(), previousDate.getDate());
          const diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        previousDate = d;
      });

      // Current streak calculation (backwards from today)
      let currentStreak = 0;
      const todayStr = format(new Date(), "yyyy-MM-dd");
      let d = new Date();
      if (!entries[`${h.id}-${todayStr}`]?.completed) {
        d = subDays(new Date(), 1); // If not done today, start checking from yesterday
      }
      
      while(entries[`${h.id}-${format(d, "yyyy-MM-dd")}`]?.completed) {
        currentStreak++;
        d = subDays(d, 1);
      }

      return { ...h, doneThisMonth, progress, currentStreak, longestStreak };
    }).sort((a, b) => b.progress - a.progress);
  }, [habits, entries, year, month, daysInMonth]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here is your overall and individual habit progress.</p>
        </div>
      </div>

      {/* Overall Progress Hero Card */}
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-2 border border-primary/20 bg-primary/5 dark:bg-primary/10">
        <Target className="w-8 h-8 text-primary mb-2" />
        <span className="text-5xl font-extrabold">{totalCompletedThisMonth} / {totalPossible}</span>
        <span className="text-xl font-bold text-primary">{overallProgress}%</span>
        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-2">Overall Monthly Progress</span>
      </div>

      {/* Individual Habits List */}
      <h2 className="text-xl font-bold mt-8 mb-4">Top Habits Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {habitStats.map(stat => (
          <div key={stat.id} className="glass-card p-6 flex flex-col gap-4 border border-border/50 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  {stat.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg">{stat.name}</h3>
              </div>
              <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.progress}%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Completed</span>
                <span className="text-lg font-bold">{stat.doneThisMonth} / {daysInMonth}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Progress</span>
                <span className="text-lg font-bold">{stat.progress}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Current Streak</span>
                <span className="text-lg font-bold flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" /> {stat.currentStreak} days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Longest Streak</span>
                <span className="text-lg font-bold flex items-center gap-1"><Flame className="w-4 h-4 text-red-500" /> {stat.longestStreak} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
