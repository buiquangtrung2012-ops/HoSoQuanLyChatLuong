import React, { useState, useEffect } from 'react';
import { Users, Save, CheckCircle, Plus, Trash2, UserPlus, GripVertical, ChevronDown, ChevronUp, Copy, Eye, User } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface SignerEntry {
  id: string;
  name: string;
  position: string;
  gender?: 'auto' | 'male' | 'female';
}

interface ParticipantGroup {
  label: string;
  prefix: string;
  colorClass: string;
  borderClass: string;
  labelColorClass: string;
  headerBgClass: string;
  signers: SignerEntry[];
}

const defaultGroups = (): ParticipantGroup[] => [
  {
    label: '1. Đại diện Chủ đầu tư',
    prefix: 'cdt',
    colorClass: 'bg-white',
    borderClass: 'border-slate-200',
    headerBgClass: 'bg-slate-50',
    labelColorClass: 'text-slate-700',
    signers: [
      { id: 'cdt_1', name: '', position: '', gender: 'auto' },
      { id: 'cdt_2', name: '', position: '', gender: 'auto' },
    ],
  },
  {
    label: '2. Đại diện Đơn vị thi công',
    prefix: 'tc',
    colorClass: 'bg-white',
    borderClass: 'border-blue-200',
    headerBgClass: 'bg-blue-50/50',
    labelColorClass: 'text-blue-800',
    signers: [
      { id: 'tc_1', name: '', position: '', gender: 'auto' },
      { id: 'tc_2', name: '', position: '', gender: 'auto' },
      { id: 'tc_3', name: '', position: '', gender: 'auto' },
    ],
  },
  {
    label: '3. Đại diện Đơn vị Tư vấn giám sát',
    prefix: 'tv',
    colorClass: 'bg-white',
    borderClass: 'border-emerald-200',
    headerBgClass: 'bg-emerald-50/50',
    labelColorClass: 'text-emerald-800',
    signers: [
      { id: 'tv_1', name: '', position: '', gender: 'auto' },
      { id: 'tv_2', name: '', position: '', gender: 'auto' },
    ],
  },
  {
    label: '4. Đại diện Đơn vị Tư vấn thiết kế',
    prefix: 'tvtk',
    colorClass: 'bg-white',
    borderClass: 'border-purple-200',
    headerBgClass: 'bg-purple-50/50',
    labelColorClass: 'text-purple-800',
    signers: [
      { id: 'tvtk_1', name: '', position: '', gender: 'auto' },
    ],
  },
];

