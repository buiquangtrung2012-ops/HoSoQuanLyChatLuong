import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Calendar, Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Project } from '../types';
import { StorageService } from '../services/storageService';

export const ProjectModule: React.FC = () => {
  const [project, setProject] = useState<Project>({
    id: '1',
    name: 'Dự án Chiếu sáng Công cộng Quận 1',
    investor: 'UBND Quận 1',
    contractor: 'Công ty Cổ phần Cơ điện ABC',
    isJointVenture: false,
    contractorMembers: [],
    supervisor: 'Công ty Tư vấn Giám sát XYZ',
    designer: 'Công ty Thiết kế DEF',
    contractNumber: '123/HĐ-MB',
    packageName: 'Gói thầu số 01: Thi công hệ thống chiếu sáng',
    location: 'Đường Lê Lợi, Quận 1, TP.HCM',
    startDate: '2026-05-01',
    endDate: '2027-12-31',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    const saved = StorageService.getProject();
    if (saved) {
      setProject({ ...project, ...saved });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleJointVenture = () => {
    setProject(prev => ({
      ...prev,
      isJointVenture: !prev.isJointVenture,
      contractorMembers: prev.contractorMembers?.length ? prev.contractorMembers : [''],
    }));
  };

  const handleAddMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    setProject(prev => ({
      ...prev,
      contractorMembers: [...(prev.contractorMembers || []), trimmed],
    }));
    setNewMember('');
  };

  const handleRemoveMember = (idx: number) => {
    setProject(prev => ({
      ...prev,
      contractorMembers: (prev.contractorMembers || []).filter((_, i) => i !== idx),
    }));
  };

  const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddMember();
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
    if (saved) setProject({ ...project, ...saved });
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
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Nhập tên dự án..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Tên gói thầu</label>
            <input 
              name="packageName"
              value={project.packageName}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Nhập tên gói thầu..."
            />
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Chủ đầu tư</label>
            <input 
              name="investor"
              value={project.investor}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
  
          {/* Nhà thầu thi công + Liên danh */}
          <div className="space-y-3 md:col-span-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhà thầu thi công</label>
              <input 
                name="contractor"
                value={project.contractor}
                onChange={handleChange}
                spellCheck={false}
                autoComplete="off"
                className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="VD: Công ty Cổ phần Tập đoàn Xây dựng Minh Hòa"
              />
            </div>
  
            {/* Toggle Liên danh */}
            <div className={`rounded-xl border-2 p-4 transition-all ${project.isJointVenture ? 'border-blue-300 bg-blue-50' : 'border-border bg-muted/30'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">Chế độ Liên danh</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sử dụng bảng ký tên 3 cột cho nhiều thành viên</p>
                </div>
                <button
                  onClick={handleToggleJointVenture}
                  className="flex-shrink-0 ml-4"
                  title={project.isJointVenture ? 'Tắt Liên danh' : 'Bật Liên danh'}
                >
                  {project.isJointVenture 
                    ? <ToggleRight size={40} className="text-blue-600" />
                    : <ToggleLeft size={40} className="text-muted-foreground" />
                  }
                </button>
              </div>
  
              {project.isJointVenture && (
                <div className="mt-4 space-y-3">
                  <p className="text-[11px] font-bold text-blue-700 uppercase tracking-widest">
                    Danh sách thành viên ký tên
                  </p>
  
                  <div className="space-y-2">
                    {(project.contractorMembers || []).map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={member}
                          onChange={e => {
                            const updated = [...(project.contractorMembers || [])];
                            updated[idx] = e.target.value;
                            setProject(prev => ({ ...prev, contractorMembers: updated }));
                          }}
                          spellCheck={false}
                          autoComplete="off"
                          placeholder={`Tên thành viên ${idx + 1}`}
                          className="flex-1 p-2.5 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-400/50 outline-none"
                        />
                        <button
                          onClick={() => handleRemoveMember(idx)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Xóa thành viên"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
  
                  {/* Input thêm thành viên */}
                  <div className="flex items-center gap-2">
                    <input
                      value={newMember}
                      onChange={e => setNewMember(e.target.value)}
                      onKeyDown={handleMemberKeyDown}
                      spellCheck={false}
                      autoComplete="off"
                      placeholder="Nhập tên thành viên mới..."
                      className="flex-1 p-2.5 border border-dashed rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-400/50 outline-none"
                    />
                    <button
                      onClick={handleAddMember}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      <Plus size={16} /> Thêm thành viên
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Tư vấn giám sát</label>
            <input 
              name="supervisor"
              value={project.supervisor}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Tư vấn thiết kế</label>
            <input 
              name="designer"
              value={project.designer}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Số hợp đồng</label>
            <input 
              name="contractNumber"
              value={project.contractNumber}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
  
          <div className="space-y-2">
            <label className="text-sm font-medium">Địa điểm xây dựng</label>
            <input 
              name="location"
              value={project.location}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
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
                spellCheck={false}
                autoComplete="off"
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
                spellCheck={false}
                autoComplete="off"
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
