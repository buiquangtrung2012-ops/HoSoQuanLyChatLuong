import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Play, CheckCircle2, AlertTriangle, X, Settings2, Sparkles, RefreshCw, Trash2, RotateCcw, User, Layers, Package, Truck, FlaskConical } from 'lucide-react';
import { AiService } from '../services/AiService';
import { StorageService } from '../services/storageService';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const RecordsModule: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [recordTypes, setRecordTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Source data for auto-fill
  const [workItems, setWorkItems] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);

  useEffect(() => {
    const records = StorageService.getRecordTypes();
    setRecordTypes(records);
    if (records.length > 0) setSelectedType(records[0]);

    // Load source data
    setWorkItems(StorageService.getWorkItems());
    setPersonnel(StorageService.get('hoso_personnel') || []);
    setMaterials(StorageService.get('hoso_materials') || []);
    setEquipment(StorageService.get('hoso_equipment') || []);
    setLabs(StorageService.get('hoso_labs') || []);
  }, []);

  const handleDeleteRecord = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa mẫu "${type}"?`)) {
      const updated = recordTypes.filter(t => t !== type);
      StorageService.saveRecordTypes(updated);
      setRecordTypes(updated);
      if (selectedType === type && updated.length > 0) setSelectedType(updated[0]);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Bạn có muốn khôi phục danh sách hồ sơ mặc định?')) {
      localStorage.removeItem('hoso_custom_records');
      const defaults = StorageService.getRecordTypes();
      setRecordTypes(defaults);
      setSelectedType(defaults[0]);
    }
  };

  // Record-specific data
  const [formData, setFormData] = useState({
    projectName: 'Dự án Chiếu sáng Công cộng Quận 1',
    investor: 'UBND Quận 1',
    contractor: 'Công ty Cổ phần Cơ điện ABC',
    recordNumber: 'NTCV-2026-001',
    content: 'Lắp dựng cột đèn H=8m tuyến lộ 1',
    inspectionDate: '05/05/2026',
    standard: 'TCVN 4474:1987',
    // Dynamic fields
    workName: '',
    workCode: '',
    workLine: '',
    workCategory: '',
    workQty: '',
    workUnit: '',
    staffName: '',
    staffPosition: '',
    staffUnit: '',
    matName: '',
    matSource: '',
    matLot: '',
    matQty: '',
    equipName: '',
    equipSerial: '',
    equipExpiry: '',
    labName: '',
    labCode: '',
    labExpiry: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fillWorkData = (item: any) => {
    setFormData(prev => ({
      ...prev,
      content: item.name,
      workName: item.name,
      workCode: item.code,
      workLine: item.line,
      workCategory: item.category,
      workQty: item.quantity.toString(),
      workUnit: item.unit,
      inspectionDate: item.inspectionDate.split('-').reverse().join('/')
    }));
  };

  const fillStaffData = (item: any) => {
    setFormData(prev => ({
      ...prev,
      staffName: item.name,
      staffPosition: item.position,
      staffUnit: item.unit
    }));
  };

  const fillMaterialData = (item: any) => {
    setFormData(prev => ({
      ...prev,
      matName: item.name,
      matSource: item.source,
      matLot: item.lot,
      matQty: item.qty
    }));
  };

  const fillEquipData = (item: any) => {
    setFormData(prev => ({
      ...prev,
      equipName: item.name,
      equipSerial: item.serial,
      equipExpiry: item.expiry
    }));
  };

  const fillLabData = (item: any) => {
    setFormData(prev => ({
      ...prev,
      labName: item.name,
      labCode: item.code,
      labExpiry: item.expiry
    }));
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    // @ts-ignore
    const isWordHost = window.Office && window.Office.context && (window.Office.context.host === 'Word' || window.Office.context.host === 'WordOnline');
    // @ts-ignore
    const isWordApi = typeof Word !== 'undefined';

    if (isWordHost || isWordApi) {
      // @ts-ignore
      Word.run(async (context) => {
        const contentControls = context.document.contentControls;
        contentControls.load('items');
        await context.sync();

        for (let item of contentControls.items) {
          const tag = item.tag;
          if (formData[tag as keyof typeof formData]) {
            item.insertText(formData[tag as keyof typeof formData], 'Replace');
          }
        }

        await context.sync();
        setIsGenerating(false);
        alert('Đã xuất dữ liệu ra file Word thành công!');
      }).catch(err => {
        console.error(err);
        setIsGenerating(false);
        alert('Có lỗi xảy ra khi tương tác với Word.');
      });
    } else {
      setIsGenerating(false);
      alert('Đang ở chế độ Web. Tính năng điền dữ liệu tự động yêu cầu mở trong Microsoft Word.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight uppercase">Hồ sơ chất lượng</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleResetDefaults}
            className="flex items-center px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-all text-sm font-medium"
            title="Khôi phục các mẫu biên bản mặc định"
          >
            <RotateCcw size={18} className="mr-2" /> Khôi phục
          </button>
          <button 
            onClick={() => setActiveTab('records_config')}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-accent transition-all text-sm font-medium"
          >
            <Settings2 size={18} className="mr-2" /> Cấu hình mẫu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center">
              <FileText size={16} className="mr-2" /> Danh mục Hồ sơ
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-sm">
              {recordTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 group">
                  <button
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between border ${
                      selectedType === type 
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20' 
                        : 'bg-card border-transparent hover:border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-[12px] font-bold leading-snug">{type}</span>
                    {selectedType === type && <Play size={14} className="flex-shrink-0 ml-2" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteRecord(e, type);
                    }}
                    className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 border border-transparent hover:border-destructive/20"
                    title="Xóa mẫu biên bản này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl border border-primary/10 p-4 space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center">
              <Sparkles size={16} className="mr-2" /> Lấy dữ liệu nhanh
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center mb-1">
                  <Layers size={12} className="mr-1" /> Chọn Công việc
                </label>
                <select 
                  className="w-full p-2 bg-background border rounded-lg text-xs"
                  onChange={(e) => {
                    const item = workItems.find(w => w.id === e.target.value);
                    if (item) fillWorkData(item);
                  }}
                >
                  <option value="">-- Chọn công việc --</option>
                  {workItems.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center mb-1">
                  <User size={12} className="mr-1" /> Chọn Nhân sự
                </label>
                <select 
                  className="w-full p-2 bg-background border rounded-lg text-xs"
                  onChange={(e) => {
                    const item = personnel.find(p => p.id === e.target.value);
                    if (item) fillStaffData(item);
                  }}
                >
                  <option value="">-- Chọn nhân sự --</option>
                  {personnel.map(p => <option key={p.id} value={p.id}>{p.name} - {p.position}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center mb-1">
                  <Package size={12} className="mr-1" /> Chọn Vật liệu
                </label>
                <select 
                  className="w-full p-2 bg-background border rounded-lg text-xs"
                  onChange={(e) => {
                    const item = materials[parseInt(e.target.value)];
                    if (item) fillMaterialData(item);
                  }}
                >
                  <option value="">-- Chọn vật liệu --</option>
                  {materials.map((m, i) => <option key={i} value={i}>{m.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center mb-1">
                  <Truck size={12} className="mr-1" /> Chọn Máy móc
                </label>
                <select 
                  className="w-full p-2 bg-background border rounded-lg text-xs"
                  onChange={(e) => {
                    const item = equipment[parseInt(e.target.value)];
                    if (item) fillEquipData(item);
                  }}
                >
                  <option value="">-- Chọn máy móc --</option>
                  {equipment.map((e, i) => <option key={i} value={i}>{e.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center mb-1">
                  <FlaskConical size={12} className="mr-1" /> Chọn PTN
                </label>
                <select 
                  className="w-full p-2 bg-background border rounded-lg text-xs"
                  onChange={(e) => {
                    const item = labs[parseInt(e.target.value)];
                    if (item) fillLabData(item);
                  }}
                >
                  <option value="">-- Chọn PTN --</option>
                  {labs.map((l, i) => <option key={i} value={i}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm space-y-6">
            <div className="border-b pb-4 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold text-primary">{selectedType}</h2>
                <p className="text-xs text-muted-foreground mt-1">Thông tin chi tiết biên bản sẽ được điền vào các Content Control tương ứng.</p>
              </div>
              <button 
                onClick={handleExport}
                disabled={isGenerating}
                className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold disabled:opacity-50 text-sm"
              >
                {isGenerating ? <RefreshCw size={18} className="mr-2 animate-spin" /> : <Download size={18} className="mr-2" />}
                {isGenerating ? "Đang xử lý..." : "Xuất File Word"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Project Info */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Tên dự án</label>
                <input name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Số biên bản</label>
                <input name="recordNumber" value={formData.recordNumber} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Ngày nghiệm thu</label>
                <input name="inspectionDate" value={formData.inspectionDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-background text-xs" />
              </div>

              {/* Work Details */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-primary">Tên công việc</label>
                <input name="workName" value={formData.workName} onChange={handleInputChange} className="w-full p-2 border border-primary/30 rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-primary">Khối lượng</label>
                <div className="flex space-x-1">
                  <input name="workQty" value={formData.workQty} onChange={handleInputChange} className="flex-1 p-2 border border-primary/30 rounded-lg bg-background text-xs" />
                  <input name="workUnit" value={formData.workUnit} onChange={handleInputChange} className="w-16 p-2 border border-primary/30 rounded-lg bg-background text-xs" placeholder="ĐVT" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-primary">Tiêu chuẩn áp dụng</label>
                <input name="standard" value={formData.standard} onChange={handleInputChange} className="w-full p-2 border border-primary/30 rounded-lg bg-background text-xs" />
              </div>

              {/* Personnel */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-orange-600">Họ tên nhân sự</label>
                <input name="staffName" value={formData.staffName} onChange={handleInputChange} className="w-full p-2 border border-orange-200 rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-orange-600">Chức vụ</label>
                <input name="staffPosition" value={formData.staffPosition} onChange={handleInputChange} className="w-full p-2 border border-orange-200 rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-orange-600">Đơn vị</label>
                <input name="staffUnit" value={formData.staffUnit} onChange={handleInputChange} className="w-full p-2 border border-orange-200 rounded-lg bg-background text-xs" />
              </div>

              {/* Materials */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-green-600">Vật liệu</label>
                <input name="matName" value={formData.matName} onChange={handleInputChange} className="w-full p-2 border border-green-200 rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-green-600">Nguồn gốc/Lô</label>
                <input name="matSource" value={formData.matSource} onChange={handleInputChange} className="w-full p-2 border border-green-200 rounded-lg bg-background text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase text-green-600">Số lượng VL</label>
                <input name="matQty" value={formData.matQty} onChange={handleInputChange} className="w-full p-2 border border-green-200 rounded-lg bg-background text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
