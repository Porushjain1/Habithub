import { FileText, FileSpreadsheet, FileIcon, BarChart3, TrendingUp, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDatabaseStore } from "@/store/databaseStore";

export function Reports() {
  const { habits, user } = useDatabaseStore();

  const handleExportCSV = () => {
    // Generate simple CSV
    const rows = habits.map(h => `${h.name},${h.category}`);
    const csv = ["Habit,Category", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habitbub_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Export</h1>
          <p className="text-muted-foreground mt-1">Generate and download your monthly performance reports.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 glass border-green-500/30 hover:bg-green-500/10 text-green-600 dark:text-green-400">
            <FileSpreadsheet className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" className="gap-2 glass border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FileIcon className="w-4 h-4" /> Excel
          </Button>
          <Button variant="outline" className="gap-2 glass border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400">
            <FileText className="w-4 h-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 text-center space-y-4 flex flex-col items-center justify-center border-t-4 border-t-primary">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Monthly Summary Report</h3>
          <p className="text-sm text-muted-foreground max-w-sm">Includes your completion percentages, visual charts, and streak analysis for the current month.</p>
          <Button className="w-full max-w-xs mt-4">Generate Monthly PDF</Button>
        </div>

        <div className="glass-card p-8 space-y-6">
          <h3 className="font-bold text-lg border-b border-border/50 pb-4">Report Preview</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500"/> Overall Completion</span>
              <span className="font-bold text-lg">78%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500"/> Perfect Days</span>
              <span className="font-bold text-lg">{user.perfectDays}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-500"/> Total Active Habits</span>
              <span className="font-bold text-lg">{habits.length}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">Top Performing Habit: <strong>Workout (95%)</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
