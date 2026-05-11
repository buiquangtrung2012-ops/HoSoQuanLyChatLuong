import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, Tag, Save, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';
import { StorageService } from '../services/storageService';

const initialMaterials = [
  { name: "Cột đèn thép H=8m mạ kẽm", source: "Hapulico", lot: "LOT-CP-001", qty: "24 Cột" },
  { name: "Đèn LED 120W Philips", source: "Philips Việt Nam", lot: "PH-LED-88", qty: "24 Bộ" },
  { name: "Cáp ngầm 4x16mm2 Cadivi", source: "Cadivi", lot: "CDV-16-4", qty: "1000 m" },
  { name: "Tủ điện chiếu sáng ngoài trời", source: "Tụ điện Miền Nam", lot: "TD-2026", qty: "02 Tủ" },
];

export const MaterialModule: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    source: '',
    lot: '',
    qty: '',
  });

  useEffect(() => {
    const saved = StorageService.get('hoso_materials');
    if (saved) {
      setMaterials(saved);
    } else {
      setMaterials(initialMaterials);
      StorageService.save('hoso_materials', initialMaterials);
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setNewMaterial({ name: '', source: '', lot: '', qty: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setNewMaterial({ ...materials[index] });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    let updated;
    if (editingIndex !== null) {
      updated = [...materials];
      updated[editingIndex] = newMaterial;
    } else {
      updated = [newMaterial, ...materials];
    }
    setMaterials(updated);
    StorageService.save('hoso_materials', updated);
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    setItemToDelete(index);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      const updated = [...materials];
      updated.splice(itemToDelete, 1);
      setMaterials(updated);
      StorageService.save('hoso_materials', updated);
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý vật liệu</h1>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
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
                <th className="px-6 py-3">Tên vật liệu</th>
                <th className="px-6 py-3">Nguồn gốc/Nhà cung cấp</th>
                <th className="px-6 py-3">Lô/CO-CQ</th>
                <th className="px-6 py-3">Số lượng</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
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
                  <td className="px-6 py-4 font-medium text-primary">{item.qty}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => handleOpenEdit(i)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Sửa vật liệu"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                      <button 
                        onClick={() => handleDelete(i)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Xóa vật liệu"
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
        title={editingIndex !== null ? "Chỉnh sửa vật liệu" : "Nhập vật liệu mới"}
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
              <Save size={16} className="mr-2" /> {editingIndex !== null ? "Cập nhật" : "Lưu vật liệu"}
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
              spellCheck={false}
              autoComplete="off"
              className="w-full p-2 border rounded-md text-sm bg-background" 
              placeholder="Cáp điện Cu/XLPE/PVC..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Nguồn gốc/Nhà cung cấp</label>
            <input 
              value={newMaterial.source}
              onChange={e => setNewMaterial({...newMaterial, source: e.target.value})}
              spellCheck={false}
              autoComplete="off"
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
                spellCheck={false}
                autoComplete="off"
                className="w-full p-2 border rounded-md text-sm bg-background font-mono" 
                placeholder="LOT-2026-001"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Số lượng / Đơn vị</label>
              <input 
                value={newMaterial.qty}
                onChange={e => setNewMaterial({...newMaterial, qty: e.target.value})}
                spellCheck={false}
                autoComplete="off"
                className="w-full p-2 border rounded-md text-sm bg-background" 
                placeholder="1000 m"
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
              Xóa vật liệu
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <AlertCircle size={24} />
            <p className="text-sm font-medium">Bạn có chắc chắn muốn xóa vật liệu này? Thao tác này không thể hoàn tác.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

