import React, { useState } from 'react';
import { Download, FolderOpen, RefreshCw } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const ExportModule: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
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
        contentControls.load('items');
        await context.sync();

        for (const item of contentControls.items) {
          const tag = item.tag;
          if (participants[tag]) {
            item.insertText(participants[tag], 'Replace');
          }
        }

        await context.sync();
        setIsGenerating(false);
        alert('Đã điền dữ liệu vào file Word thành công!');
        if (savePath) {
          alert(`Hãy bấm Ctrl+S để lưu vào thư mục: ${savePath}`);
        }
      }).catch((err: any) => {
        console.error(err);
        setIsGenerating(false);
        alert('Có lỗi khi tương tác với Word.');
      });
    } else {
      setIsGenerating(false);
      alert('Đang ở chế độ Web. Tính năng này yêu cầu mở trong Microsoft Word.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight uppercase">Xuất file</h1>

      <div className="bg-card rounded-xl border p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px] space-y-6">
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Dữ liệu thành phần tham gia sẽ được tự động lấy từ tab <strong>Ký hồ sơ</strong> và điền vào các Content Control trong file Word đang mở.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={handleSelectFolder}
            className="flex-1 flex items-center justify-center px-5 py-3 border-2 rounded-xl hover:bg-accent transition-all text-sm font-semibold bg-background gap-2"
          >
            <FolderOpen size={20} />
            <span className="truncate max-w-[140px]">{savePath || 'Chọn thư mục lưu'}</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold text-sm gap-2 disabled:opacity-50"
          >
            {isGenerating
              ? <><RefreshCw size={20} className="animate-spin" /> Đang xử lý...</>
              : <><Download size={20} /> Xuất File Word</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
