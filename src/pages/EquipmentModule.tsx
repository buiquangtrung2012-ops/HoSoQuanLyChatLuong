import React, { useState, useEffect } from 'react';
import { Truck, Search, Plus, Calendar, ShieldCheck, Save, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storageService';

const initialEquipment = [
  { name: "Cần trục tháp POTAIN", serial: "PT-2024-X", lastCheck: "01/01/2026", expiry: "01/01/2027" },
  { name: "Máy bơm bê tông PUTZMEISTER", serial: "PZ-888", lastCheck: "15/02/2026", expiry: "15/02/2027" },
  { name: "Máy toàn đạc LEICA TS06", serial: "L-99021", lastCheck: "10/03/2026", expiry: "10/03/2027" },
];

export const EquipmentModule: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [newEquip, setNewEquip] = useState({
    name: '',
    serial: '',
    lastCheck: '',
    expiry: '',
  });

  useEffect(() => {
    const saved = StorageService.get('hoso_equipment');
    if (saved && saved.length > 0) {
      setEquipment(saved);
    } else {
      setEquipment(initialEquipment);
      StorageService.save('hoso_equipment', initialEquipment);
    }
  }, []);

  const handleAdd = () => {
    const updated = [newEquip, ...equipment];
    setEquipment(updated);
    StorageService.save('hoso_equipment', updated);
    setIsModalOpen(false);
    setNewEquip({ name: '', serial: '', lastCheck: '', expiry: '' });
  };

  const handleDelete = (index: number) => {
    setItemToDelete(index);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      const updated = [...equipment];
      updated.splice(itemToDelete, 1);
      setEquipment(updated);
      StorageService.save('hoso_equipment', updated);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý máy móc thiết bị</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm máy móc
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
              placeholder="Tìm thiết bị..." 
              className="w-full pl-9 pr-4 py-1.5 bg-background border rounded-md text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Tên thiết bị</th>
                <th className="px-6 py-3">Số Serial / Biển số</th>
                <th className="px-6 py-3">Ngày kiểm định</th>
                <th className="px-6 py-3">Hiệu lực đến</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {equipment.map((item, i) => (
                <tr key={i} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.serial}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.lastCheck}</td>
                  <td className="px-6 py-4 font-medium text-primary">{item.expiry}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(i)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      title="Xóa thiết bị"
                    >
                      <Trash2 size={16} />
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
        title="Thêm thiết bị mới"
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
              <Save size={16} className="mr-2" /> Lưu thiết bị
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tên thiết bị</label>
            <input 
              value={newEquip.name}
              onChange={e => setNewEquip({...newEquip, name: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Xe cẩu tự hành 5 tấn"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Số Serial / Biển số</label>
            <input 
              value={newEquip.serial}
              onChange={e => setNewEquip({...newEquip, serial: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background font-mono" 
              placeholder="29C-123.45"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Ngày kiểm định</label>
              <input 
                type="date"
                value={newEquip.lastCheck}
                onChange={e => setNewEquip({...newEquip, lastCheck: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Ngày hết hạn</label>
              <input 
                type="date"
                value={newEquip.expiry}
                onChange={e => setNewEquip({...newEquip, expiry: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
              />
            </div>
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
              Xóa thiết bị
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle size={24} />
            <p className="text-sm font-medium">Bạn có chắc chắn muốn xóa thiết bị này? Thao tác này không thể hoàn tác.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
