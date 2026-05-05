import React from 'react';
import { Package, Search, Plus, Filter, Tag } from 'lucide-react';

export const MaterialModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý vật liệu</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
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
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: "Cột đèn thép H=8m mạ kẽm", source: "Hapulico", lot: "LOT-CP-001", qty: "24 Cột", status: "Đạt" },
                { name: "Đèn LED 120W Philips", source: "Philips Việt Nam", lot: "PH-LED-88", qty: "24 Bộ", status: "Đang kiểm tra" },
                { name: "Cáp ngầm 4x16mm2 Cadivi", source: "Cadivi", lot: "CDV-16-4", qty: "1000 m", status: "Đạt" },
                { name: "Tủ điện chiếu sáng ngoài trời", source: "Tụ điện Miền Nam", lot: "TD-2026", qty: "02 Tủ", status: "Đạt" },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-xs">
                    <p>{item.source}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{item.lot}</td>
                  <td className="px-6 py-4">{item.qty}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'Đạt' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {item.status}
                    </span>
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
