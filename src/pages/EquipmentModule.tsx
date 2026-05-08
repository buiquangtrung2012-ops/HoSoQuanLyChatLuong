import React, { useState } from 'react';
import { Truck, Search, Plus, Calendar, ShieldCheck, Save } from 'lucide-react';
import { Modal } from '../components/Modal';

const initialEquipment = [
  { name: "Cần trục tháp POTAIN", serial: "PT-2024-X", lastCheck: "01/01/2026", expiry: "01/01/2027" },
  { name: "Máy bơm bê tông PUTZMEISTER", serial: "PZ-888", lastCheck: "15/02/2026", expiry: "15/02/2027" },
  { name: "Máy toàn đạc LEICA TS06", serial: "L-99021", lastCheck: "10/03/2026", expiry: "10/03/2027" },
];

export const EquipmentModule: React.FC = () => {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEquip, setNewEquip] = useState({
    name: '',
    serial: '',
    lastCheck: '',
    expiry: '',
  });

  const handleAdd = () => {
    setEquipment([newEquip, ...equipment]);
    setIsModalOpen(false);
    setNewEquip({ name: '', serial: '', lastCheck: '', expiry: '' });
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
              </tr>
            </thead>
            <tbody className="divide-y">
              {equipment.map((item, i) => (
                <tr key={i} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.serial}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.lastCheck}</td>
                  <td className="px-6 py-4 font-medium text-primary">{item.expiry}</td>
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
    </div>
  );
};
