import { Bell, Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import * as React from "react";
import { useDatabaseStore } from "@/store/databaseStore";

export function Topbar() {
  const { user, updateUserName } = useDatabaseStore();
  const userName = user?.name || 'Alex Doe';
  const [isDark, setIsDark] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editName, setEditName] = React.useState(userName);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="h-20 px-6 flex items-center justify-between glass bg-white/30 dark:bg-black/30 border-b border-border/50 sticky top-0 z-20">
      <div className="flex-1 max-w-md">
        <Input 
          icon={<Search className="w-4 h-4" />} 
          placeholder="Search habits, tasks..." 
          className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 glass shadow-sm"
        />
      </div>

      <div className="flex items-center gap-4 ml-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button variant="glass" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive border-2 border-background"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="text-right hidden sm:block">
            {isEditingName ? (
              <input 
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={() => {
                  if (editName.trim()) updateUserName(editName.trim());
                  setIsEditingName(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.currentTarget.blur();
                }}
                className="text-sm font-semibold bg-transparent border-b border-primary outline-none w-[120px] text-right text-foreground p-0 m-0"
              />
            ) : (
              <p 
                className="text-sm font-semibold leading-none cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                  setEditName(userName);
                  setIsEditingName(true);
                }}
                title="Click to edit profile name"
              >
                {userName}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1 text-primary font-medium">Level {(user?.perfectDays || 0) + 9} Explorer</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-0.5 shadow-sm">
            <div className="w-full h-full rounded-full border-2 border-background overflow-hidden bg-muted">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
