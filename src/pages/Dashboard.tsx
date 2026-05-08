import React, { useState, useEffect } from 'react';
import { Layers, FileCheck, AlertCircle, Briefcase, Calendar, BookOpen, MapPin, User, Building2 } from 'lucide-react';
import { mockWorkItems } from '../data/mockData';
import { StorageService } from '../services/StorageService';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-card p-6 rounded-xl border shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      {trend && (
        <p className="text-xs text-green-500 mt-1 flex items-center font-medium">
          <span className="bg-green-500/10 px-1.5 py-0.5 rounded">↑ {trend}</span>
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [project, setProject] = useState({
    name: 'Chung cư cao cấp Sky Garden',
    investor: 'Tập đoàn Sun Group',
    contractor: 'Công ty Cổ phần Xây dựng Coteccons',
    location: 'Quận 7, TP. Hồ Chí Minh',
    startDate: '15/01/2026',
    endDate: '30/12/2027',
  });
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);

  useEffect(() => {
    const savedProject = StorageService.getProject();
    if (savedProject) {
      setProject({
        name: savedProject.name,
        investor: savedProject.investor,
        contractor: savedProject.contractor,
        location: savedProject.location,
        startDate: savedProject.startDate.split('-').reverse().join('/'),
        endDate: savedProject.endDate.split('-').reverse().join('/'),
      });
    }

    const savedDiary = StorageService.getDiary();
    setDiaryEntries(savedDiary.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 text-primary/80 font-medium italic">Chào mừng trở lại! Dưới đây là tóm tắt tiến độ dự án.</p>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Project Info Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Briefcase size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-primary mb-2">
            <Building2 size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Thông tin dự án</span>
          </div>
          <h2 className="text-xl font-black text-primary uppercase leading-tight mb-4">{project.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Địa điểm</p>
                <p className="text-sm font-medium">{project.location}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Chủ đầu tư</p>
                <p className="text-sm font-medium">{project.investor}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Khởi công</p>
                <p className="text-sm font-medium">{project.startDate}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Hoàn thành</p>
                <p className="text-sm font-medium">{project.endDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Tổng công việc" 
          value={mockWorkItems.length} 
          icon={Layers} 
          color="bg-blue-500/10 text-blue-500"
          trend="Đang thực hiện"
        />
        <StatCard 
          title="Hồ sơ đã tạo" 
          value="12" 
          icon={FileCheck} 
          color="bg-green-500/10 text-green-500"
          trend="+3 mới"
        />
        <StatCard 
          title="Nhật ký đã ghi" 
          value={diaryEntries.length} 
          icon={BookOpen} 
          color="bg-purple-500/10 text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Items Summary */}
        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center">
              <Layers size={18} className="mr-2 text-primary" /> Công việc hiện tại
            </h3>
          </div>
          <div className="space-y-3 flex-1 overflow-auto max-h-[300px] pr-2 custom-scrollbar">
            {mockWorkItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border-l-4 border-primary/20 hover:border-primary">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-medium">{item.category} • {item.line}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{item.quantity} {item.unit}</p>
                  <p className="text-[10px] text-muted-foreground italic">NT: {item.inspectionDate.split('-').reverse().join('/')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diary Summary */}
        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center">
              <BookOpen size={18} className="mr-2 text-primary" /> Lịch sử nhật ký thi công
            </h3>
          </div>
          <div className="space-y-4 flex-1 overflow-auto max-h-[300px] pr-2 custom-scrollbar">
            {diaryEntries.length > 0 ? (
              diaryEntries.map((entry, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-muted hover:border-primary transition-colors py-1">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-primary shadow-sm shadow-primary/50"></div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{entry.date.split('-').reverse().join('/')}</span>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{entry.weather} • {entry.temp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-2">
                    "{entry.content}"
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50">
                <BookOpen size={40} className="mb-2" />
                <p className="text-sm">Chưa có nhật ký nào được lưu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
