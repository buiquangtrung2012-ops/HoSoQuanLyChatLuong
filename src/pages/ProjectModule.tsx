import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Plus, X, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react';
import type { Project } from '../types';
import { StorageService } from '../services/storageService';

const ProjectInput = ({ label, name, value, onChange, placeholder, colSpan = false, icon: Icon, type = "text" }: any) => (
  <div className={`bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-5 transition-all focus-within:shadow-md focus-within:border-blue-200 ${colSpan ? 'md:col-span-2' : ''}`}>
    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
    <div className="relative">
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        spellCheck={false}
        autoComplete="off"
        className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none placeholder-slate-300 text-[15px]"
        placeholder={placeholder}
      />
      {Icon && <Icon size={18} className="absolute right-0 top-0 text-slate-300 pointer-events-none" />}
    </div>
  </div>
);

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

  // Auto-save logic
  useEffect(() => {
    StorageService.saveProject(project);
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [project]);

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

  const handleRefresh = () => {
    const saved = StorageService.getProject();
    if (saved) setProject({ ...project, ...saved });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-800">Thông tin dự án</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center">
            {isSaving ? (
              <span className="flex items-center text-primary animate-pulse">
                <RefreshCw size={14} className="mr-1.5 animate-spin" /> Đang tự động lưu...
              </span>
            ) : (
              <span className="flex items-center text-green-600">
                <CheckCircle size={14} className="mr-1.5" /> Đã lưu tự động
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-white border text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm shadow-sm"
          >
            <RefreshCw size={18} className="mr-2 text-slate-400" /> Tải lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <ProjectInput
          label="Tên dự án"
          name="name"
          value={project.name}
          onChange={handleChange}
          placeholder="VD: Dự án đầu tư xây dựng hạ tầng kỹ thuật..."
          colSpan={true}
        />

        <ProjectInput
          label="Tên gói thầu"
          name="packageName"
          value={project.packageName}
          onChange={handleChange}
          placeholder="VD: Gói thầu số 08: Thi công hệ thống thoát nước..."
          colSpan={true}
        />

        <ProjectInput
          label="Chủ đầu tư"
          name="investor"
          value={project.investor}
          onChange={handleChange}
          placeholder="VD: Ban Quản lý dự án Đầu tư Xây dựng..."
        />

        {/* Contractor Group */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-5 md:col-span-2 transition-all focus-within:shadow-md focus-within:border-blue-200">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Đơn vị thi công</label>
          <input 
            name="contractor"
            value={project.contractor}
            onChange={handleChange}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none placeholder-slate-300 text-[15px] mb-4"
            placeholder="VD: Công ty Cổ phần Tập đoàn Xây dựng Minh Hòa"
          />

          {/* Liên danh toggle inside the same card */}
          <div className={`mt-2 rounded-xl border p-4 transition-all ${project.isJointVenture ? 'border-blue-100 bg-blue-50/50' : 'border-slate-100 bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">Chế độ Liên danh</p>
                <p className="text-xs text-slate-500 mt-0.5">Kích hoạt để thêm nhiều thành viên thi công</p>
              </div>
              <button
                onClick={handleToggleJointVenture}
                className="flex-shrink-0 ml-4 outline-none"
                title={project.isJointVenture ? 'Tắt Liên danh' : 'Bật Liên danh'}
              >
                {project.isJointVenture 
                  ? <ToggleRight size={36} className="text-blue-600 drop-shadow-sm" />
                  : <ToggleLeft size={36} className="text-slate-300" />
                }
              </button>
            </div>

            {project.isJointVenture && (
              <div className="mt-4 pt-4 border-t border-blue-100/60 space-y-3">
                <p className="text-[10px] font-bold text-blue-600/80 uppercase tracking-widest">
                  Danh sách thành viên
                </p>

                <div className="space-y-2">
                  {(project.contractorMembers || []).map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <input
                        value={member}
                        onChange={e => {
                          const updated = [...(project.contractorMembers || [])];
                          updated[idx] = e.target.value;
                          setProject(prev => ({ ...prev, contractorMembers: updated }));
                        }}
                        spellCheck={false}
                        autoComplete="off"
                        placeholder={`Tên thành viên liên danh ${idx + 1}...`}
                        className="flex-1 p-2.5 border-none bg-white shadow-sm rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-blue-200 outline-none placeholder-slate-300 transition-all"
                      />
                      <button
                        onClick={() => handleRemoveMember(idx)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Xóa thành viên"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    value={newMember}
                    onChange={e => setNewMember(e.target.value)}
                    onKeyDown={handleMemberKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    placeholder="Nhập tên thành viên mới..."
                    className="flex-1 p-2.5 border border-dashed border-blue-200 bg-white/50 rounded-lg text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none placeholder-slate-400 transition-all"
                  />
                  <button
                    onClick={handleAddMember}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
                  >
                    <Plus size={16} /> Thêm
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProjectInput
          label="Tư vấn giám sát"
          name="supervisor"
          value={project.supervisor}
          onChange={handleChange}
          placeholder="VD: Công ty Cổ phần Tư vấn Giám sát..."
        />

        <ProjectInput
          label="Tư vấn thiết kế"
          name="designer"
          value={project.designer}
          onChange={handleChange}
          placeholder="VD: Viện Thiết kế Kiến trúc..."
        />

        <ProjectInput
          label="Số hợp đồng"
          name="contractNumber"
          value={project.contractNumber}
          onChange={handleChange}
          placeholder="VD: 15/2026/HĐ-XD"
        />

        <ProjectInput
          label="Địa điểm xây dựng"
          name="location"
          value={project.location}
          onChange={handleChange}
          placeholder="VD: Phường ABC, Quận XYZ, TP. Hà Nội"
        />

        {/* Date Inputs wrapped with ProjectInput concept but customized for Date formatting */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-5 transition-all focus-within:shadow-md focus-within:border-blue-200">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ngày khởi công</label>
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
              className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none placeholder-slate-300 text-[15px]"
              placeholder="dd/mm/yyyy"
            />
            <Calendar size={18} className="absolute right-0 top-0 text-slate-300 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-5 transition-all focus-within:shadow-md focus-within:border-blue-200">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ngày hoàn thành (Dự kiến)</label>
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
              className="w-full bg-transparent text-slate-700 font-semibold focus:outline-none placeholder-slate-300 text-[15px]"
              placeholder="dd/mm/yyyy"
            />
            <Calendar size={18} className="absolute right-0 top-0 text-slate-300 pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
};

