import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, UserPlus } from 'lucide-react';
import type { Personnel, PersonnelRole } from '../types';

const mockPersonnel: Personnel[] = [
  { id: '1', name: 'Nguyễn Văn A', position: 'Chỉ huy trưởng', unit: 'Coteccons', role: 'Chỉ huy trưởng' },
  { id: '2', name: 'Trần Văn B', position: 'Giám sát trưởng', unit: 'CONINCO', role: 'Giám sát trưởng' },
  { id: '3', name: 'Lê Văn C', position: 'Giám sát viên', unit: 'CONINCO', role: 'Tư vấn giám sát' },
  { id: '4', name: 'Phạm Văn D', position: 'Đại diện CĐT', unit: 'Sun Group', role: 'Chủ đầu tư' },
];

export const PersonnelModule: React.FC = () => {
  const [personnelList, setPersonnelList] = useState<Personnel[]>(mockPersonnel);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý nhân sự</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
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
          <div className="flex space-x-2">
            <select className="bg-background border rounded-md px-2 py-1.5 text-sm focus:outline-none">
              <option>Tất cả vai trò</option>
              <option>Chỉ huy trưởng</option>
              <option>Giám sát trưởng</option>
            </select>
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
    </div>
  );
};
