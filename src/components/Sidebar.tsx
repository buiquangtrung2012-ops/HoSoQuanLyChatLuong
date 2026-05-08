import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Layers, 
  Package, 
  Truck, 
  FlaskConical, 
  BookOpen, 
  FileText, 
  Download,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'project', label: 'Dự án', icon: Briefcase },
  { id: 'personnel', label: 'Nhân sự', icon: Users },
  { id: 'work-items', label: 'Công việc', icon: Layers },
  { id: 'materials', label: 'Vật liệu', icon: Package },
  { id: 'equipment', label: 'Máy móc', icon: Truck },
  { id: 'lab', label: 'PTN', icon: FlaskConical },
  { id: 'diary', label: 'Nhật ký', icon: BookOpen },
  { id: 'records', label: 'Hồ sơ', icon: FileText },
  { id: 'template', label: 'Tạo mẫu', icon: Layout },
  { id: 'export', label: 'Xuất file', icon: Download },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  return (
    <div className={cn(
      "h-screen bg-card border-r transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && <span className="font-bold text-primary truncate">CQ Pro Add-in</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-accent rounded-md"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center p-3 mb-1 transition-colors",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border-r-4 border-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              isCollapsed ? "justify-center" : "px-4"
            )}
            title={item.label}
          >
            <item.icon size={20} className={cn(isCollapsed ? "" : "mr-3")} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button className={cn(
          "w-full flex items-center text-muted-foreground hover:text-foreground",
          isCollapsed ? "justify-center" : "px-0"
        )}>
          <Settings size={20} className={cn(isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span className="text-sm font-medium">Cài đặt</span>}
        </button>
      </div>
    </div>
  );
};
