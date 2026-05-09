import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, Save, Trash2 } from 'lucide-react';
import type { WorkItem } from '../types';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storageService';

const initialWorkItems: WorkItem[] = [
  { id: '1', line: 'Tuyến Lộ 1', category: 'Phần móng', name: 'Lắp dựng móng đúc sẵn M1', code: 'MC-001', unit: 'Cái', quantity: 24, startDate: '2026-05-01', inspectionDate: '2026-05-03' },
  { id: '2', line: 'Tuyến Lộ 1', category: 'Phần cột', name: 'Lắp dựng cột đèn bát giác H=8m', code: 'CD-001', unit: 'Cột', quantity: 24, startDate: '2026-05-04', inspectionDate: '2026-05-05' },
  { id: '3', line: 'Tuyến Lộ 2', category: 'Cáp điện', name: 'Rải cáp ngầm Cu/XLPE/PVC 4x16mm2', code: 'CN-002', unit: 'm', quantity: 850, startDate: '2026-05-05', inspectionDate: '2026-05-10' },
  { id: '4', line: 'Tuyến Lộ 1', category: 'Thiết bị', name: 'Lắp đặt đèn LED 120W và cần đèn', code: 'LD-001', unit: 'Bộ', quantity: 24, startDate: '2026-05-12', inspectionDate: '2026-05-15' },
];

export const WorkItemsModule: React.FC = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WorkItem>>({
    line: 'Tuyến Lộ 1',
    category: 'Phần móng',
    unit: 'Cái',
    quantity: 0,
    startDate: new Date().toISOString().split('T')[0],
    inspectionDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const saved = StorageService.getWorkItems();
    if (saved && saved.length > 0) {
      setWorkItems(saved);
    } else {
      setWorkItems(initialWorkItems);
      StorageService.saveWorkItems(initialWorkItems);
    }
  }, []);

  const handleAdd = () => {
    const item: WorkItem = {
      ...newItem as WorkItem,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updated = [item, ...workItems];
    setWorkItems(updated);
    StorageService.saveWorkItems(updated);
    setIsModalOpen(false);
    // Reset form
    setNewItem({
      line: 'Tuyến Lộ 1',
      category: 'Phần móng',
      unit: 'Cái',
      quantity: 0,
      startDate: new Date().toISOString().split('T')[0],
      inspectionDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      const updated = workItems.filter(item => item.id !== id);
      setWorkItems(updated);
      StorageService.saveWorkItems(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý công việc</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm công việc
        </button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-4 items-center justify-between bg-muted/30">
          <div className="flex gap-2 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                placeholder="Tìm công việc..." 
                className="w-full pl-9 pr-4 py-1.5 bg-background border rounded-md text-sm focus:outline-none"
              />
            </div>
            <button className="flex items-center px-3 py-1.5 border bg-background rounded-md text-sm hover:bg-accent">
              <Filter size={16} className="mr-2" /> Lọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Tên công việc</th>
                <th className="px-6 py-3">Khối lượng</th>
                <th className="px-6 py-3">Ngày nghiệm thu</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {workItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{item.code}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.line} - {item.category}</p>
                  </td>
                  <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4">{item.inspectionDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-primary hover:underline font-medium text-xs">Chi tiết</button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Xóa công việc"
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
        title="Thêm công việc mới"
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
              <Save size={16} className="mr-2" /> Lưu công việc
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Tuyến</label>
              <input 
                value={newItem.line}
                onChange={e => setNewItem({...newItem, line: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Hạng mục</label>
              <input 
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tên công việc</label>
            <input 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              placeholder="Ví dụ: Lắp dựng cột đèn..."
              className="w-full p-2 border rounded-md text-sm bg-background" 
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Mã CV</label>
              <input 
                value={newItem.code}
                onChange={e => setNewItem({...newItem, code: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background font-mono" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Đơn vị</label>
              <input 
                value={newItem.unit}
                onChange={e => setNewItem({...newItem, unit: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Khối lượng</label>
              <input 
                type="number"
                value={newItem.quantity}
                onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Ngày bắt đầu</label>
              <input 
                type="date"
                value={newItem.startDate}
                onChange={e => setNewItem({...newItem, startDate: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Ngày nghiệm thu</label>
              <input 
                type="date"
                value={newItem.inspectionDate}
                onChange={e => setNewItem({...newItem, inspectionDate: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
