import React, { useState } from 'react';
import { FlaskConical, Search, Plus, FileText, UserCheck, Save } from 'lucide-react';
import { Modal } from '../components/Modal';

const initialLabs = [
  { name: "Phòng thí nghiệm LAS-XD 123", code: "LAS-XD 123", expiry: "30/12/2027", staff: "5 kỹ thuật viên", equipment: "Đầy đủ thiết bị nén tĩnh, kéo thép" },
  { name: "Trung tâm Kiểm định Xây dựng Miền Nam", code: "LAS-XD 456", expiry: "15/06/2028", staff: "12 chuyên gia", equipment: "Phòng Lab hóa học, cơ lý" },
];

export const LabModule: React.FC = () => {
  const [labs, setLabs] = useState(initialLabs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLab, setNewLab] = useState({
    name: '',
    code: '',
    expiry: '',
    staff: '',
    equipment: '',
  });

  const handleAdd = () => {
    setLabs([newLab, ...labs]);
    setIsModalOpen(false);
    setNewLab({ name: '', code: '', expiry: '', staff: '', equipment: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Phòng thí nghiệm (LAS-XD)</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm PTN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {labs.map((lab, i) => (
          <div key={i} className="bg-card rounded-xl border p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <FlaskConical size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{lab.name}</h3>
                  <p className="text-sm text-primary font-mono">{lab.code}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText size={14} className="mr-2" /> Hiệu lực chứng chỉ: {lab.expiry}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UserCheck size={14} className="mr-2" /> Nhân sự: {lab.staff}
              </div>
            </div>

            <div className="pt-4 border-t flex space-x-2">
              <button className="flex-1 py-2 text-xs font-medium border rounded-lg hover:bg-accent">Chi tiết thiết bị</button>
              <button className="flex-1 py-2 text-xs font-medium border rounded-lg hover:bg-accent">Hồ sơ năng lực</button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Thêm phòng thí nghiệm"
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
            >
              Hủy
            </button>
            <button 
              onClick={handleAdd}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
            >
              <Save size={16} className="mr-2" /> Lưu PTN
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tên phòng thí nghiệm</label>
            <input 
              value={newLab.name}
              onChange={e => setNewLab({...newLab, name: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Trung tâm kiểm định..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Mã số (LAS-XD)</label>
              <input 
                value={newLab.code}
                onChange={e => setNewLab({...newLab, code: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background font-mono" 
                placeholder="LAS-XD 123"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Hạn chứng chỉ</label>
              <input 
                type="date"
                value={newLab.expiry}
                onChange={e => setNewLab({...newLab, expiry: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Nhân sự chủ chốt</label>
            <input 
              value={newLab.staff}
              onChange={e => setNewLab({...newLab, staff: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Ví dụ: 10 kỹ thuật viên"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Thiết bị chính</label>
            <textarea 
              value={newLab.equipment}
              onChange={e => setNewLab({...newLab, equipment: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background min-h-[80px]" 
              placeholder="Máy nén, máy kéo, thiết bị thí nghiệm..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
