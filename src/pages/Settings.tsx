import * as React from "react"
import { User, Bell, Shield, Paintbrush, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useDatabaseStore } from "@/store/databaseStore"

export function Settings() {
  const { user, updateUserName, resetData } = useDatabaseStore();
  
  const userName = user?.name || 'Alex Doe';
  const nameParts = userName.split(' ');
  const [firstName, setFirstName] = React.useState(nameParts[0] || '');
  const [lastName, setLastName] = React.useState(nameParts.slice(1).join(' ') || '');

  const handleSaveProfile = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) {
      updateUserName(fullName);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account, appearance, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2 md:col-span-1">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-black/5 dark:bg-white/5 font-semibold"><User className="w-4 h-4"/> Profile</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground"><Paintbrush className="w-4 h-4"/> Appearance</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground"><Bell className="w-4 h-4"/> Notifications</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground"><Shield className="w-4 h-4"/> Security</Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground"><Download className="w-4 h-4"/> Export Data</Button>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-lg mb-6">Public Profile</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-1 shrink-0">
                <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}&backgroundColor=b6e3f4`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input defaultValue="alex@example.com" type="email" disabled className="opacity-50" />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-semibold text-lg mb-6">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-destructive/5">
                <div>
                  <h4 className="font-medium text-destructive">Export Account Data</h4>
                  <p className="text-sm text-muted-foreground">Download all your habits, streaks, and analytics in CSV format.</p>
                </div>
                <Button variant="outline" className="text-foreground border-destructive/20 hover:bg-destructive/10">Export CSV</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-xl bg-destructive/5">
                <div>
                  <h4 className="font-medium text-destructive">Reset All Progress</h4>
                  <p className="text-sm text-muted-foreground">Permanently remove all recorded habit streaks and tracking history to start fresh.</p>
                </div>
                <Button variant="destructive" className="gap-2" onClick={() => {
                  if (window.confirm('Are you absolutely sure you want to completely reset all your tracking progress? This cannot be undone.')) {
                    resetData();
                  }
                }}>
                  <Trash2 className="w-4 h-4"/> Reset Progress
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
