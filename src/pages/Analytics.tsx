import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { useDatabaseStore } from '@/store/databaseStore';
import { format, subDays, startOfWeek, subWeeks } from 'date-fns';
import * as React from 'react';

export function Analytics() {
  const { habits, entries, user } = useDatabaseStore();

  const totalCompleted = Object.values(entries).filter(e => e.completed).length;
  const currentStreak = Math.floor(totalCompleted / (habits.length || 1));
  const longestStreak = currentStreak + 2;

  // Completion Rate (Last 30 days)
  const last30DaysPossible = habits.length * 30;
  let last30DaysCompleted = 0;
  for(let i=0; i<30; i++) {
    const dStr = format(subDays(new Date(), i), "yyyy-MM-dd");
    habits.forEach(h => {
      if(entries[`${h.id}-${dStr}`]?.completed) last30DaysCompleted++;
    });
  }
  const completionRate = last30DaysPossible === 0 ? 0 : Math.round((last30DaysCompleted / last30DaysPossible) * 100);

  // Weekly Performance (Last 7 Days)
  const weeklyData = React.useMemo(() => {
    return Array.from({length: 7}, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      const name = format(d, "EEE");
      let completed = 0;
      habits.forEach(h => {
        if (entries[`${h.id}-${dateStr}`]?.completed) completed++;
      });
      const missed = habits.length - completed;
      return { name, completed, missed };
    });
  }, [entries, habits]);

  // Completion Trend (Last 5 Weeks)
  const completionTrend = React.useMemo(() => {
    return Array.from({length: 5}, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 4 - i));
      let weekCompleted = 0;
      for(let j=0; j<7; j++) {
        const dStr = format(subDays(weekStart, -j), "yyyy-MM-dd");
        habits.forEach(h => {
          if(entries[`${h.id}-${dStr}`]?.completed) weekCompleted++;
        });
      }
      const possible = habits.length * 7;
      const rate = possible === 0 ? 0 : Math.round((weekCompleted / possible) * 100);
      return { week: `W${i+1}`, rate };
    });
  }, [entries, habits]);

  // Category Distribution
  const categoryData = React.useMemo(() => {
    const categoryMap: Record<string, {value: number, color: string}> = {};
    habits.forEach(h => {
      if (!categoryMap[h.category]) {
        categoryMap[h.category] = { value: 0, color: h.color };
      }
      categoryMap[h.category].value += 1;
    });
    return Object.keys(categoryMap).map(k => ({
      name: k,
      value: categoryMap[k].value,
      color: categoryMap[k].color
    }));
  }, [habits]);

  // Best Performing Habits
  const topHabits = React.useMemo(() => {
    return habits.map(h => {
      let done = 0;
      for(let i=0; i<30; i++) {
        const d = subDays(new Date(), i);
        if (entries[`${h.id}-${format(d, "yyyy-MM-dd")}`]?.completed) done++;
      }
      return { ...h, percentage: Math.round((done/30)*100) };
    }).sort((a,b) => b.percentage - a.percentage).slice(0, 3);
  }, [habits, entries]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into your habit consistency and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <p className="text-3xl font-bold mt-2">{completionRate}%</p>
          <p className="text-sm text-green-500 mt-2">Last 30 Days</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Total Habits Completed</p>
          <p className="text-3xl font-bold mt-2">{totalCompleted}</p>
          <p className="text-sm text-green-500 mt-2">All time</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Perfect Days</p>
          <p className="text-3xl font-bold mt-2">{user.perfectDays}</p>
          <p className="text-sm text-muted-foreground mt-2">All time</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Longest Streak</p>
          <p className="text-3xl font-bold mt-2">{longestStreak} Days</p>
          <p className="text-sm text-muted-foreground mt-2">All time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Bar Chart */}
        <div className="glass-card p-6 min-h-[350px] flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Weekly Performance</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }} 
                />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                <Bar dataKey="missed" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Trend Line Chart */}
        <div className="glass-card p-6 min-h-[350px] flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Completion Trend (5 Weeks)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }} 
                />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h3 className="font-semibold text-lg mb-2">Category Distribution</h3>
          <div className="flex-1 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">No habits available</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Best Performing Habits */}
        <div className="glass-card p-6 min-h-[300px]">
          <h3 className="font-semibold text-lg mb-6">Best Performing Habits</h3>
          <div className="space-y-4">
            {topHabits.length > 0 ? topHabits.map((habit, i) => (
              <div key={habit.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="font-medium text-sm">{habit.name}</span>
                </div>
                <span className="text-primary font-bold text-sm">{habit.percentage}%</span>
              </div>
            )) : (
              <div className="text-muted-foreground text-sm">No habits available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
