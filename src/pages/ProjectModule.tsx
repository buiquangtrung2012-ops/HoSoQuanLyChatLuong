import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import type { Project } from '../types';

export const ProjectModule: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: '1',
    name: 'Chung cư cao cấp Sky Garden',
    investor: 'Tập đoàn Sun Group',
    contractor: 'Công ty Cổ phần Xây dựng Coteccons',
    supervisor: 'Công ty CP Tư vấn Công nghệ, Thiết bị và Kiểm định xây dựng - CONINCO',
    designer: 'Công ty thiết kế kiến trúc ABC',
    contractNumber: '123/2026/HĐ-XD',
    location: 'Quận 7, TP. Hồ Chí Minh',
    startDate: '2026-01-15',
    endDate: '2027-12-30',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Thông tin dự án</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <RefreshCw size={18} className="mr-2" /> Tải lại
          </button>
          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <Save size={18} className="mr-2" /> Lưu thông tin
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
          <input 
            type="date"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày hoàn thành (Dự kiến)</label>
          <input 
            type="date"
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
