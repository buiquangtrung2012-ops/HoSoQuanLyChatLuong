import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Play, CheckCircle2, AlertTriangle, X, Settings2, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
// @ts-ignore
import { renderAsync } from 'docx-preview';
import { TemplateService } from '../services/templateService';
import { AiService } from '../services/AiService';
import { StorageService } from '../services/storageService';

const defaultRecordTypes = [
  "Biên bản bàn giao mặt bằng",
  "Biên bản kiểm tra điều kiện khởi công",
  "Biên bản nghiệm thu vật liệu: Cột đèn, cần đèn",
  "Biên bản nghiệm thu vật liệu: Đèn chiếu sáng, tủ điện",
  "Biên bản nghiệm thu vật liệu: Cáp điện, vật tư phụ",
  "Biên bản nghiệm thu công việc: Đào móng, lắp dựng móng cột",
  "Biên bản nghiệm thu công việc: Lắp dựng cột đèn",
  "Biên bản nghiệm thu công việc: Rải cáp ngầm/kéo dây",
  "Biên bản nghiệm thu công việc: Lắp đặt tủ điện, đèn",
  "Biên bản thử nghiệm: Đo điện trở tiếp địa, cách điện",
  "Biên bản nghiệm thu hoàn thành công trình"
];

export const RecordsModule: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [recordTypes, setRecordTypes] = useState(defaultRecordTypes);
  const [selectedType, setSelectedType] = useState(defaultRecordTypes[6]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const custom = StorageService.getCustomRecords();
    if (custom.length > 0) {
      setRecordTypes([...defaultRecordTypes, ...custom]);
    }
  }, []);

  const handleDeleteRecord = (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    if (defaultRecordTypes.includes(type)) {
      alert('Không thể xóa các mẫu mặc định!');
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa mẫu "${type}"?`)) {
      const custom = StorageService.getCustomRecords();
      const updated = custom.filter(t => t !== type);
      StorageService.saveCustomRecords(updated);
      setRecordTypes([...defaultRecordTypes, ...updated]);
      if (selectedType === type) setSelectedType(defaultRecordTypes[0]);
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
    standard: 'TCVN 4474:1987'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    setIsGenerating(true);
    
    // Improved detection: check if window.Word is available or if Office is in Word host
    // @ts-ignore
    const isWordHost = window.Office && window.Office.context && (window.Office.context.host === 'Word' || window.Office.context.host === 'WordOnline');
    // @ts-ignore
    const isWordApi = typeof Word !== 'undefined';

    if (isWordHost || isWordApi) {
      // @ts-ignore
      Word.run(async (context) => {
        // Logic to fill content controls
        const contentControls = context.document.contentControls;
        contentControls.load('items');
        await context.sync();

        for (let item of contentControls.items) {
          if (item.tag === 'projectName') item.insertText(formData.projectName, 'Replace');
          if (item.tag === 'investor') item.insertText(formData.investor, 'Replace');
          if (item.tag === 'contractor') item.insertText(formData.contractor, 'Replace');
          if (item.tag === 'recordNumber') item.insertText(formData.recordNumber, 'Replace');
          if (item.tag === 'inspectionDate') item.insertText(formData.inspectionDate, 'Replace');
          if (item.tag === 'workItemName') item.insertText(formData.workItemName, 'Replace');
        }

        await context.sync();
        alert('Đã điền thông tin vào các Content Controls trong Word!');
      }).catch(err => {
        console.error(err);
        alert('Lỗi khi xuất file Word: ' + err.message);
      }).finally(() => {
        setIsGenerating(false);
      });
    } else {
      setTimeout(() => {
        setIsGenerating(false);
        alert('Đang ở chế độ Web. Tính năng xuất file Word thật sự yêu cầu chạy trong Microsoft Word.');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ chất lượng</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('template')}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-accent text-sm font-medium transition-colors"
          >
            <Settings2 size={18} className="mr-2" /> Cấu hình mẫu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Record Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold flex items-center">
              <FileText size={18} className="mr-2 text-primary" /> Loại hồ sơ chiếu sáng
            </h3>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar text-sm">
              {recordTypes.map((type) => (
                <div key={type} className="group relative">
                  <button
                    onClick={() => setSelectedType(type)}
                    onDoubleClick={handleExport}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                      selectedType === type 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium pr-8">{type}</span>
                    {selectedType === type && <Play size={14} className="flex-shrink-0" />}
                  </button>
                  
                  {!defaultRecordTypes.includes(type) && (
                    <button
                      onClick={(e) => handleDeleteRecord(e, type)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${
                        selectedType === type ? 'text-primary-foreground/70 hover:text-primary-foreground' : 'text-destructive hover:bg-destructive/10'
                      }`}
                      title="Xóa mẫu này"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Form and Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-lg text-primary">{selectedType}</h3>
                <p className="text-sm text-muted-foreground font-medium">Thiết lập thông tin biên bản</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tên dự án</label>
                <input name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Số biên bản</label>
                <input name="recordNumber" value={formData.recordNumber} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chủ đầu tư</label>
                <input name="investor" value={formData.investor} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Đơn vị thi công</label>
                <input name="contractor" value={formData.contractor} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nội dung nghiệm thu</label>
                <input name="workItemName" value={formData.workItemName} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ngày nghiệm thu</label>
                <input type="date" name="inspectionDate" value={formData.inspectionDate} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tiêu chuẩn áp dụng</label>
                  <button 
                    onClick={async () => {
                      const suggestions = await AiService.suggestStandards(formData.workItemName);
                      if (suggestions.length > 0) {
                        setFormData(prev => ({ ...prev, technicalStandard: suggestions[0] }));
                      }
                    }}
                    className="flex items-center text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded-full hover:bg-purple-500/20 transition-colors font-bold"
                  >
                    <Sparkles size={10} className="mr-1" /> Gợi ý AI
                  </button>
                </div>
                <input name="technicalStandard" value={formData.technicalStandard} onChange={handleInputChange} className="w-full p-2 border rounded-md text-sm bg-background focus:ring-1 focus:ring-primary outline-none" />
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end space-x-3">
              <button 
                onClick={handleExport}
                disabled={isGenerating}
                className="flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw size={18} className="mr-2 animate-spin" /> : <Play size={18} className="mr-2" />}
                {isGenerating ? "Đang xử lý..." : "Xuất File Word"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
