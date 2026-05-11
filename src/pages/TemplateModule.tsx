import React, { useState, useEffect } from 'react';
import { 
  FileText, Hash, Briefcase, Building2, User, Users, Calendar, Plus, Save, 
  Layers, Layout, MapPin, Package, Truck, FlaskConical, RefreshCw, Trash2, Zap,
  PenLine, X
} from 'lucide-react';
import { StorageService } from '../services/storageService';

// ---- Nhận diện giới tính từ tên tiếng Việt ----
const FEMALE_GIVEN_NAMES = new Set([
  'lan','hoa','thu','mai','linh','thảo','trang','nhung','yến','uyên','phương',
  'hằng','dung','hiền','liên','quyên','thủy','thúy','hồng','ngọc','vân','chi',
  'loan','tuyết','xuân','hạnh','lệ','ly','nga','nhi','oanh','trinh','trúc',
  'huệ','diệp','thoa','nhàn','châu','diễm','giang','quỳnh','kim','bích','lam',
  'my','mỹ','nha','nhi','thương','thắm','vi','vy','huyền','thanh','thị',
]);
const FEMALE_MIDDLE = new Set(['thị']);

export const detectGender = (fullName: string): 'Ông' | 'Bà' => {
  if (!fullName.trim()) return 'Ông';
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  // Kiểm tra tên đệm "Thị"
  if (parts.some(p => FEMALE_MIDDLE.has(p))) return 'Bà';
  // Kiểm tra tên cuối
  const given = parts[parts.length - 1];
  return FEMALE_GIVEN_NAMES.has(given) ? 'Bà' : 'Ông';
};

const resolveGender = (name: string, gender?: string): string => {
  if (gender === 'male') return 'Ông';
  if (gender === 'female') return 'Bà';
  return detectGender(name);
};

const isWordApiAvailable = () => {
  try {
    // @ts-ignore
    return typeof Word !== 'undefined';
  } catch {
    return false;
  }
};

const contentControls = [
  // Thông tin chung dự án
  { id: 'projectName', label: 'Tên Dự án', icon: FileText, category: 'Dự án' },
  { id: 'contractNumber', label: 'Số Hợp đồng', icon: Hash, category: 'Dự án' },
  { id: 'packageName', label: 'Tên Gói thầu', icon: Briefcase, category: 'Dự án' },
  { id: 'contractor', label: 'Đơn vị Thi công', icon: Building2, category: 'Dự án' },
  { id: 'investorRep', label: 'Đại diện CDT', icon: User, category: 'Dự án' },
  { id: 'supervisorRep', label: 'Tư vấn Giám sát', icon: Users, category: 'Dự án' },
  
  // Thông tin Công việc
  { id: 'workName', label: 'Tên Công việc', icon: Layers, category: 'Công việc' },
  { id: 'workCode', label: 'Mã CV', icon: Hash, category: 'Công việc' },
  { id: 'workLine', label: 'Tuyến', icon: Layout, category: 'Công việc' },
  { id: 'workCategory', label: 'Hạng mục', icon: Layout, category: 'Công việc' },
  { id: 'workQty', label: 'Khối lượng', icon: Hash, category: 'Công việc' },
  { id: 'workUnit', label: 'Đơn vị tính', icon: FileText, category: 'Công việc' },
  { id: 'workInspectDate', label: 'Ngày nghiệm thu', icon: Calendar, category: 'Công việc' },

  // Thông tin Nhân sự chung (cũ)
  { id: 'staffName', label: 'Tên Nhân sự', icon: User, category: 'Nhân sự' },
  { id: 'staffPosition', label: 'Chức vụ', icon: FileText, category: 'Nhân sự' },
  { id: 'staffUnit', label: 'Đơn vị công tác', icon: Building2, category: 'Nhân sự' },

  // Thành phần tham gia (CĐT)
  { id: 'cdt1_name', label: 'CĐT 1 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'cdt1_pos', label: 'CĐT 1 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },
  { id: 'cdt2_name', label: 'CĐT 2 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'cdt2_pos', label: 'CĐT 2 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },

  // Thành phần tham gia (Thi công)
  { id: 'tc1_name', label: 'Thi công 1 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'tc1_pos', label: 'Thi công 1 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },
  { id: 'tc2_name', label: 'Thi công 2 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'tc2_pos', label: 'Thi công 2 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },
  { id: 'tc3_name', label: 'Thi công 3 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'tc3_pos', label: 'Thi công 3 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },

  // Thành phần tham gia (Tư vấn)
  { id: 'tv1_name', label: 'Tư vấn 1 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'tv1_pos', label: 'Tư vấn 1 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },
  { id: 'tv2_name', label: 'Tư vấn 2 - Tên', icon: User, category: 'Thành phần tham gia' },
  { id: 'tv2_pos', label: 'Tư vấn 2 - Chức vụ', icon: FileText, category: 'Thành phần tham gia' },

  // Thông tin Vật liệu
  { id: 'matName', label: 'Tên Vật liệu', icon: Package, category: 'Vật liệu' },
  { id: 'matSource', label: 'Nguồn gốc', icon: MapPin, category: 'Vật liệu' },
  { id: 'matLot', label: 'Số lô/CO-CQ', icon: Hash, category: 'Vật liệu' },
  { id: 'matQty', label: 'Số lượng vật liệu', icon: Hash, category: 'Vật liệu' },

  // Thông tin Máy móc
  { id: 'equipName', label: 'Tên Máy móc', icon: Truck, category: 'Máy móc' },
  { id: 'equipSerial', label: 'Số Serial/Biển số', icon: Hash, category: 'Máy móc' },
  { id: 'equipExpiry', label: 'Hạn kiểm định', icon: Calendar, category: 'Máy móc' },

  // Thông tin Phòng thí nghiệm
  { id: 'labName', label: 'Tên PTN', icon: FlaskConical, category: 'PTN' },
  { id: 'labCode', label: 'Mã LAS-XD', icon: Hash, category: 'PTN' },
  { id: 'labExpiry', label: 'Hạn chứng chỉ PTN', icon: Calendar, category: 'PTN' },
];

