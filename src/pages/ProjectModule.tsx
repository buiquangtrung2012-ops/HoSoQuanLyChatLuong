import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Calendar } from 'lucide-react';
import type { Project } from '../types';
import { StorageService } from '../services/storageService';

export const ProjectModule: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: '1',
    name: 'Dự án Chiếu sáng Công cộng Quận 1',
    investor: 'UBND Quận 1',
    contractor: 'Công ty Cổ phần Cơ điện ABC',
    supervisor: 'Công ty Tư vấn Giám sát XYZ',
    designer: 'Công ty Thiết kế DEF',
    contractNumber: '123/HĐ-MB',
    location: 'Đường Lê Lợi, Quận 1, TP.HCM',
    startDate: '2026-05-01',
    endDate: '2027-12-31',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = StorageService.getProject();
    if (saved) {
      setProject(saved);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    StorageService.saveProject(project);
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã lưu thông tin dự án thành công!');
    }, 500);
  };

  const handleRefresh = () => {
    const saved = StorageService.getProject();
    if (saved) setProject(saved);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Thông tin dự án</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw size={18} className="mr-2" /> Tải lại
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={18} className="mr-2" /> {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Tên dự án</label>
          <input 
            name="name"
            value={project.name}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
            placeholder="Nhập tên dự án..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chủ đầu tư</label>
          <input 
            name="investor"
            value={project.investor}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nhà thầu thi công</label>
          <input 
            name="contractor"
            value={project.contractor}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tư vấn giám sát</label>
          <input 
            name="supervisor"
            value={project.supervisor}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tư vấn thiết kế</label>
          <input 
            name="designer"
            value={project.designer}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Số hợp đồng</label>
          <input 
            name="contractNumber"
            value={project.contractNumber}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Địa điểm xây dựng</label>
          <input 
            name="location"
            value={project.location}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày khởi công</label>
          <div className="relative">
            <input 
              type="text"
              name="startDate"
              value={project.startDate.split('-').reverse().join('/')}
              onChange={(e) => {
                const val = e.target.value.split('/').reverse().join('-');
                setProject(prev => ({ ...prev, startDate: val }));
              }}
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="dd/mm/yyyy"
            />
            <Calendar size={18} className="absolute right-3 top-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày hoàn thành (Dự kiến)</label>
          <div className="relative">
            <input 
              type="text"
              name="endDate"
              value={project.endDate.split('-').reverse().join('/')}
              onChange={(e) => {
                const val = e.target.value.split('/').reverse().join('-');
                setProject(prev => ({ ...prev, endDate: val }));
              }}
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="dd/mm/yyyy"
            />
            <Calendar size={18} className="absolute right-3 top-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
