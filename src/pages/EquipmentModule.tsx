import React from 'react';
import { Truck, Search, Plus, Calendar, ShieldCheck } from 'lucide-react';

export const EquipmentModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý máy móc thiết bị</h1>
        <button 
          onClick={() => alert('Tính năng "Thêm máy móc" đang được phát triển')}
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
              {[
                { name: "Cần trục tháp POTAIN", serial: "PT-2024-X", lastCheck: "01/01/2026", expiry: "01/01/2027" },
                { name: "Máy bơm bê tông PUTZMEISTER", serial: "PZ-888", lastCheck: "15/02/2026", expiry: "15/02/2027" },
                { name: "Máy toàn đạc LEICA TS06", serial: "L-99021", lastCheck: "10/03/2026", expiry: "10/03/2027" },
              ].map((item, i) => (
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
    </div>
  );
};
