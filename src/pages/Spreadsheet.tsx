import * as React from "react";
import { ChevronLeft, ChevronRight, Edit2, Plus, Trash2 } from "lucide-react";
import { useDatabaseStore } from "@/store/databaseStore";
import { format, getDaysInMonth, addMonths, subMonths } from "date-fns";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function Spreadsheet() {
  const { habits, entries, toggleEntry, addHabit, deleteHabit, updateHabit } = useDatabaseStore();
  
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [newHabitName, setNewHabitName] = React.useState("");
  const [editingHabitId, setEditingHabitId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const daysInMonth = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit({
      id: Date.now().toString(),
      name: newHabitName,
      category: "Custom",
      color: "#10b981",
      frequency: "daily",
      target: 1,
      createdAt: new Date().toISOString()
    });
    setNewHabitName("");
  };

  const saveEdit = () => {
    if (editingHabitId && editName.trim()) {
      updateHabit(editingHabitId, editName.trim());
    }
    setEditingHabitId(null);
  };

  // Group days into weeks for the header (Week 1, Week 2...)
  const weeks = [];
  for (let i = 0; i < daysInMonth; i += 7) {
    weeks.push({
      label: `Week ${Math.floor(i / 7) + 1}`,
      colSpan: Math.min(7, daysInMonth - i)
    });
  }

  // Calculate stats per day
  const dailyStats = daysArray.map(day => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let done = 0;
    habits.forEach(h => {
      if (entries[`${h.id}-${dateStr}`]?.completed) done++;
    });
    const notDone = habits.length - done;
    const progress = habits.length === 0 ? 0 : Math.round((done / habits.length) * 100);
    return { day, done, notDone, progress, dateStr };
  });

  const chartData = dailyStats.map(stat => ({
    name: stat.day.toString(),
    progress: stat.progress
  }));

  const monthName = format(currentDate, "MMMM");

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-transparent text-black dark:text-white font-sans p-2 sm:p-6 transition-all duration-300">
      
      {/* Top Navigation matches standard app style but forced light for contrast */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-black/50 p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm max-w-max">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 dark:text-white"/></button>
          <span className="text-xl font-bold min-w-[150px] text-center text-gray-800 dark:text-gray-100">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 dark:text-white"/></button>
        </div>
      </div>

      {/* The Google Sheets Replica */}
      <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-300 dark:border-gray-700 inline-block overflow-hidden max-w-full overflow-x-auto relative">
        <table className="border-collapse text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          <thead>
            {/* Week Header Row */}
            <tr>
              <th className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-2 font-bold text-center text-gray-800 dark:text-gray-100 text-lg sticky left-0 z-20 min-w-[280px]">
                {monthName}
              </th>
              {weeks.map((w, i) => (
                <th key={i} colSpan={w.colSpan} className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center font-medium text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {w.label}
                </th>
              ))}
              {/* Analysis Header */}
              <th colSpan={3} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 text-center font-bold text-gray-800 dark:text-gray-100 text-sm uppercase tracking-wider">
                Analysis
              </th>
            </tr>
            {/* Weekday Row (Mo, Tu, We...) */}
            <tr>
              <th rowSpan={2} className="bg-[#e2f2e5] dark:bg-green-900 border-r border-b border-gray-300 dark:border-gray-700 p-4 font-bold text-lg text-center sticky left-0 z-20 text-gray-800 dark:text-gray-100 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                My Habits
              </th>
              {daysArray.map(day => {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const weekday = format(new Date(dateStr), "EE").substring(0, 2); // Sa, Su, Mo
                return (
                  <th key={day} className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center font-medium text-xs text-gray-500 dark:text-gray-400 min-w-[36px]">
                    {weekday}
                  </th>
                );
              })}
              {/* Analysis Sub-headers */}
              <th rowSpan={2} className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-l border-gray-300 dark:border-gray-700 p-1 text-center font-medium text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">Goal</th>
              <th rowSpan={2} className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center font-medium text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">Actual</th>
              <th rowSpan={2} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-1 text-center font-medium text-xs text-gray-500 dark:text-gray-400 min-w-[100px]">Progress</th>
            </tr>
            {/* Day Number Row */}
            <tr>
              {daysArray.map(day => (
                <th key={day} className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center font-bold text-gray-700 dark:text-gray-200">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Habit Rows */}
            {habits.map((habit) => (
              <tr key={habit.id} className="group">
                <td className="bg-[#e2f2e5] dark:bg-green-900/50 border-r border-b border-gray-300 dark:border-gray-700 p-2 text-right font-medium text-gray-800 dark:text-gray-200 sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingHabitId(habit.id); setEditName(habit.name); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteHabit(habit.id)} className="text-red-400 hover:text-red-500 p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {editingHabitId === habit.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
                        <input 
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={saveEdit}
                          className="text-right bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-sm w-[150px] outline-none focus:border-blue-500"
                        />
                      </form>
                    ) : (
                      <span>{habit.name}</span>
                    )}
                  </div>
                </td>
                {daysArray.map(day => {
                  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isChecked = entries[`${habit.id}-${dateStr}`]?.completed || false;
                  
                  const todayStr = format(new Date(), "yyyy-MM-dd");
                  const isEditable = dateStr === todayStr;

                  return (
                    <td key={day} className={`bg-white dark:bg-gray-900 border-r border-b border-gray-300 dark:border-gray-700 text-center relative p-0 ${isEditable ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : 'cursor-not-allowed opacity-80'}`} onClick={() => { if (isEditable) toggleEntry(habit.id, dateStr) }}>
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <div className={`w-4 h-4 border rounded-[2px] flex items-center justify-center transition-colors ${isChecked ? 'bg-gray-500 border-gray-500' : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600'}`}>
                          {isChecked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </div>
                    </td>
                  );
                })}
                {/* Analysis Cells for Habit */}
                <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-l border-gray-300 dark:border-gray-700 text-center font-medium text-gray-600 dark:text-gray-400 p-1 text-xs">{daysInMonth}</td>
                <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 text-center font-bold text-gray-800 dark:text-gray-200 p-1 text-xs">
                  {daysArray.filter(day => entries[`${habit.id}-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`]?.completed).length}
                </td>
                <td className="bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 p-1 relative min-w-[100px]">
                  {(() => {
                    const actual = daysArray.filter(day => entries[`${habit.id}-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`]?.completed).length;
                    const percentage = Math.round((actual / daysInMonth) * 100);
                    return (
                      <>
                        <div className="absolute top-1.5 bottom-1.5 left-1.5 bg-[#bbf7d0] dark:bg-green-900/40 rounded-sm transition-all" style={{ width: `calc(${percentage}% - 12px)` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-gray-200 z-10">{percentage}%</div>
                      </>
                    );
                  })()}
                </td>
              </tr>
            ))}

            {/* Add New Habit Row */}
            <tr>
              <td className="bg-[#e2f2e5] dark:bg-green-900/50 border-r border-b border-gray-300 dark:border-gray-700 p-2 text-right sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                <form onSubmit={handleAddHabit} className="flex justify-end items-center gap-1">
                  <input 
                    placeholder="Add habit..." 
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="text-right bg-transparent border-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm w-[150px] dark:text-gray-200"
                  />
                  <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"><Plus className="w-4 h-4"/></button>
                </form>
              </td>
              <td colSpan={daysInMonth + 3} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"></td>
            </tr>

            {/* Summary Spacer */}
            <tr>
              <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-1 sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]"></td>
              <td colSpan={daysInMonth + 3} className="bg-[#f8f9fa] dark:bg-gray-800 border-gray-300 dark:border-gray-700 p-1"></td>
            </tr>

            {/* Progress % Row */}
            <tr>
              <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-t border-gray-300 dark:border-gray-700 p-2 font-bold text-gray-700 dark:text-gray-200 text-right sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                Progress
              </td>
              {dailyStats.map(stat => (
                <td key={stat.day} className="bg-white dark:bg-gray-900 border-r border-b border-t border-gray-300 dark:border-gray-700 p-1 text-center font-bold text-gray-700 dark:text-gray-300 text-xs">
                  {stat.progress}%
                </td>
              ))}
              <td colSpan={3} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-t border-l border-gray-300 dark:border-gray-700"></td>
            </tr>
            
            {/* Done Row */}
            <tr>
              <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-sm font-medium text-gray-600 dark:text-gray-400 text-right sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                Done
              </td>
              {dailyStats.map(stat => (
                <td key={stat.day} className="bg-white dark:bg-gray-900 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center text-gray-600 dark:text-gray-400 text-xs">
                  {stat.done}
                </td>
              ))}
              <td colSpan={3} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-l border-gray-300 dark:border-gray-700"></td>
            </tr>

            {/* Not Done Row */}
            <tr>
              <td className="bg-[#f8f9fa] dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-sm font-medium text-gray-600 dark:text-gray-400 text-right sticky left-0 z-10 shadow-[1px_0_0_0_#d1d5db] dark:shadow-[1px_0_0_0_#374151]">
                Not Done
              </td>
              {dailyStats.map(stat => (
                <td key={stat.day} className="bg-white dark:bg-gray-900 border-r border-b border-gray-300 dark:border-gray-700 p-1 text-center text-gray-600 dark:text-gray-400 text-xs">
                  {stat.notDone}
                </td>
              ))}
              <td colSpan={3} className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-l border-gray-300 dark:border-gray-700"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded shadow-sm border border-gray-300 dark:border-gray-700 p-6 inline-block w-full overflow-hidden">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-lg">Consistency Curve</h3>
        <div className="h-[200px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-prose-body, rgba(255, 255, 255, 0.9))', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  color: '#374151'
                }} 
              />
              <Area type="monotone" dataKey="progress" stroke="#10b981" fillOpacity={1} fill="url(#colorCurve)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
