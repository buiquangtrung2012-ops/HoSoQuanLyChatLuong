import React, { useState, useEffect } from 'react';
import { FlaskConical, Search, Plus, FileText, UserCheck, Save, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storageService';

const initialLabs = [
  { name: "Phòng thí nghiệm LAS-XD 123", code: "LAS-XD 123", expiry: "30/12/2027", equipment: "Đầy đủ thiết bị nén tĩnh, kéo thép" },
  { name: "Trung tâm Kiểm định Xây dựng Miền Nam", code: "LAS-XD 456", expiry: "15/06/2028", equipment: "Phòng Lab hóa học, cơ lý" },
];

export const LabModule: React.FC = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [newLab, setNewLab] = useState({
    name: '',
    code: '',
    expiry: '',
    equipment: '',
  });

  useEffect(() => {
    const saved = StorageService.get('hoso_labs');
    if (saved && saved.length > 0) {
      setLabs(saved);
    } else {
      setLabs(initialLabs);
      StorageService.save('hoso_labs', initialLabs);
    }
  }, []);

  const handleAdd = () => {
    const updated = [newLab, ...labs];
    setLabs(updated);
    StorageService.save('hoso_labs', updated);
    setIsModalOpen(false);
    setNewLab({ name: '', code: '', expiry: '', equipment: '' });
  };

  const handleDelete = (index: number) => {
    setItemToDelete(index);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      const updated = [...labs];
      updated.splice(itemToDelete, 1);
      setLabs(updated);
      StorageService.save('hoso_labs', updated);
      setItemToDelete(null);
    }
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
          <div key={i} className="bg-card rounded-xl border p-6 space-y-4 hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => handleDelete(i)}
              className="absolute top-4 right-4 p-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 rounded-md"
              title="Xóa PTN"
            >
              <Trash2 size={18} />
            </button>
            
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

      <Modal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        title="Xác nhận xóa"
        footer={
          <>
            <button 
              onClick={() => setItemToDelete(null)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
            >
              Hủy
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-sm font-medium"
            >
              Xóa PTN
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle size={24} />
            <p className="text-sm font-medium">Bạn có chắc chắn muốn xóa phòng thí nghiệm này? Thao tác này không thể hoàn tác.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
