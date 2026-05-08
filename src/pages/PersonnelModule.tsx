import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, UserPlus, Save } from 'lucide-react';
import type { Personnel, PersonnelRole } from '../types';
import { Modal } from '../components/Modal';

const initialPersonnel: Personnel[] = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Chỉ huy trưởng', unit: 'Coteccons', role: 'Chỉ huy trưởng' },
  { id: '2', name: 'Trần Văn B', position: 'Giám sát trưởng', unit: 'CONINCO', role: 'Giám sát trưởng' },
  { id: '3', name: 'Lê Văn C', position: 'Giám sát viên', unit: 'CONINCO', role: 'Tư vấn giám sát' },
  { id: '4', name: 'Phạm Văn D', position: 'Đại diện CĐT', unit: 'Sun Group', role: 'Chủ đầu tư' },
];

export const PersonnelModule: React.FC = () => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>(initialPersonnel);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState<Partial<Personnel>>({
    name: '',
    position: '',
    unit: '',
    role: 'Tư vấn giám sát',
  });

  const handleAdd = () => {
    const person: Personnel = {
      ...newPerson as Personnel,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPersonnelList([person, ...personnelList]);
    setIsModalOpen(false);
    setNewPerson({ name: '', position: '', unit: '', role: 'Tư vấn giám sát' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân sự</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
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
              className="w-full pl-9 pr-4 py-1.5 bg-background border rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Họ và tên</th>
                <th className="px-6 py-3">Chức vụ</th>
                <th className="px-6 py-3">Đơn vị</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {personnelList.map((person) => (
                <tr key={person.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{person.name}</td>
                  <td className="px-6 py-4">{person.position}</td>
                  <td className="px-6 py-4 text-muted-foreground">{person.unit}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {person.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-muted rounded-md">
                      <MoreHorizontal size={18} />
                    </button>
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
        title="Thêm nhân sự mới"
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
              <Save size={16} className="mr-2" /> Lưu nhân sự
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Họ và tên</label>
            <input 
              value={newPerson.name}
              onChange={e => setNewPerson({...newPerson, name: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Chức vụ</label>
            <input 
              value={newPerson.position}
              onChange={e => setNewPerson({...newPerson, position: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Kỹ sư hiện trường"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Đơn vị công tác</label>
            <input 
              value={newPerson.unit}
              onChange={e => setNewPerson({...newPerson, unit: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Công ty CP Xây dựng..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Vai trò ký hồ sơ</label>
            <select 
              value={newPerson.role}
              onChange={e => setNewPerson({...newPerson, role: e.target.value as PersonnelRole})}
              className="w-full p-2 border rounded-md text-sm bg-background outline-none"
            >
              <option value="Chỉ huy trưởng">Chỉ huy trưởng</option>
              <option value="Giám sát trưởng">Giám sát trưởng</option>
              <option value="Tư vấn giám sát">Tư vấn giám sát</option>
              <option value="Chủ đầu tư">Chủ đầu tư</option>
              <option value="Tư vấn thiết kế">Tư vấn thiết kế</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
