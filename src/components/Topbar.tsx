import React from 'react';
import { Search, Bell, User, RefreshCw } from 'lucide-react';

export const Topbar: React.FC = () => {
  const handleUpdate = () => {
    // Force reload from server to get latest changes from GitHub
    window.location.reload();
  };

  return (
    <div className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="relative w-64">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
          <Search size={18} />
        </span>
        <input 
          type="text" 
          placeholder="Tìm kiếm..." 
          className="w-full pl-10 pr-4 py-2 bg-accent/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 mr-2">
          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            v08052026.1528
          </span>
          <button 
            onClick={handleUpdate}
            className="flex items-center px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            title="Cập nhật bản mới nhất từ GitHub"
          >
            <RefreshCw size={14} className="mr-2" />
            Cập nhật
          </button>
        </div>

        <button className="p-2 text-muted-foreground hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>
      </div>
    </div>
  );
};
