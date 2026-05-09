import React, { useState } from 'react';
import { 
  FileText, Hash, Briefcase, Building2, User, Users, Calendar, Plus, Save, 
  Layers, Layout, MapPin, Package, Truck, FlaskConical, RefreshCw, Trash2
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { useEffect } from 'react';

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
    // @ts-ignore
    if (window.Office && window.Word) {
      // @ts-ignore
      Word.run(async (context) => {
        const range = context.document.getSelection();
        const cc = range.insertContentControl();
        cc.title = label;
        cc.tag = id;
        cc.placeholderText = `[${label}]`;
        cc.appearance = 'BoundingBox';
        await context.sync();
      }).catch(err => {
        console.error(err);
        alert('Lỗi khi chèn Content Control vào Word.');
      });
    } else {
      alert(`Đang ở chế độ Web. Sẽ chèn: ${label} (${id})`);
    }
  };

  const insertBookmark = (id: string, label: string) => {
    // @ts-ignore
    if (window.Office && window.Word) {
      // @ts-ignore
      Word.run(async (context) => {
        const range = context.document.getSelection();
        range.insertBookmark(id);
        await context.sync();
        alert(`Đã chèn Bookmark: ${id}`);
      }).catch(err => {
        console.error(err);
        alert('Lỗi khi chèn Bookmark vào Word.');
      });
    } else {
      alert(`Đang ở chế độ Web. Sẽ chèn Bookmark: ${id}`);
    }
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
