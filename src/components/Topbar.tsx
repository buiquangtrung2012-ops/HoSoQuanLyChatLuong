import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export const Topbar: React.FC = () => {
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
        <button className="p-2 text-muted-foreground hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>
        <div className="flex items-center space-x-2 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs text-muted-foreground">Chỉ huy trưởng</p>
          </div>
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
