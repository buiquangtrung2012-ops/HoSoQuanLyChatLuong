import React, { useState } from 'react';
import { Download, FolderOpen, RefreshCw, Files, FileCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const ExportModule: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [savePath, setSavePath] = useState('');

  const handleSelectFolder = async () => {
    try {
      // @ts-ignore
      if (window.showDirectoryPicker) {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker();
        setSavePath(dirHandle.name);
      } else {
        alert("Trình duyệt không hỗ trợ chọn thư mục. Vui lòng dùng Edge hoặc Chrome mới nhất.");
      }
    } catch (err) {
      console.log('User cancelled folder selection.', err);
    }
  };

  const handleExport = async () => {
    setIsGenerating(true);
    const participants = StorageService.get('hoso_participants') || {};

    // @ts-ignore
    const isWordApi = typeof Word !== 'undefined';

    if (isWordApi) {
      // @ts-ignore
      Word.run(async (context: any) => {
        const contentControls = context.document.contentControls;
        contentControls.load('items/tag,items/cannotEdit');
        await context.sync();

        let count = 0;
        for (const item of contentControls.items) {
          const tag = item.tag;
          if (participants[tag] && !item.cannotEdit) {
            item.insertText(participants[tag], 'Replace');
            count++;
          }
        }

        await context.sync();
        setIsGenerating(false);
        alert(`Đã điền dữ liệu vào ${count} trường trong file Word thành công!`);
      }).catch((err: any) => {
        console.error(err);
        setIsGenerating(false);
        alert('Có lỗi khi tương tác với Word: ' + err.message);
      });
    } else {
      setIsGenerating(false);
      alert('Đang ở chế độ Web. Tính năng này yêu cầu mở trong Microsoft Word.');
    }
  };

  const handleBatchExport = async () => {
    // @ts-ignore
    if (typeof Office === 'undefined') {
        alert("Tính năng này chỉ hoạt động trong Microsoft Word.");
        return;
    }

    setIsBatchGenerating(true);
    try {
        const workItems = StorageService.getWorkItems() || [];
        if (workItems.length === 0) {
            alert("Không có danh sách công việc để xuất hàng loạt.");
            setIsBatchGenerating(false);
            return;
        }

        const project = StorageService.getProject() || {};
        const participants = StorageService.get('hoso_participants') || {};

        // 1. Get current document as a Template (Base64)
        // @ts-ignore
        Office.context.document.getFileAsync(Office.FileType.Compressed, { sliceSize: 1024 * 1024 }, async (result: any) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const myFile = result.value;
                const slicesCount = myFile.sliceCount;
                let fileData: number[] = [];

                const getSlice = (sliceIndex: number) => {
                    myFile.getSliceAsync(sliceIndex, (sliceResult: any) => {
                        if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
                            fileData = fileData.concat(sliceResult.value.data);
                            if (sliceIndex + 1 < slicesCount) {
                                getSlice(sliceIndex + 1);
                            } else {
                                // All slices collected
                                generateZip(new Uint8Array(fileData), workItems, project, participants);
                                myFile.closeAsync();
                            }
                        } else {
                            setIsBatchGenerating(false);
                            alert("Lỗi khi đọc dữ liệu file Word.");
                            myFile.closeAsync();
                        }
                    });
                };
                getSlice(0);
            } else {
                setIsBatchGenerating(false);
                alert("Không thể truy cập file Word hiện tại.");
            }
        });
    } catch (err: any) {
        console.error(err);
        setIsBatchGenerating(false);
        alert("Lỗi xuất hàng loạt: " + err.message);
    }
  };

  const generateZip = async (templateData: Uint8Array, workItems: any[], project: any, participants: any) => {
    try {
        const zip = new PizZip();
        
        for (const work of workItems) {
            const content = new PizZip(templateData);
            const doc = new Docxtemplater(content, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const data = {
                projectName: project.name || '',
                contractNumber: project.contractNumber || '',
                packageName: project.packageName || '',
                contractor: project.contractor || '',
                investorRep: project.investor || '',
                designRep: project.designer || '',
                projectLocation: project.location || '',
                workName: work.name || '',
                workCode: work.code || '',
                workLine: work.line || '',
                workCategory: work.category || '',
                workQty: work.quantity?.toString() || '',
                workUnit: work.unit || '',
                workInspectDate: work.inspectionDate?.split('-').reverse().join('/') || '',
                ...participants
            };

            doc.render(data);
            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            
            const fileName = `BB_NghiemThu_${work.code || 'CV'}_${work.name.substring(0, 30).replace(/[/\\?%*:|"<>]/g, '-')}.docx`;
            zip.file(fileName, out);
        }

        const finalZip = zip.generate({ type: "blob" });
        saveAs(finalZip, `HoSo_NghiemThu_HangLoat_${new Date().getTime()}.zip`);
        setIsBatchGenerating(false);
        alert("Đã tạo bộ hồ sơ hàng loạt thành công! Vui lòng kiểm tra thư mục Tải về.");
    } catch (err: any) {
        console.error(err);
        setIsBatchGenerating(false);
        alert("Lỗi khi tạo file ZIP: " + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <Download size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight uppercase">Xuất Hồ Sơ</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Export Card */}
        <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-sm flex flex-col space-y-4 hover:border-primary/30 transition-all">
          <div className="flex items-center space-x-2 text-primary">
            <FileCheck size={20} />
            <h3 className="font-bold uppercase tracking-wide text-sm">Xuất File Hiện Tại</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Điền dữ liệu từ <strong>Ký hồ sơ</strong> và <strong>Dự án</strong> vào trực tiếp file Word bạn đang mở. Thích hợp để in nhanh một biên bản.
          </p>
          <div className="pt-4 mt-auto">
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold text-sm gap-2 disabled:opacity-50"
            >
              {isGenerating
                ? <><RefreshCw size={18} className="animate-spin" /> Đang xử lý...</>
                : <><Download size={18} /> Xuất File Word</>
              }
            </button>
          </div>
        </div>

        {/* Batch Export Card */}
        <div className="bg-card rounded-2xl border-2 border-indigo-500/20 p-6 shadow-sm flex flex-col space-y-4 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Files size={20} />
            <h3 className="font-bold uppercase tracking-wide text-sm">Xuất Hàng Loạt (Mailings)</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tự động tạo biên bản cho <strong>TẤT CẢ</strong> công việc trong danh sách. Kết quả sẽ được nén vào một file ZIP để bạn tải về máy.
          </p>
          <div className="pt-4 mt-auto">
            <button
              onClick={handleBatchExport}
              disabled={isBatchGenerating}
              className="w-full flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm gap-2 disabled:opacity-50"
            >
              {isBatchGenerating
                ? <><RefreshCw size={18} className="animate-spin" /> Đang tạo ZIP...</>
                : <><Files size={18} /> Xuất Toàn Bộ Công Việc</>
              }
            </button>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-2xl p-5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Hướng dẫn lưu trữ</h4>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectFolder}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-background transition-all text-xs font-semibold bg-muted/50 gap-2"
          >
            <FolderOpen size={16} />
            <span className="truncate max-w-[200px]">{savePath || 'Chọn thư mục lưu dự kiến'}</span>
          </button>
          <p className="text-[10px] text-muted-foreground italic">
            * Tính năng chọn thư mục chỉ để ghi nhớ vị trí lưu, file sẽ tải về theo cài đặt của trình duyệt.
          </p>
        </div>
      </div>
    </div>
  );
};
