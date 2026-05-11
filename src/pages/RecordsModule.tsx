import React, { useState, useEffect } from 'react';
import { Users, Save, CheckCircle, Plus, Trash2, UserPlus } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface SignerEntry {
  id: string;
  name: string;
  position: string;
}

interface ParticipantGroup {
  label: string;
  prefix: string;
  colorClass: string;
  borderClass: string;
  labelColorClass: string;
  signers: SignerEntry[];
}

const defaultGroups = (): ParticipantGroup[] => [
  {
    label: '1. Đại diện Chủ đầu tư',
    prefix: 'cdt',
    colorClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
    labelColorClass: 'text-slate-700',
    signers: [
      { id: 'cdt_1', name: '', position: '' },
      { id: 'cdt_2', name: '', position: '' },
    ],
  },
  {
    label: '2. Đại diện Đơn vị thi công',
    prefix: 'tc',
    colorClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    labelColorClass: 'text-blue-800',
    signers: [
      { id: 'tc_1', name: '', position: '' },
      { id: 'tc_2', name: '', position: '' },
      { id: 'tc_3', name: '', position: '' },
    ],
  },
  {
    label: '3. Đại diện Đơn vị Tư vấn giám sát',
    prefix: 'tv',
    colorClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    labelColorClass: 'text-emerald-800',
    signers: [
      { id: 'tv_1', name: '', position: '' },
      { id: 'tv_2', name: '', position: '' },
    ],
  },
];

export const RecordsModule: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [groups, setGroups] = useState<ParticipantGroup[]>(defaultGroups());

  useEffect(() => {
    setPersonnel(StorageService.get('hoso_personnel') || []);
    const saved = StorageService.get('hoso_participants_v2');
    if (saved) {
      setGroups(saved);
    }
  }, []);

  const handleSignerChange = (groupIdx: number, signerIdx: number, field: 'name' | 'position', value: string) => {
    setGroups(prev => {
      const next = [...prev];
      next[groupIdx] = {
        ...next[groupIdx],
        signers: next[groupIdx].signers.map((s, i) =>
          i === signerIdx ? { ...s, [field]: value } : s
        ),
      };
      return next;
    });
  };

  const handlePersonSelect = (groupIdx: number, signerIdx: number, personId: string) => {
    const person = personnel.find(p => p.id === personId);
    setGroups(prev => {
      const next = [...prev];
      next[groupIdx] = {
        ...next[groupIdx],
        signers: next[groupIdx].signers.map((s, i) =>
          i === signerIdx
            ? { ...s, name: person?.name || '', position: person?.position || '' }
            : s
        ),
      };
      return next;
    });
  };

  const handleAddSigner = (groupIdx: number) => {
    setGroups(prev => {
      const next = [...prev];
      const newId = `${next[groupIdx].prefix}_${Date.now()}`;
      next[groupIdx] = {
        ...next[groupIdx],
        signers: [...next[groupIdx].signers, { id: newId, name: '', position: '' }],
      };
      return next;
    });
  };

  const handleRemoveSigner = (groupIdx: number, signerIdx: number) => {
    setGroups(prev => {
      const next = [...prev];
      if (next[groupIdx].signers.length <= 1) return prev; // Giữ ít nhất 1 người
      next[groupIdx] = {
        ...next[groupIdx],
        signers: next[groupIdx].signers.filter((_, i) => i !== signerIdx),
      };
      return next;
    });
  };

  const handleSave = () => {
    StorageService.save('hoso_participants_v2', groups);
    // Also save flat format for ExportModule compatibility
    const flat: Record<string, string> = {};
    groups.forEach(g => {
      g.signers.forEach((s, i) => {
        flat[`${g.prefix}${i + 1}_name`] = s.name;
        flat[`${g.prefix}${i + 1}_pos`] = s.position;
      });
    });
    StorageService.save('hoso_participants', flat);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Ký hồ sơ</h1>
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold text-sm"
        >
          {isSaved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
          {isSaved ? 'Đã lưu' : 'Lưu cấu hình'}
        </button>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm space-y-2 mb-2">
        <h2 className="text-base font-bold text-primary flex items-center">
          <Users size={20} className="mr-2" /> Thành phần tham gia nghiệm thu
        </h2>
        <p className="text-xs text-muted-foreground">
          Cấu hình danh sách người ký. Nhấn <strong>"+ Thêm người"</strong> để thêm, nhấn biểu tượng thùng rác để xóa. Dữ liệu sẽ dùng chung khi Xuất file Word.
        </p>
      </div>

      <div className="space-y-4">
        {groups.map((group, groupIdx) => (
          <div key={group.prefix} className={`${group.colorClass} border ${group.borderClass} rounded-xl p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-bold uppercase ${group.labelColorClass}`}>{group.label}</h4>
              <button
                onClick={() => handleAddSigner(groupIdx)}
                className="flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors gap-1 px-2 py-1 rounded-lg hover:bg-primary/10"
              >
                <UserPlus size={14} /> Thêm người
              </button>
            </div>

            <div className="space-y-3">
              {group.signers.map((signer, signerIdx) => (
                <div key={signer.id} className="bg-white rounded-lg border p-3 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Người thứ {signerIdx + 1}</span>
                    {group.signers.length > 1 && (
                      <button
                        onClick={() => handleRemoveSigner(groupIdx, signerIdx)}
                        className="p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Xóa người này"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <select
                    className="w-full p-2 border rounded-md text-xs bg-background focus:ring-1 focus:ring-primary outline-none"
                    onChange={e => handlePersonSelect(groupIdx, signerIdx, e.target.value)}
                    value=""
                  >
                    <option value="">-- Chọn từ danh sách Nhân sự --</option>
                    {personnel.map(p => (
                      <option key={p.id} value={p.id}>{p.name} — {p.position}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      value={signer.name}
                      onChange={e => handleSignerChange(groupIdx, signerIdx, 'name', e.target.value)}
                      placeholder="Họ tên"
                      className="flex-1 p-2 border rounded-md text-xs focus:ring-1 focus:ring-primary outline-none bg-background"
                    />
                    <input
                      value={signer.position}
                      onChange={e => handleSignerChange(groupIdx, signerIdx, 'position', e.target.value)}
                      placeholder="Chức vụ"
                      className="flex-1 p-2 border rounded-md text-xs focus:ring-1 focus:ring-primary outline-none bg-background"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAddSigner(groupIdx)}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed rounded-lg text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <Plus size={14} /> Thêm người ký
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