export const RecordsModule: React.FC = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [groups, setGroups] = useState<ParticipantGroup[]>(defaultGroups());
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [draggedItem, setDraggedItem] = useState<{ groupIdx: number, signerIdx: number } | null>(null);

  useEffect(() => {
    setPersonnel(StorageService.get('hoso_personnel') || []);
    
    const project = StorageService.getProject();
    const saved = StorageService.get('hoso_participants_v2') || [];
    
    const baseGroups = defaultGroups();
    const cdtGroup = saved.find((g: any) => g.prefix === 'cdt') || baseGroups[0];
    const tvGroup = saved.find((g: any) => g.prefix === 'tv') || baseGroups[2];
    
    let tcGroups: ParticipantGroup[] = [];
    
    if (project?.isJointVenture && project.contractorMembers?.length) {
      tcGroups = project.contractorMembers.map((member: string, idx: number) => {
        const prefix = `tc_ld${idx + 1}`;
        const existing = saved.find((g: any) => g.prefix === prefix);
        
        return {
          label: `2.${idx + 1}. Đại diện ${member}`,
          prefix: prefix,
          colorClass: 'bg-white',
          borderClass: 'border-blue-200',
          headerBgClass: 'bg-blue-50/50',
          labelColorClass: 'text-blue-800',
          signers: existing ? existing.signers : [
            { id: `${prefix}_1`, name: '', position: '', gender: 'auto' },
            { id: `${prefix}_2`, name: '', position: '', gender: 'auto' },
          ],
        };
      });
    } else {
      const existingTC = saved.find((g: any) => g.prefix === 'tc') || baseGroups[1];
      tcGroups = [existingTC];
    }
    
    const tvtkGroup = saved.find((g: any) => g.prefix === 'tvtk') || baseGroups[3];
    
    const finalGroups = [cdtGroup, ...tcGroups, tvGroup, tvtkGroup];
    
    const migrated = finalGroups.map((g: any) => ({
      ...g,
      signers: g.signers.map((s: any) => ({ gender: 'auto' as const, ...s })),
    }));
    
    setGroups(migrated);
  }, []);

  const toggleCollapse = (prefix: string) => {
    setCollapsedGroups(prev => ({ ...prev, [prefix]: !prev[prefix] }));
  };

  const handleSignerChange = (groupIdx: number, signerIdx: number, field: 'name' | 'position' | 'gender', value: string) => {
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
            ? { ...s, name: person?.name || '', position: person?.position || '', gender: person?.gender || 'auto' }
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
        signers: [...next[groupIdx].signers, { id: newId, name: '', position: '', gender: 'auto' }],
      };
      // Auto expand if collapsed
      setCollapsedGroups(c => ({ ...c, [next[groupIdx].prefix]: false }));
      return next;
    });
  };

  const handleRemoveSigner = (groupIdx: number, signerIdx: number) => {
    setGroups(prev => {
      const next = [...prev];
      if (next[groupIdx].signers.length <= 1) return prev;
      next[groupIdx] = {
        ...next[groupIdx],
        signers: next[groupIdx].signers.filter((_, i) => i !== signerIdx),
      };
      return next;
    });
  };

  const handleAddCustomGroup = () => {
    setGroups(prev => {
      const customGroups = prev.filter(g => g.prefix.startsWith('custom_'));
      const nextIdx = customGroups.length > 0 
        ? Math.max(...customGroups.map(g => parseInt(g.prefix.split('_')[1]))) + 1 
        : 1;
      const prefix = `custom_${nextIdx}`;
      const newGroup: ParticipantGroup = {
        label: `Nhóm Tùy Chỉnh ${nextIdx}`,
        prefix,
        colorClass: 'bg-white',
        borderClass: 'border-orange-200',
        headerBgClass: 'bg-orange-50/50',
        labelColorClass: 'text-orange-800',
        signers: [{ id: `${prefix}_1`, name: '', position: '', gender: 'auto' }]
      };
      return [...prev, newGroup];
    });
  };

  const handleRemoveGroup = (prefix: string) => {
    if (!prefix.startsWith('custom_')) return;
    if (confirm('Bạn có chắc chắn muốn xóa nhóm ký này không?')) {
      setGroups(prev => prev.filter(g => g.prefix !== prefix));
    }
  };

  const handleGroupLabelChange = (prefix: string, label: string) => {
    setGroups(prev => prev.map(g => g.prefix === prefix ? { ...g, label } : g));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, groupIdx: number, signerIdx: number) => {
    setDraggedItem({ groupIdx, signerIdx });
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.classList.add('opacity-40', 'bg-slate-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) e.target.classList.remove('opacity-40', 'bg-slate-50');
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetGroupIdx: number, targetSignerIdx: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (draggedItem.groupIdx !== targetGroupIdx) return; // Only allow reordering within same group
    if (draggedItem.signerIdx === targetSignerIdx) return;

    setGroups(prev => {
      const next = [...prev];
      const group = { ...next[targetGroupIdx] };
      const signers = [...group.signers];
      
      const [movedItem] = signers.splice(draggedItem.signerIdx, 1);
      signers.splice(targetSignerIdx, 0, movedItem);
      
      group.signers = signers;
      next[targetGroupIdx] = group;
      return next;
    });
  };

  const handleSave = () => {
    StorageService.save('hoso_participants_v2', groups);
    const flat: Record<string, string> = {};
    groups.forEach(g => {
      g.signers.forEach((s, i) => {
        flat[`${g.prefix}${i + 1}_name`] = s.name;
        flat[`${g.prefix}${i + 1}_pos`] = s.position;
        flat[`${g.prefix}${i + 1}_gender`] = s.gender || 'auto';
      });
    });
    StorageService.save('hoso_participants', flat);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const genderLabel = (gender: string | undefined) => {
    if (gender === 'male') return 'Ông';
    if (gender === 'female') return 'Bà';
    return 'Tự động';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 -m-6 p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-800">Ký hồ sơ</h1>
            <p className="text-sm text-slate-500 mt-1">Cấu hình danh sách người ký cho các biên bản nghiệm thu.</p>
          </div>
        </div>

        <div className="space-y-4">
          {groups.map((group, groupIdx) => {
            const isCollapsed = collapsedGroups[group.prefix];
            return (
              <div key={group.prefix} className={`bg-white border ${group.borderClass} rounded-xl shadow-sm overflow-hidden transition-all duration-200`}>
                {/* Card Header */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer select-none ${group.headerBgClass} hover:opacity-90 transition-opacity`}
                  onClick={() => toggleCollapse(group.prefix)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {group.prefix.startsWith('custom_') ? (
                      <input 
                        value={group.label}
                        onChange={(e) => handleGroupLabelChange(group.prefix, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[15px] font-bold uppercase bg-white/50 border border-transparent hover:border-orange-300 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none rounded px-2 py-0.5 w-full max-w-xs transition-all ${group.labelColorClass}`}
                        placeholder="Nhập tên nhóm ký..."
                      />
                    ) : (
                      <h3 className={`text-[15px] font-bold uppercase ${group.labelColorClass}`}>{group.label}</h3>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-white/60 border border-black/5 text-xs font-bold text-slate-600 shadow-sm whitespace-nowrap">
                      {group.signers.length} người
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {group.prefix.startsWith('custom_') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveGroup(group.prefix); }}
                        className="flex items-center text-[11px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-md transition-all"
                        title="Xóa nhóm này"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddSigner(groupIdx); }}
                      className="flex items-center text-[11px] font-bold text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 px-2.5 py-1.5 rounded-md transition-all"
                    >
                      <Plus size={14} className="mr-1" /> Thêm người
                    </button>
                    <div className="text-slate-400 p-1">
                      {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                {!isCollapsed && (
                  <div className="p-4 bg-white">
                    {/* Header Row Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-3 px-2 pb-2 mb-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-3 pl-6">Nhân sự (Tự động điền)</div>
                      <div className="col-span-3">Họ và tên</div>
                      <div className="col-span-3">Chức vụ</div>
                      <div className="col-span-2 text-center">Xưng hô</div>
                      <div className="col-span-1 text-center">Tác vụ</div>
                    </div>

                    <div className="space-y-2">
                      {group.signers.map((signer, signerIdx) => (
                        <div 
                          key={signer.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, groupIdx, signerIdx)}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, groupIdx, signerIdx)}
                          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-2.5 bg-white border border-slate-200 rounded-lg group/row hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          {/* Col 1: Drag + Dropdown */}
                          <div className="md:col-span-3 flex items-center gap-2">
                            <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-1 -ml-1">
                              <GripVertical size={16} />
                            </div>
                            <div className="relative flex-1">
                              <select
                                className="w-full pl-8 pr-2 py-1.5 border border-slate-200 rounded-md text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none text-slate-700 font-medium"
                                onChange={e => handlePersonSelect(groupIdx, signerIdx, e.target.value)}
                                value=""
                              >
                                <option value="">-- Chọn nhân sự --</option>
                                {personnel.map(p => (
                                  <option key={p.id} value={p.id}>{p.name} - {p.position}</option>
                                ))}
                              </select>
                              <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Col 2: Name */}
                          <div className="md:col-span-3 flex flex-col md:block">
                            <label className="text-[10px] text-slate-400 font-medium mb-1 md:hidden">Họ và tên</label>
                            <input
                              value={signer.name}
                              onChange={e => handleSignerChange(groupIdx, signerIdx, 'name', e.target.value)}
                              placeholder="Nhập họ tên"
                              className="w-full p-1.5 border border-transparent hover:border-slate-200 focus:border-primary/50 rounded-md text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20 outline-none bg-transparent transition-all"
                            />
                          </div>

                          {/* Col 3: Position */}
                          <div className="md:col-span-3 flex flex-col md:block">
                            <label className="text-[10px] text-slate-400 font-medium mb-1 md:hidden">Chức vụ</label>
                            <input
                              value={signer.position}
                              onChange={e => handleSignerChange(groupIdx, signerIdx, 'position', e.target.value)}
                              placeholder="Nhập chức vụ"
                              className="w-full p-1.5 border border-transparent hover:border-slate-200 focus:border-primary/50 rounded-md text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none bg-transparent transition-all"
                            />
                          </div>

                          {/* Col 4: Gender Segmented Button */}
                          <div className="md:col-span-2 flex items-center justify-center">
                             <div className="flex p-0.5 bg-slate-100/80 rounded-md border border-slate-200 w-full md:w-auto">
                              {(['auto', 'male', 'female'] as const).map(g => {
                                const isActive = signer.gender === g || (!signer.gender && g === 'auto');
                                return (
                                  <button
                                    key={g}
                                    onClick={() => handleSignerChange(groupIdx, signerIdx, 'gender', g)}
                                    className={`flex-1 md:flex-none px-3 py-1 rounded-[4px] text-[11px] font-bold transition-all shadow-sm ${
                                      isActive
                                        ? 'bg-white text-primary border-slate-200/50 ring-1 ring-black/5'
                                        : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 shadow-none'
                                    }`}
                                  >
                                    {genderLabel(g)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Col 5: Delete */}
                          <div className="md:col-span-1 flex items-center justify-end">
                            <button
                              onClick={() => handleRemoveSigner(groupIdx, signerIdx)}
                              disabled={group.signers.length <= 1}
                              className={`p-2 rounded-md transition-colors ${
                                group.signers.length <= 1 
                                  ? 'text-slate-300 cursor-not-allowed' 
                                  : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                              }`}
                              title={group.signers.length <= 1 ? "Không thể xóa người ký duy nhất" : "Xóa người này"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleAddCustomGroup}
            className="flex items-center px-6 py-2.5 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-semibold text-sm"
          >
            <Plus size={16} className="mr-2" /> Thêm Nhóm Ký Khác
          </button>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 px-6 py-4 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium hidden md:flex">
             Mọi thay đổi sẽ được áp dụng vào mẫu Word ngay khi lưu.
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex justify-center items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold text-sm">
              <Copy size={16} className="mr-2" /> Sao chép mẫu
            </button>
            <button
              onClick={handleSave}
              className="flex-1 md:flex-none flex justify-center items-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 font-bold text-sm relative overflow-hidden"
            >
              {isSaved ? <CheckCircle size={18} className="mr-2 animate-in zoom-in" /> : <Save size={18} className="mr-2" />}
              {isSaved ? 'Đã lưu thành công' : 'Lưu cấu hình ký'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
