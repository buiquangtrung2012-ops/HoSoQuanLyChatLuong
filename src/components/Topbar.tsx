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
          <div className="flex items-center space-x-3">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tighter">v14052026.1009</span>
          <button 
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('v', Date.now().toString());
              window.location.href = url.toString();
            }}
            className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm font-medium"
          >
            <RefreshCw size={18} className="mr-2" /> Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};
