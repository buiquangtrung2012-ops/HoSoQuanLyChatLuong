import React, { useState, useEffect } from 'react';
import {
  Layers, FileCheck, Briefcase, Calendar, BookOpen, MapPin,
  User, Building2, Package, Truck, FlaskConical, ClipboardList,
  Users, ChevronDown, ChevronUp
} from 'lucide-react';
import { StorageService } from '../services/storageService';

const Section = ({ icon: Icon, title, color, children, defaultOpen = true }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o: boolean) => !o)}
        className={`w-full flex items-center justify-between px-5 py-3 border-b bg-muted/30 hover:bg-muted/50 transition-colors`}
      >
        <span className={`flex items-center font-bold text-sm gap-2 ${color}`}>
          <Icon size={16} /> {title}
        </span>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <div className="flex items-start justify-between py-1.5 border-b last:border-0 gap-2">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{label}</span>
      <span className="text-xs text-right font-medium">{value}</span>
    </div>
  ) : null
);

export const Dashboard: React.FC = () => {
  const [project, setProject] = useState<any>(null);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [workItems, setWorkItems] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<any[]>([]);

  useEffect(() => {
    setProject(StorageService.getProject());
    setPersonnel(StorageService.get('hoso_personnel') || []);
    setWorkItems(StorageService.getWorkItems() || []);
    setMaterials(StorageService.get('hoso_materials') || []);
    setEquipment(StorageService.get('hoso_equipment') || []);
    setLabs(StorageService.get('hoso_labs') || []);
    const diary = StorageService.getDiary() || [];
    setDiaryEntries(diary.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 text-primary/80 font-medium italic">Tổng hợp toàn bộ dữ liệu dự án từ các module.</p>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full border">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Công việc', val: workItems.length, color: 'text-blue-500 bg-blue-50 border-blue-100' },
          { label: 'Nhân sự', val: personnel.length, color: 'text-violet-500 bg-violet-50 border-violet-100' },
          { label: 'Vật liệu', val: materials.length, color: 'text-green-500 bg-green-50 border-green-100' },
          { label: 'Máy móc', val: equipment.length, color: 'text-orange-500 bg-orange-50 border-orange-100' },
          { label: 'PTN', val: labs.length, color: 'text-pink-500 bg-pink-50 border-pink-100' },
          { label: 'Nhật ký', val: diaryEntries.length, color: 'text-purple-500 bg-purple-50 border-purple-100' },
          { label: 'Hồ sơ mẫu', val: StorageService.getRecordTypes().length, color: 'text-teal-500 bg-teal-50 border-teal-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.val}</div>
            <div className="text-[10px] font-bold uppercase mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dự án */}
      <Section icon={Briefcase} title="Dự án" color="text-primary" defaultOpen={true}>
        {project ? (
          <div className="space-y-0">
            <Row label="Tên dự án" value={project.name} />
            <Row label="Địa điểm" value={project.location} />
            <Row label="Chủ đầu tư" value={project.investor} />
            <Row label="Nhà thầu" value={project.contractor} />
            <Row label="Số HĐ" value={project.contractNumber} />
            <Row label="Tên gói thầu" value={project.packageName} />
            <Row label="Khởi công" value={project.startDate?.split('-').reverse().join('/')} />
            <Row label="Hoàn thành" value={project.endDate?.split('-').reverse().join('/')} />
          </div>
        ) : <p className="text-xs text-muted-foreground italic">Chưa có thông tin dự án. Hãy điền ở Tab Dự án.</p>}
      </Section>

      {/* Nhân sự */}
      <Section icon={Users} title={`Nhân sự (${personnel.length})`} color="text-violet-600" defaultOpen={false}>
        {personnel.length > 0 ? (
          <div className="space-y-2">
            {personnel.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-bold">{p.name}</span>
                  <span className="text-muted-foreground ml-2">— {p.position}</span>
                </div>
                <span className="text-[10px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">{p.role || p.unit}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground italic">Chưa có nhân sự. Hãy thêm ở Tab Nhân sự.</p>}
      </Section>

      {/* Công việc */}
      <Section icon={Layers} title={`Công việc nghiệm thu (${workItems.length})`} color="text-blue-600" defaultOpen={true}>
        {workItems.length > 0 ? (
          <div className="space-y-2">
            {workItems.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30 hover:border-primary transition-colors">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{item.category} • {item.line}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{item.quantity} {item.unit}</p>
                  <p className="text-[10px] text-muted-foreground">NT: {item.inspectionDate?.split('-').reverse().join('/')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground italic">Chưa có công việc. Hãy thêm ở Tab Công việc.</p>}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vật liệu */}
        <Section icon={Package} title={`Vật liệu (${materials.length})`} color="text-green-600" defaultOpen={false}>
          {materials.length > 0 ? (
            <div className="space-y-1">
              {materials.map((m: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b last:border-0">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground text-[11px]">{m.source || m.lot}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Chưa có vật liệu.</p>}
        </Section>

        {/* Máy móc */}
        <Section icon={Truck} title={`Máy móc (${equipment.length})`} color="text-orange-600" defaultOpen={false}>
          {equipment.length > 0 ? (
            <div className="space-y-1">
              {equipment.map((e: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b last:border-0">
                  <span className="font-medium">{e.name}</span>
                  <span className="text-muted-foreground text-[11px]">{e.serial}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Chưa có máy móc.</p>}
        </Section>

        {/* PTN */}
        <Section icon={FlaskConical} title={`Phòng thí nghiệm (${labs.length})`} color="text-pink-600" defaultOpen={false}>
          {labs.length > 0 ? (
            <div className="space-y-1">
              {labs.map((l: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b last:border-0">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground text-[11px]">{l.code}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Chưa có PTN.</p>}
        </Section>

        {/* Nhật ký */}
        <Section icon={BookOpen} title={`Nhật ký thi công (${diaryEntries.length})`} color="text-purple-600" defaultOpen={false}>
          {diaryEntries.length > 0 ? (
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {diaryEntries.map((entry: any, i: number) => (
                <div key={i} className="relative pl-5 border-l-2 border-muted hover:border-primary transition-colors py-1">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-primary"></div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-primary">{entry.date?.split('-').reverse().join('/')}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{entry.weather}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">"{entry.content}"</p>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Chưa có nhật ký.</p>}
        </Section>
      </div>
    </div>
  );
};
