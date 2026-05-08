import React from 'react';
import { FlaskConical, Search, Plus, FileText, UserCheck } from 'lucide-react';

export const LabModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Phòng thí nghiệm (LAS-XD)</h1>
        <button 
          onClick={() => alert('Tính năng "Thêm PTN" đang được phát triển')}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" /> Thêm PTN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "Phòng thí nghiệm LAS-XD 123", code: "LAS-XD 123", expiry: "30/12/2027", staff: "5 kỹ thuật viên", equipment: "Đầy đủ thiết bị nén tĩnh, kéo thép" },
          { name: "Trung tâm Kiểm định Xây dựng Miền Nam", code: "LAS-XD 456", expiry: "15/06/2028", staff: "12 chuyên gia", equipment: "Phòng Lab hóa học, cơ lý" },
        ].map((lab, i) => (
          <div key={i} className="bg-card rounded-xl border p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <FlaskConical size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{lab.name}</h3>
                  <p className="text-sm text-primary font-mono">{lab.code}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText size={14} className="mr-2" /> Hiệu lực chứng chỉ: {lab.expiry}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UserCheck size={14} className="mr-2" /> Nhân sự: {lab.staff}
              </div>
            </div>

            <div className="pt-4 border-t flex space-x-2">
              <button className="flex-1 py-2 text-xs font-medium border rounded-lg hover:bg-accent">Chi tiết thiết bị</button>
              <button className="flex-1 py-2 text-xs font-medium border rounded-lg hover:bg-accent">Hồ sơ năng lực</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
