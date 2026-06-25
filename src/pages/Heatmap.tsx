import * as React from "react";
import { Grid, ChevronLeft, ChevronRight } from "lucide-react";
import { useDatabaseStore } from "@/store/databaseStore";
import { cn } from "@/utils/cn";
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay, subYears, addYears, getYear } from "date-fns";
import { Button } from "@/components/ui/Button";

export function Heatmap() {
  const { entries, habits } = useDatabaseStore();
  const [currentYearDate, setCurrentYearDate] = React.useState(new Date());
  const [tooltip, setTooltip] = React.useState<{ show: boolean, x: number, y: number, text: string } | null>(null);
  
  const year = getYear(currentYearDate);
  const startDate = startOfYear(currentYearDate);
  const endDate = endOfYear(currentYearDate);
  const daysInYear = eachDayOfInterval({ start: startDate, end: endDate });
  
  const prevYear = () => setCurrentYearDate(subYears(currentYearDate, 1));
  const nextYear = () => setCurrentYearDate(addYears(currentYearDate, 1));

  // Count completions per day
  const completionsPerDay = React.useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(entries).forEach(entry => {
      if (entry.completed && entry.date.startsWith(year.toString())) {
        counts[entry.date] = (counts[entry.date] || 0) + 1;
      }
    });
    return counts;
  }, [entries, year]);

  const maxHabits = habits.length || 1;

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-black/5 dark:bg-[#161b22]";
    const percentage = count / maxHabits;
    if (percentage <= 0.25) return "bg-green-200 dark:bg-[#0e4429]";
    if (percentage <= 0.5) return "bg-green-300 dark:bg-[#006d32]";
    if (percentage <= 0.75) return "bg-green-400 dark:bg-[#26a641]";
    return "bg-green-500 dark:bg-[#39d353]";
  };

  // Build GitHub style column-major grid
  const columns: (Date | null)[][] = [];
  let currentColumn = Array(7).fill(null);
  
  daysInYear.forEach(date => {
    const day = getDay(date); // 0 (Sun) to 6 (Sat)
    currentColumn[day] = date;
    if (day === 6) {
      columns.push(currentColumn);
      currentColumn = Array(7).fill(null);
    }
  });
  if (currentColumn.some(d => d !== null)) {
    columns.push(currentColumn);
  }

  // Calculate month labels positions
  const monthLabels: { label: string, index: number }[] = [];
  columns.forEach((col, index) => {
    const firstDayOfMonth = col.find(d => d !== null && d.getDate() === 1);
    if (firstDayOfMonth || index === 0) {
      const displayDay = firstDayOfMonth || col.find(d => d !== null);
      if (displayDay) {
        // Prevent duplicate consecutive months if week 0 also contains the 1st
        const label = format(displayDay, "MMM");
        if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].label !== label) {
          monthLabels.push({ label, index });
        }
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Grid className="w-8 h-8 text-primary" /> Heatmap
          </h1>
          <p className="text-muted-foreground mt-1">Yearly habit consistency visualization.</p>
        </div>
        <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 rounded-xl p-1">
          <Button variant="ghost" size="icon" onClick={prevYear} className="h-8 w-8"><ChevronLeft className="w-4 h-4"/></Button>
          <span className="px-4 font-semibold text-sm">{year}</span>
          <Button variant="ghost" size="icon" onClick={nextYear} className="h-8 w-8" disabled={year === new Date().getFullYear()}><ChevronRight className="w-4 h-4"/></Button>
        </div>
      </div>

      <div className="glass-card p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">{Object.values(completionsPerDay).reduce((a,b) => a+b, 0)} contributions in {year}</h3>
          <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors">Contribution settings ▾</span>
        </div>
        
        <div 
          className="overflow-x-auto scrollbar-hide border border-border/50 rounded-xl p-6 bg-white dark:bg-[#0d1117]"
          onScroll={() => setTooltip(null)}
        >
          <div className="min-w-max">
            {/* Months Header */}
            <div className="flex relative h-6 text-xs text-muted-foreground ml-8">
              {monthLabels.map(m => (
                <div key={m.index} className="absolute font-medium" style={{ left: `${m.index * 15}px` }}>
                  {m.label}
                </div>
              ))}
            </div>
            
            <div className="flex">
              {/* Days of week labels */}
              <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground font-medium pt-1 pr-2 w-8">
                <div className="h-[12px]" /> {/* Sun */}
                <div className="h-[12px] leading-[12px]">Mon</div> {/* Mon */}
                <div className="h-[12px]" /> {/* Tue */}
                <div className="h-[12px] leading-[12px]">Wed</div> {/* Wed */}
                <div className="h-[12px]" /> {/* Thu */}
                <div className="h-[12px] leading-[12px]">Fri</div> {/* Fri */}
                <div className="h-[12px]" /> {/* Sat */}
              </div>
              
              {/* GitHub Grid */}
              <div className="flex gap-[3px]">
                {columns.map((col, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[3px]">
                    {col.map((day, dIndex) => {
                      if (!day) return <div key={`empty-${wIndex}-${dIndex}`} className="w-[12px] h-[12px] rounded-[2px] bg-transparent" />;
                      const dateStr = format(day, "yyyy-MM-dd");
                      const count = completionsPerDay[dateStr] || 0;
                      return (
                        <div 
                          key={dateStr}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const text = `${count === 0 ? "No contributions" : `${count} contribution${count === 1 ? '' : 's'}`} on ${format(day, "MMMM do")}.`;
                            setTooltip({ show: true, x: rect.left + rect.width / 2, y: rect.top, text });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          className={cn("w-[12px] h-[12px] rounded-[2px] transition-all hover:ring-1 hover:ring-black dark:hover:ring-white", getColorClass(count))}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="hover:text-primary transition-colors cursor-pointer">Learn how we count contributions</span>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-[3px]">
                <div className="w-[12px] h-[12px] rounded-[2px] bg-black/5 dark:bg-[#161b22]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-green-200 dark:bg-[#0e4429]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-green-300 dark:bg-[#006d32]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-green-400 dark:bg-[#26a641]" />
                <div className="w-[12px] h-[12px] rounded-[2px] bg-green-500 dark:bg-[#39d353]" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {tooltip && tooltip.show && (
        <div 
          className="fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-full pb-1.5 animate-in fade-in duration-200"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="bg-gray-900 dark:bg-[#24292f] text-gray-100 text-[11px] py-1.5 px-3 rounded-md whitespace-nowrap font-medium shadow-xl">
            {tooltip.text}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900 dark:border-t-[#24292f]" />
        </div>
      )}
    </div>
  );
}
