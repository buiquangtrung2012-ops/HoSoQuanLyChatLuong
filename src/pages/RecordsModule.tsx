import React, { useState, useEffect } from 'react';
import { Users, Save, CheckCircle } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const RecordsModule: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const [participants, setParticipants] = useState({
    cdt1_name: '', cdt1_pos: '',
    cdt2_name: '', cdt2_pos: '',
    tc1_name: '', tc1_pos: '',
    tc2_name: '', tc2_pos: '',
    tc3_name: '', tc3_pos: '',
    tv1_name: '', tv1_pos: '',
    tv2_name: '', tv2_pos: '',
  });

  useEffect(() => {
    setPersonnel(StorageService.get('hoso_personnel') || []);
    const savedParticipants = StorageService.get('hoso_participants');
    if (savedParticipants) {
      setParticipants(savedParticipants);
    }
  }, []);

  const handleParticipantSelect = (prefix: string, index: number, personId: string) => {
    const person = personnel.find(p => p.id === personId);
    if (person) {
      setParticipants(prev => ({
        ...prev,
        [`${prefix}${index}_name`]: person.name,
        [`${prefix}${index}_pos`]: person.position,
      }));
    } else {
      setParticipants(prev => ({
        ...prev,
        [`${prefix}${index}_name`]: '',
        [`${prefix}${index}_pos`]: '',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParticipants(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    StorageService.save('hoso_participants', participants);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Ký hồ sơ</h1>
        <button 
          onClick={handleSave}
          className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold text-sm"
        >
          {isSaved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
          {isSaved ? "Đã lưu" : "Lưu cấu hình"}
        </button>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold text-primary flex items-center">
            <Users size={24} className="mr-2" /> Thành phần tham gia nghiệm thu
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Chọn hoặc nhập trực tiếp thông tin các thành phần tham gia ký biên bản. Dữ liệu này sẽ được dùng chung khi Xuất file Word.</p>
        </div>

        <div className="space-y-6">
          {/* CĐT */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-700 uppercase">1. Đại diện chủ đầu tư</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(num => (
                <div key={`cdt${num}`} className="space-y-2 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <label className="text-xs font-bold text-muted-foreground">Người thứ {num}</label>
                  <select 
                    className="w-full p-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:ring-1 focus:ring-primary outline-none"
                    onChange={(e) => handleParticipantSelect('cdt', num, e.target.value)}
                  >
                    <option value="">-- Chọn từ danh sách Nhân sự --</option>
                    {personnel.filter(p => p.role?.includes('đầu tư') || p.role?.includes('CĐT')).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <input name={`cdt${num}_name`} value={participants[`cdt${num}_name` as keyof typeof participants]} onChange={handleInputChange} placeholder="Họ tên" className="w-1/2 p-2 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none" />
                    <input name={`cdt${num}_pos`} value={participants[`cdt${num}_pos` as keyof typeof participants]} onChange={handleInputChange} placeholder="Chức vụ" className="w-1/2 p-2 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thi công */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-4">
            <h4 className="text-sm font-bold text-blue-800 uppercase">2. Đại diện đơn vị thi công</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(num => (
                <div key={`tc${num}`} className="space-y-2 p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                  <label className="text-xs font-bold text-blue-600/70">Người thứ {num}</label>
                  <select 
                    className="w-full p-2 border border-blue-200 rounded-md text-sm bg-blue-50 focus:ring-1 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleParticipantSelect('tc', num, e.target.value)}
                  >
                    <option value="">-- Chọn từ danh sách --</option>
                    {personnel.filter(p => p.role?.includes('Chỉ huy') || p.role?.includes('Kỹ thuật') || p.role?.includes('thi công')).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <input name={`tc${num}_name`} value={participants[`tc${num}_name` as keyof typeof participants]} onChange={handleInputChange} placeholder="Họ tên" className="w-1/2 p-2 border border-blue-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                    <input name={`tc${num}_pos`} value={participants[`tc${num}_pos` as keyof typeof participants]} onChange={handleInputChange} placeholder="Chức vụ" className="w-1/2 p-2 border border-blue-200 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tư vấn */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-4">
            <h4 className="text-sm font-bold text-emerald-800 uppercase">3. Đại diện đơn vị tư vấn giám sát</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(num => (
                <div key={`tv${num}`} className="space-y-2 p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
                  <label className="text-xs font-bold text-emerald-600/70">Người thứ {num}</label>
                  <select 
                    className="w-full p-2 border border-emerald-200 rounded-md text-sm bg-emerald-50 focus:ring-1 focus:ring-emerald-500 outline-none"
                    onChange={(e) => handleParticipantSelect('tv', num, e.target.value)}
                  >
                    <option value="">-- Chọn từ danh sách --</option>
                    {personnel.filter(p => p.role?.includes('giám sát') || p.role?.includes('Tư vấn')).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <input name={`tv${num}_name`} value={participants[`tv${num}_name` as keyof typeof participants]} onChange={handleInputChange} placeholder="Họ tên" className="w-1/2 p-2 border border-emerald-200 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                    <input name={`tv${num}_pos`} value={participants[`tv${num}_pos` as keyof typeof participants]} onChange={handleInputChange} placeholder="Chức vụ" className="w-1/2 p-2 border border-emerald-200 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
