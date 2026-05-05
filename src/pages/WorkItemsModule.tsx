import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { WorkItem, WorkStatus } from '../types';

const mockWorkItems: WorkItem[] = [
  { id: '1', line: 'Tuyến Lộ 1', category: 'Phần móng', name: 'Lắp dựng móng đúc sẵn M1', code: 'MC-001', unit: 'Cái', quantity: 24, startDate: '2026-05-01', inspectionDate: '2026-05-03', status: 'Hoàn thành' },
  { id: '2', line: 'Tuyến Lộ 1', category: 'Phần cột', name: 'Lắp dựng cột đèn bát giác H=8m', code: 'CD-001', unit: 'Cột', quantity: 24, startDate: '2026-05-04', inspectionDate: '2026-05-05', status: 'Chờ nghiệm thu' },
  { id: '3', line: 'Tuyến Lộ 2', category: 'Cáp điện', name: 'Rải cáp ngầm Cu/XLPE/PVC 4x16mm2', code: 'CN-002', unit: 'm', quantity: 850, startDate: '2026-05-05', inspectionDate: '2026-05-10', status: 'Đang thi công' },
  { id: '4', line: 'Tuyến Lộ 1', category: 'Thiết bị', name: 'Lắp đặt đèn LED 120W và cần đèn', code: 'LD-001', unit: 'Bộ', quantity: 24, startDate: '2026-05-12', inspectionDate: '2026-05-15', status: 'Chưa thi công' },
];

const StatusBadge = ({ status }: { status: WorkStatus }) => {
  const styles: Record<WorkStatus, string> = {
    'Chưa thi công': 'bg-muted text-muted-foreground',
    'Đang thi công': 'bg-blue-500/10 text-blue-500',
    'Chờ nghiệm thu': 'bg-amber-500/10 text-amber-500',
    'Hoàn thành': 'bg-green-500/10 text-green-500',
  };
  
  const icons: Record<WorkStatus, any> = {
    'Chưa thi công': Clock,
    'Đang thi công': Clock,
    'Chờ nghiệm thu': AlertCircle,
    'Hoàn thành': CheckCircle2,
  };
  
  const Icon = icons[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon size={12} className="mr-1" /> {status}
    </span>
  );
};

export const WorkItemsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý công việc</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
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
          
          <div className="flex space-x-2">
            <select className="bg-background border rounded-md px-2 py-1.5 text-sm focus:outline-none">
              <option>Tất cả hạng mục</option>
              <option>Phần móng</option>
              <option>Phần thân</option>
            </select>
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
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockWorkItems.map((item) => (
                <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{item.code}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.line} - {item.category}</p>
                  </td>
                  <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                  <td className="px-6 py-4">{item.inspectionDate}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline font-medium">Chi tiết</button>
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
