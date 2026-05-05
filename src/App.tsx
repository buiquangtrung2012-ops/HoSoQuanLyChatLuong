import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { ProjectModule } from './pages/ProjectModule';
import { PersonnelModule } from './pages/PersonnelModule';
import { WorkItemsModule } from './pages/WorkItemsModule';
import { RecordsModule } from './pages/RecordsModule';
import { DiaryModule } from './pages/DiaryModule';
import { MaterialModule } from './pages/MaterialModule';
import { EquipmentModule } from './pages/EquipmentModule';
import { LabModule } from './pages/LabModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOfficeReady, setIsOfficeReady] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.Office) {
      // @ts-ignore
      window.Office.onReady((info) => {
        setIsOfficeReady(true);
        console.log('Office ready:', info.host);
      });
    } else {
      setIsOfficeReady(true); // For browser development
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'project': return <ProjectModule />;
      case 'personnel': return <PersonnelModule />;
      case 'work-items': return <WorkItemsModule />;
      case 'records': return <RecordsModule />;
      case 'diary': return <DiaryModule />;
      case 'materials': return <MaterialModule />;
      case 'equipment': return <EquipmentModule />;
      case 'lab': return <LabModule />;
      default: return <div className="p-8 text-center text-muted-foreground">Tính năng {activeTab} đang được phát triển...</div>;
    }
  };

  if (!isOfficeReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">Đang khởi tạo Office Add-in...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
