import React, { useState } from 'react';
import { Package, Search, Plus, Filter, Tag, Save } from 'lucide-react';
import { Modal } from '../components/Modal';

const initialMaterials = [
  { name: "Cột đèn thép H=8m mạ kẽm", source: "Hapulico", lot: "LOT-CP-001", qty: "24 Cột" },
  { name: "Đèn LED 120W Philips", source: "Philips Việt Nam", lot: "PH-LED-88", qty: "24 Bộ" },
  { name: "Cáp ngầm 4x16mm2 Cadivi", source: "Cadivi", lot: "CDV-16-4", qty: "1000 m" },
  { name: "Tủ điện chiếu sáng ngoài trời", source: "Tụ điện Miền Nam", lot: "TD-2026", qty: "02 Tủ" },
];

export const MaterialModule: React.FC = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    source: '',
    lot: '',
    qty: '',
  });

  const handleAdd = () => {
    setMaterials([newMaterial, ...materials]);
    setIsModalOpen(false);
    setNewMaterial({ name: '', source: '', lot: '', qty: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý vật liệu</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Nhập vật liệu
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
              placeholder="Tìm vật liệu..." 
              className="w-full pl-9 pr-4 py-1.5 bg-background border rounded-md text-sm focus:outline-none"
            />
          </div>
          <button className="flex items-center px-3 py-1.5 border bg-background rounded-md text-sm hover:bg-accent">
            <Filter size={16} className="mr-2" /> Lọc
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Tên vật liệu</th>
                <th className="px-6 py-3">Nguồn gốc/Nhà cung cấp</th>
                <th className="px-6 py-3">Lô/CO-CQ</th>
                <th className="px-6 py-3">Số lượng</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {materials.map((item, i) => (
                <tr key={i} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-xs">
                    <p>{item.source}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{item.lot}</td>
                  <td className="px-6 py-4">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nhập vật liệu mới"
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
              <Save size={16} className="mr-2" /> Lưu vật liệu
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Tên vật liệu</label>
            <input 
              value={newMaterial.name}
              onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Cáp điện Cu/XLPE/PVC..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Nguồn gốc/Nhà cung cấp</label>
            <input 
              value={newMaterial.source}
              onChange={e => setNewMaterial({...newMaterial, source: e.target.value})}
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Công ty Cadivi"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Số lô / CO-CQ</label>
              <input 
                value={newMaterial.lot}
                onChange={e => setNewMaterial({...newMaterial, lot: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background font-mono" 
                placeholder="LOT-2026-001"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Số lượng / Đơn vị</label>
              <input 
                value={newMaterial.qty}
                onChange={e => setNewMaterial({...newMaterial, qty: e.target.value})}
                className="w-full p-2 border rounded-md text-sm bg-background" 
                placeholder="1000 m"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
