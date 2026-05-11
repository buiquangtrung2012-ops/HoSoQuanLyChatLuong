import React, { useState, useEffect } from 'react';
import { 
  FileText, Hash, Briefcase, Building2, User, Users, Calendar, Plus, Save, 
  Layers, Layout, MapPin, Package, Truck, FlaskConical, RefreshCw, Trash2, Zap,
  PenLine, X, CheckSquare, Square
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

// Parties available for signature table
const SIGNATURE_PARTIES = [
  { id: 'cdt',  label: 'Đại diện Chủ đầu tư',          short: 'ĐẠI DIỆN CHỦ ĐẦU TƯ' },
  { id: 'tvtk', label: 'Đại diện Tư vấn Thiết kế',       short: 'ĐẠI DIỆN TƯ VẤN THIẾT KẾ' },
  { id: 'tc',   label: 'Đại diện Đơn vị Thi công',       short: 'ĐẠI DIỆN ĐƠN VỊ THI CÔNG' },
  { id: 'tv',   label: 'Đại diện Tư vấn Giám sát',       short: 'ĐẠI DIỆN TƯ VẤN GIÁM SÁT' },
];

export const TemplateModule: React.FC = () => {
  const [recordName, setRecordName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customRecords, setCustomRecords] = useState<string[]>([]);
  const [showSigModal, setShowSigModal] = useState(false);
  const [selectedParties, setSelectedParties] = useState<string[]>(['cdt', 'tvtk', 'tc']);

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
      for (const item of ccs.items) {
        const val = allData[item.tag];
        if (val !== undefined && val !== '') {
          item.insertText(val, 'Replace');
          filled++;
        }
      }
      await context.sync();
      alert(`Đã cập nhật ${filled}/${ccs.items.length} trường trong tài liệu!`);
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
    const signers: any[] = group ? group.signers : Array(rowCount).fill({ name: '', gender: 'auto' });

    // @ts-ignore
    Word.run(async (context: any) => {
      const range = context.document.getSelection();
      const table = range.insertTable(rowCount, 2, 'After');
      table.style = 'Table Normal';
      table.load('id');
      await context.sync();

      for (let i = 0; i < rowCount; i++) {
        const signer = signers[i] || {};
        const honorific = resolveGender(signer.name || '', signer.gender) + ': ';

        const nameCell = table.getCell(i, 0);
        nameCell.body.clear();
        nameCell.body.getRange('Start').insertText(honorific, 'Replace');
        await context.sync();
        const nameCC = nameCell.body.getRange('End').insertContentControl();
        nameCC.title = `${role.toUpperCase()} ${i + 1} - Tên`;
        nameCC.tag = `${role}${i + 1}_name`;
        nameCC.placeholderText = '[Họ tên]';
        nameCC.appearance = 'BoundingBox';

        const posCell = table.getCell(i, 1);
        posCell.body.clear();
        posCell.body.getRange('Start').insertText('Chức vụ: ', 'Replace');
        await context.sync();
        const posCC = posCell.body.getRange('End').insertContentControl();
        posCC.title = `${role.toUpperCase()} ${i + 1} - Chức vụ`;
        posCC.tag = `${role}${i + 1}_pos`;
        posCC.placeholderText = '[Chức vụ]';
        posCC.appearance = 'BoundingBox';
      }
      table.getRange('After').select();
      await context.sync();
      alert(`Đã chèn bảng Thành phần tham gia (${role.toUpperCase()}) với ${rowCount} người!`);
    }).catch((err: any) => alert('Lỗi khi chèn bảng: ' + err.message));
  };

  const insertSignatureTable = () => {
    if (!isWordApiAvailable()) {
      alert('Chức năng này chỉ hoạt động khi mở trong Microsoft Word.');
      return;
    }
    const project = StorageService.getProject() || {};
    const isJV = project.isJointVenture;
    const jvMembers: string[] = project.contractorMembers || [];

    // Build flat list of all "units" to show in columns
    const columns: { header: string; sub: string }[] = [];
    selectedParties.forEach(pid => {
      const party = SIGNATURE_PARTIES.find(p => p.id === pid);
      if (pid === 'tc' && isJV && jvMembers.length > 0) {
        jvMembers.forEach(m => {
          columns.push({ header: party?.short || '', sub: m.toUpperCase() });
        });
      } else {
        // Lấy tên đơn vị thực tế từ tab Dự án
        let actualName = '';
        if (pid === 'cdt') actualName = project.investor || '';
        if (pid === 'tc' && !isJV) actualName = project.contractor || '';
        if (pid === 'tv') actualName = project.supervisor || '';
        // Nếu không có tên đơn vị thì dùng header mặc định
        columns.push({ 
          header: party?.short || '', 
          sub: actualName.toUpperCase() 
        });
      }
    });

    // Layout: 2 columns per row
    const numCols = 2;
    const numItems = columns.length;
    const numRowsPerItem = 3; // Header, (Ký tên...), Blank space
    const totalTableRows = Math.ceil(numItems / numCols) * numRowsPerItem;

    // @ts-ignore
    Word.run(async (context: any) => {
      const range = context.document.getSelection();
      const table = range.insertTable(totalTableRows, numCols, 'After');
      table.style = 'Table Normal';
      table.alignment = 'Centered';
      
      await context.sync();

      for (let i = 0; i < numItems; i++) {
        const colIdx = i % numCols;
        const startRowIdx = Math.floor(i / numCols) * numRowsPerItem;
        const colData = columns[i];

        // Row 0: Unit Header & Sub
        const cell0 = table.getCell(startRowIdx, colIdx);
        cell0.body.clear();
        cell0.body.insertText(colData.header + (colData.sub ? "\n" + colData.sub : ""), "Replace");
        
        // Row 1: Instruction
        const cell1 = table.getCell(startRowIdx + 1, colIdx);
        cell1.body.clear();
        cell1.body.insertText('(Ký, ghi rõ họ tên và đóng dấu)', 'Replace');
      }

      await context.sync();

      // Format Paragraphs and Row Height
      for (let r = 0; r < totalTableRows; r++) {
        const row = table.rows.getItemAt(r);
        if (r % numRowsPerItem === 2) {
          row.heightRule = 'Exactly';
          row.height = 105;
        } else {
          row.heightRule = 'Auto';
        }

        for (let c = 0; c < numCols; c++) {
          const cell = table.getCell(r, c);
          const paras = cell.body.paragraphs;
          paras.load('items');
          await context.sync();
          
          paras.items.forEach((p: any) => {
            p.alignment = 'Centered';
            p.spacingBefore = 0;
            p.spacingAfter = 0;
            try { p.lineSpacingRule = 'Single'; } catch (e) {}
            
            if (r % numRowsPerItem === 0) p.font.bold = true;
            if (r % numRowsPerItem === 1) {
              p.font.italic = true;
              p.font.size = 9;
            }
          });
        }
      }

      // Hide borders
      table.borders.insideHorizontal.style = 'None';
      table.borders.insideVertical.style = 'None';
      table.borders.outsideLeft.style = 'None';
      table.borders.outsideRight.style = 'None';
      table.borders.outsideTop.style = 'None';
      table.borders.outsideBottom.style = 'None';

      await context.sync();
      table.getRange('After').select();
      await context.sync();
      setShowSigModal(false);
      alert(`Đã chèn bảng ký tên (v1450)!`);
    }).catch((err: any) => {
      console.error(err);
      alert('Lỗi chèn bảng: ' + err.message);
    });
  };


  const toggleParty = (id: string) => {
    setSelectedParties(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {contentControls.filter(cc => cc.category === category).map((cc) => (
                <button
                  key={cc.id}
                  onClick={() => insertContentControl(cc.id, cc.label)}
                  className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} className="text-primary" />
                  </div>
                  <div className="p-3 bg-muted rounded-xl mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <cc.icon size={24} />
                  </div>
                  <span className="text-sm font-bold text-center">{cc.label}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bookmarks.map((bm) => (
               <button
                 key={bm.id}
                 onClick={() => insertBookmark(bm.id, bm.label)}
                 className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
               >
                 <div className="p-3 bg-muted rounded-xl mb-4 group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                   <bm.icon size={24} />
                 </div>
                 <span className="text-sm font-bold text-center">{bm.label}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => insertParticipantTable('cdt')}
              className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-3 bg-muted rounded-xl mb-4 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={24} />
              </div>
              <span className="text-sm font-bold text-center">Bảng Chủ Đầu Tư</span>
            </button>
            <button
              onClick={() => insertParticipantTable('tc')}
              className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-3 bg-muted rounded-xl mb-4 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={24} />
              </div>
              <span className="text-sm font-bold text-center">Bảng Thi Công</span>
            </button>
            <button
              onClick={() => insertParticipantTable('tv')}
              className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all group"
            >
              <div className="p-3 bg-muted rounded-xl mb-4 group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors">
                <Users size={24} />
              </div>
              <span className="text-sm font-bold text-center">Bảng Tư Vấn</span>
            </button>
          </div>
        </section>

        {/* Signature Table Section */}
        <section className="space-y-4 pt-6">
          <div className="border-l-4 border-violet-500 pl-4">
            <h2 className="text-sm font-black text-violet-600 uppercase tracking-widest">Bảng Ký tên (Có viền – Chuẩn biên bản)</h2>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Chèn bảng ký tên đầy đủ viền, chọn các bên tham gia. Hỗ trợ Liên danh tự động tách cột.</p>
          </div>
          <button
            onClick={() => setShowSigModal(true)}
            className="flex items-center gap-3 px-6 py-4 bg-violet-600 text-white rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 font-bold text-sm"
          >
            <PenLine size={20} /> Chèn bảng Ký tên...
          </button>
        </section>

        {/* Signature Modal */}
        {showSigModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSigModal(false)}>
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><PenLine size={18} className="text-violet-600" /> Chèn bảng Ký tên</h3>
                <button onClick={() => setShowSigModal(false)} className="p-1.5 hover:bg-muted rounded-lg"><X size={18} /></button>
              </div>
              <p className="text-xs text-muted-foreground">Chọn các bên tham gia (thứ tự từ trái → phải trong bảng):</p>
              <div className="space-y-2">
                {SIGNATURE_PARTIES.map(party => {
                  const checked = selectedParties.includes(party.id);
                  return (
                    <button
                      key={party.id}
                      onClick={() => toggleParty(party.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        checked ? 'border-violet-500 bg-violet-50 text-violet-800' : 'border-border bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      {checked ? <CheckSquare size={18} className="text-violet-600 flex-shrink-0" /> : <Square size={18} className="flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-semibold">{party.label}</p>
                        <p className="text-[10px] opacity-70">{party.short}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedParties.length === 0 && (
                <p className="text-xs text-destructive font-medium">Vui lòng chọn ít nhất 1 bên tham gia.</p>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowSigModal(false)} className="flex-1 py-2.5 border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Hủy</button>
                <button
                  onClick={insertSignatureTable}
                  disabled={selectedParties.length === 0}
                  className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-50"
                >
                  Chèn vào Word
                </button>
              </div>
            </div>
          </div>
        )}
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
