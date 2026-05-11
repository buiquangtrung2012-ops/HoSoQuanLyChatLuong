import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, UserPlus, Save, Trash2, AlertCircle, Edit2 } from 'lucide-react';
import type { Personnel, PersonnelRole } from '../types';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storageService';

const initialPersonnel: Personnel[] = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Chỉ huy trưởng', unit: 'Coteccons', role: 'Chỉ huy trưởng' },
  { id: '2', name: 'Trần Văn B', position: 'Giám sát trưởng', unit: 'CONINCO', role: 'Giám sát trưởng' },
  { id: '3', name: 'Lê Văn C', position: 'Giám sát viên', unit: 'CONINCO', role: 'Tư vấn giám sát' },
  { id: '4', name: 'Phạm Văn D', position: 'Đại diện CĐT', unit: 'Sun Group', role: 'Chủ đầu tư' },
];

export const PersonnelModule: React.FC = () => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
    name: '',
    position: '',
    unit: '',
    role: 'Tư vấn giám sát',
  });

  useEffect(() => {
    const saved = StorageService.get('hoso_personnel');
    if (saved) {
      setPersonnelList(saved);
    } else {
      setPersonnelList(initialPersonnel);
      StorageService.save('hoso_personnel', initialPersonnel);
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setNewPerson({ name: '', position: '', unit: '', role: 'Tư vấn giám sát' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: Personnel) => {
    setEditingId(person.id);
    setNewPerson({ ...person });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      const updated = personnelList.map(p => 
        p.id === editingId ? { ...p, ...newPerson } as Personnel : p
      );
      setPersonnelList(updated);
      StorageService.save('hoso_personnel', updated);
    } else {
      const person: Personnel = {
        ...newPerson as Personnel,
        id: Math.random().toString(36).substr(2, 9),
      };
      const updated = [person, ...personnelList];
      setPersonnelList(updated);
      StorageService.save('hoso_personnel', updated);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setNewPerson({ name: '', position: '', unit: '', role: 'Tư vấn giám sát' });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const updated = personnelList.filter(p => p.id !== itemToDelete);
      setPersonnelList(updated);
      StorageService.save('hoso_personnel', updated);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân sự</h1>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          <UserPlus size={18} className="mr-2" /> Thêm nhân sự
        </button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-muted/30">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm nhân sự..." 
              spellCheck={false}
              autoComplete="off"
              className="w-full pl-9 pr-4 py-1.5 bg-background border rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Họ và tên</th>
                <th className="px-6 py-3">Chức vụ / Vai trò</th>
                <th className="px-6 py-3">Đơn vị</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {personnelList.map((person) => (
                <tr key={person.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{person.name}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary">{person.position}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{person.role}</p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{person.unit}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => handleOpenEdit(person)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Sửa nhân sự"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(person.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Xóa nhân sự"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Chỉnh sửa nhân sự" : "Thêm nhân sự mới"}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
            >
              Hủy
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium"
            >
              <Save size={16} className="mr-2" /> {editingId ? "Cập nhật" : "Lưu nhân sự"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Họ và tên</label>
            <input 
              value={newPerson.name}
              onChange={e => setNewPerson({...newPerson, name: e.target.value})}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chức vụ / Vai trò ký hồ sơ</label>
            <input 
              value={newPerson.position}
              onChange={e => {
                const val = e.target.value;
                setNewPerson({
                  ...newPerson, 
                  position: val,
                  // Tự động gán role bằng position theo yêu cầu người dùng
                  role: val as any 
                });
              }}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
              placeholder="Chỉ huy trưởng / Giám sát viên..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đơn vị công tác</label>
            <input 
              value={newPerson.unit}
              onChange={e => setNewPerson({...newPerson, unit: e.target.value})}
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2.5 border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/50 outline-none" 
              placeholder="Công ty CP Xây dựng..."
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!itemToDelete}
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
              Xóa nhân sự
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle size={24} />
            <p className="text-sm font-medium">Bạn có chắc chắn muốn xóa nhân sự này? Thao tác này không thể hoàn tác.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