const bookmarks = [
  { id: 'personnelTable', label: 'Bảng Nhân sự', icon: Users },
  { id: 'materialsTable', label: 'Bảng Vật liệu', icon: Package },
  { id: 'equipmentTable', label: 'Bảng Máy móc', icon: Truck },
  { id: 'workTable', label: 'Bảng Công việc', icon: Layers },
];


export const TemplateModule: React.FC = () => {
  const [recordName, setRecordName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customRecords, setCustomRecords] = useState<string[]>([]);

  useEffect(() => {
    setCustomRecords(StorageService.getRecordTypes());
  }, []);

  const handleDeleteRecord = (type: string) => {
    if (confirm(`Bạn có chắc muốn xóa mẫu "${type}"?`)) {
      const updated = customRecords.filter(t => t !== type);
      StorageService.saveRecordTypes(updated);
      setCustomRecords(updated);
    }
  };

  const handleSaveToRecords = () => {
    if (!recordName.trim()) {
      alert('Vui lòng nhập tên biên bản trước khi lưu!');
      return;
    }
    setIsSaving(true);
    const currentRecords = StorageService.getRecordTypes();
    if (!currentRecords.includes(recordName)) {
      const updated = [...currentRecords, recordName];
      StorageService.saveRecordTypes(updated);
      setCustomRecords(updated);
    }
    setTimeout(() => {
      setIsSaving(false);
      alert(`Đã lưu mẫu "${recordName}" vào danh sách Hồ sơ thành công!`);
      setRecordName('');
    }, 500);
  };

  const insertContentControl = (id: string, label: string) => {
    if (isWordApiAvailable()) {
      // @ts-ignore
      Word.run(async (context: any) => {
        const range = context.document.getSelection();
        const cc = range.insertContentControl();
        cc.title = label;
        cc.tag = id;
        cc.placeholderText = `[${label}]`;
        cc.appearance = 'BoundingBox';
        await context.sync();
        // Di chuyển con trỏ ra sau Content Control
        cc.getRange('After').select();
        await context.sync();
      }).catch((err: any) => {
        console.error(err);
        alert('Lỗi khi chèn Content Control vào Word: ' + err.message);
      });
    } else {
      alert(`Chức năng này chỉ hoạt động khi mở trong Microsoft Word.\n\nTag sẽ chèn: ${id}`);
    }
  };

  const insertBookmark = (id: string, label: string) => {
    if (isWordApiAvailable()) {
      // @ts-ignore
      Word.run(async (context: any) => {
        const range = context.document.getSelection();
        range.insertBookmark(id);
        await context.sync();
        alert(`Đã chèn Bookmark: ${id}`);
      }).catch((err: any) => {
        console.error(err);
        alert('Lỗi khi chèn Bookmark vào Word.');
      });
    } else {
      alert(`Chức năng này chỉ hoạt động khi mở trong Microsoft Word.\n\nBookmark: ${id}`);
    }
  };

  const fillDataToDocument = () => {
    const participants = StorageService.get('hoso_participants') || {};
    const project = StorageService.getProject() || {};
    const materials = StorageService.get('hoso_materials') || [];
    const equipment = StorageService.get('hoso_equipment') || [];
    const labs = StorageService.get('hoso_labs') || [];
    const workItems = StorageService.getWorkItems() || [];

    // First material, equipment, lab for single-value fields
    const mat = materials[0] || {};
    const equip = equipment[0] || {};
    const lab = labs[0] || {};
    const work = workItems[0] || {};

    const allData: Record<string, string> = {
      // Project
      projectName: project.name || '',
      contractNumber: project.contractNumber || '',
      packageName: project.packageName || '',
      contractor: project.contractor || '',
      investorRep: project.investor || '',
      // Work
      workName: work.name || '',
      workCode: work.code || '',
      workLine: work.line || '',
      workCategory: work.category || '',
      workQty: work.quantity?.toString() || '',
      workUnit: work.unit || '',
      workInspectDate: work.inspectionDate?.split('-').reverse().join('/') || '',
      // Material
      matName: mat.name || '',
      matSource: mat.source || '',
      matLot: mat.lot || '',
      matQty: mat.qty?.toString() || '',
      // Equipment
      equipName: equip.name || '',
      equipSerial: equip.serial || '',
      equipExpiry: equip.expiry || '',
      // Lab
      labName: lab.name || '',
      labCode: lab.code || '',
      labExpiry: lab.expiry || '',
      // Participants (from Ky ho so)
      ...participants,
    };

    if (!isWordApiAvailable()) {
      alert('Chức năng này chỉ hoạt động khi mở trong Microsoft Word.');
      return;
    }
    // @ts-ignore
    Word.run(async (context: any) => {
      const ccs = context.document.contentControls;
      ccs.load('items');
      await context.sync();
      let filled = 0;
      for (const item of ccs.items) {
        item.load('tag');
      }
      await context.sync();

      // 1. Fill normal text controls
      for (const item of ccs.items) {
        const val = allData[item.tag];
        if (val !== undefined && val !== '' && !item.tag.startsWith('table_')) {
          item.insertText(val, 'Replace');
          filled++;
        }
      }

      // 2. Refresh dynamic participant tables
      const savedGroups = StorageService.get('hoso_participants_v2') || [];
      const tableTags = ['table_cdt', 'table_tc', 'table_tv'];
      let tablesRefreshed = 0;

      for (const tag of tableTags) {
        const role = tag.replace('table_', '') as 'cdt' | 'tc' | 'tv';
        const foundTables = ccs.items.filter((cc: any) => cc.tag === tag);
        
        if (foundTables.length > 0) {
          const group = savedGroups.find((g: any) => g.prefix === role);
          const signers = group ? group.signers : [];
          const rowCount = signers.length || (role === 'tc' ? 3 : 2);
          const actualSigners = signers.length > 0 ? signers : Array(rowCount).fill({ name: '', position: '', gender: 'auto' });

          for (const wrapper of foundTables) {
            wrapper.load('font');
            await context.sync();
            const existingFont = wrapper.font;

            wrapper.clear();
            const table = wrapper.insertTable(rowCount, 2, 'Start');
            
            // Re-apply existing formatting
            table.font.set({
              name: existingFont.name,
              size: existingFont.size,
              bold: existingFont.bold,
              italic: existingFont.italic,
              color: existingFont.color
            });
            
            // Hide borders (No border)
            table.borders.insideHorizontal.style = 'None';
            table.borders.insideVertical.style = 'None';
            table.borders.outsideTop.style = 'None';
            table.borders.outsideBottom.style = 'None';
            table.borders.outsideLeft.style = 'None';
            table.borders.outsideRight.style = 'None';
            
            for (let i = 0; i < rowCount; i++) {
              const s = actualSigners[i] || {};
              const honorific = resolveGender(s.name || '', s.gender) + ': ';
              
              const nameCell = table.getCell(i, 0);
              nameCell.body.insertText(honorific, 'Replace');
              const nameCC = nameCell.body.getRange('End').insertContentControl();
              nameCC.set({
                title: `${role.toUpperCase()} ${i + 1} - Tên`,
                tag: `${role}${i + 1}_name`,
                placeholderText: '[Họ tên]',
                appearance: 'BoundingBox'
              });
              if (s.name) nameCC.insertText(s.name, 'Replace');

              const posCell = table.getCell(i, 1);
              posCell.body.insertText('Chức vụ: ', 'Replace');
              const posCC = posCell.body.getRange('End').insertContentControl();
              posCC.set({
                title: `${role.toUpperCase()} ${i + 1} - Chức vụ`,
                tag: `${role}${i + 1}_pos`,
                placeholderText: '[Chức vụ]',
                appearance: 'BoundingBox'
              });
              if (s.position) posCC.insertText(s.position, 'Replace');
            }
            tablesRefreshed++;
          }
        }
      }

      await context.sync();
      let msg = `Đã cập nhật ${filled} trường dữ liệu`;
      if (tablesRefreshed > 0) msg += ` và làm mới ${tablesRefreshed} bảng thành phần`;
      alert(msg + '!');
    }).catch((err: any) => {
      console.error(err);
      alert('Lỗi khi cập nhật dữ liệu: ' + err.message);
    });
  };

  const insertParticipantTable = (role: 'cdt' | 'tc' | 'tv') => {
    if (!isWordApiAvailable()) {
      alert('Chức năng này chỉ hoạt động khi mở trong Microsoft Word.');
      return;
    }
    const savedGroups = StorageService.get('hoso_participants_v2') || [];
    const group = savedGroups.find((g: any) => g.prefix === role);
    const rowCount = group ? group.signers.length : (role === 'tc' ? 3 : 2);
    const signers: any[] = group ? group.signers : Array(rowCount).fill({ name: '', position: '', gender: 'auto' });

    // @ts-ignore
    Word.run(async (context: any) => {
      const range = context.document.getSelection();
      range.load('font');
      await context.sync();

      const userFont = range.font;
      
      // Wrap table in a wrapper Content Control for future dynamic updates
      const wrapper = range.insertContentControl();
      wrapper.set({
        tag: `table_${role}`,
        title: `Bảng ${role.toUpperCase()}`,
        appearance: 'Hidden'
      });

      const table = wrapper.insertTable(rowCount, 2, 'Start');
      
      // Apply user font to the whole table
      table.font.set({
        name: userFont.name,
        size: userFont.size,
        bold: userFont.bold,
        italic: userFont.italic,
        color: userFont.color
      });
      
      // Hide borders (No border)
      table.borders.insideHorizontal.style = 'None';
      table.borders.insideVertical.style = 'None';
      table.borders.outsideTop.style = 'None';
      table.borders.outsideBottom.style = 'None';
      table.borders.outsideLeft.style = 'None';
      table.borders.outsideRight.style = 'None';
      
      for (let i = 0; i < rowCount; i++) {
        const s = signers[i] || {};
        const honorific = resolveGender(s.name || '', s.gender) + ': ';

        const nameCell = table.getCell(i, 0);
        nameCell.body.insertText(honorific, 'Replace');
        const nameCC = nameCell.body.getRange('End').insertContentControl();
        nameCC.set({
          title: `${role.toUpperCase()} ${i + 1} - Tên`,
          tag: `${role}${i + 1}_name`,
          placeholderText: '[Họ tên]',
          appearance: 'BoundingBox'
        });
        if (s.name) nameCC.insertText(s.name, 'Replace');

        const posCell = table.getCell(i, 1);
        posCell.body.insertText('Chức vụ: ', 'Replace');
        const posCC = posCell.body.getRange('End').insertContentControl();
        posCC.set({
          title: `${role.toUpperCase()} ${i + 1} - Chức vụ`,
          tag: `${role}${i + 1}_pos`,
          placeholderText: '[Chức vụ]',
          appearance: 'BoundingBox'
        });
        if (s.position) posCC.insertText(s.position, 'Replace');
      }

      await context.sync();
      wrapper.getRange('After').select();
      await context.sync();
      alert(`Đã chèn bảng Thành phần tham gia (${role.toUpperCase()}) động (v1605)!`);
    }).catch((err: any) => alert('Lỗi khi chèn bảng: ' + err.message));
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Layout size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Tạo Mẫu</h1>
        </div>
        <button
          onClick={fillDataToDocument}
          className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-sm shadow-lg shadow-green-600/20 gap-2"
        >
          <Zap size={16} /> Cập nhật dữ liệu vào tài liệu
        </button>
      </div>

      {/* Save to Records Feature */}
      <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-primary">
          <FileText size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">Đăng ký vào Danh mục Hồ sơ</h3>
        </div>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="Nhập tên biên bản (VD: Biên bản nghiệm thu lắp đặt thiết bị...)"
            value={recordName}
            onChange={(e) => setRecordName(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 p-3 border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/50 outline-none"
          />
          <button 
            onClick={handleSaveToRecords}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
            {isSaving ? "Đang lưu..." : "Lưu vào Hồ sơ"}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground italic pl-1">
          * Lưu tên biên bản này để nó xuất hiện trong danh sách lựa chọn ở Tab Hồ sơ.
        </p>

        {customRecords.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Danh sách Biên bản đã đăng ký</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {customRecords.map((rec) => (
                <div key={rec} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group">
                  <span className="text-xs font-medium truncate pr-4">{rec}</span>
                  <button 
                    onClick={() => handleDeleteRecord(rec)}
                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Xóa khỏi danh mục"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12">
        {['Dự án', 'Công việc', 'Nhân sự', 'Vật liệu', 'Máy móc', 'PTN'].map((category) => (
          <section key={category} className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-sm font-black text-primary uppercase tracking-widest">{category}</h2>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {contentControls.filter(cc => cc.category === category).map((cc) => (
                <button
                  key={cc.id}
                  onClick={() => insertContentControl(cc.id, cc.label)}
                  className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} className="text-primary" />
                  </div>
                  <div className="p-2 bg-muted rounded-lg mb-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <cc.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">{cc.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Bookmarks Section */}
        <section className="space-y-4 pt-6">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Vùng dữ liệu bảng (Bookmarks)</h2>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Chèn các điểm đánh dấu cho bảng. Add-in sẽ chèn danh sách dữ liệu vào vị trí này.</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {bookmarks.map((bm) => (
               <button
                 key={bm.id}
                 onClick={() => insertBookmark(bm.id, bm.label)}
                 className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
               >
                  <div className="p-2 bg-muted rounded-lg mb-2 group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                    <bm.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">{bm.label}</span>
               </button>
             ))}
          </div>
        </section>

        {/* Participant Tables Section */}
        <section className="space-y-4 pt-6">
          <div className="border-l-4 border-teal-500 pl-4">
            <h2 className="text-sm font-black text-teal-600 uppercase tracking-widest">Bảng Thành phần tham gia (No Border)</h2>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Tự động chèn bảng ẩn viền với 2 cột. Xưng hô Ông/Bà tự nhận diện từ tên đã cấu hình trong Tab <strong>Ký hồ sơ</strong>.</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => insertParticipantTable('cdt')}
              className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-2 bg-muted rounded-lg mb-2 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Bảng Chủ Đầu Tư</span>
            </button>
            <button
              onClick={() => insertParticipantTable('tc')}
              className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-2 bg-muted rounded-lg mb-2 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Bảng Thi Công</span>
            </button>
            <button
              onClick={() => insertParticipantTable('tv')}
              className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-2 bg-muted rounded-lg mb-2 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">Bảng Tư Vấn</span>
            </button>
          </div>
        </section>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start space-x-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <Layout size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Hướng dẫn sử dụng</h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            1. Đặt con trỏ vào vị trí mong muốn trong file Word mẫu.<br/>
            2. Nhấn vào các nút ở trên để chèn Trường dữ liệu hoặc Vùng dữ liệu.<br/>
            3. Lưu file Word này lại và sử dụng làm mẫu để xuất hồ sơ.
          </p>
        </div>
      </div>
    </div>
  );
};
