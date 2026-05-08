import React, { useState, useRef } from 'react';
import { FileText, Download, Eye, Play, CheckCircle2, AlertTriangle, X, Settings2, Sparkles } from 'lucide-react';
// @ts-ignore
import { renderAsync } from 'docx-preview';
import { TemplateService } from '../services/templateService';
import { AiService } from '../services/AiService';

const recordTypes = [
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
  "Biên bản thử sáng và vận hành hệ thống",
  "Nhật ký thi công điện chiếu sáng",
  "Biên bản nghiệm thu hoàn thành công trình"
];

export const RecordsModule: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  const [selectedType, setSelectedType] = useState(recordTypes[6]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Record-specific data
  const [formData, setFormData] = useState({
    projectName: 'Dự án Chiếu sáng Công cộng Quận 1',
    investor: 'UBND Quận 1',
    contractor: 'Công ty Cổ phần Cơ điện ABC',
    supervisor: 'Công ty Tư vấn Giám sát XYZ',
    recordNumber: 'NTCV-2026-001',
    location: 'Đường Lê Lợi, Quận 1, TP.HCM',
    inspectionDate: '2026-05-05',
    workItemName: 'Lắp dựng cột đèn H=8m tuyến lộ 1',
    quantity: '24 Cột',
    technicalStandard: 'TCVN 4474:1987',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    setIsGenerating(true);
    // @ts-ignore
    if (window.Office && window.Word) {
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
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedType === type ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-accent'
                  }`}
                >
                  {type}
                </button>
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

      {/* Preview Modal (Full Screen Overlay) */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
          <div className="bg-muted w-full h-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-card border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Preview: {selectedType}</h3>
                  <p className="text-xs text-muted-foreground">Word Online View</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  <Download size={14} className="mr-2" /> Tải về (.docx)
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-500 p-8 flex justify-center">
              <div 
                ref={previewContainerRef}
                className="w-full max-w-[800px] min-h-full shadow-2xl"
              >
                {/* docx-preview will render here */}
                {isGenerating && (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Refresh icon for the spinner
const RefreshCw = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
);
