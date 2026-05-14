import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Zap, Trash2 } from 'lucide-react';
import { useVersionManager, VersionModal, CURRENT_VERSION } from './VersionManager';
import { StorageService } from '../services/storageService';

export const Topbar: React.FC = () => {
  const { changelog, hasUpdate, isChecking, checkUpdates } = useVersionManager();
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Clear status after 5 seconds
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  const handleClearAll = () => {
    if (window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XOÁ TẤT CẢ DỮ LIỆU?\n\nHành động này sẽ xoá sạch toàn bộ thông tin dự án, nhân sự, nhật ký... và không thể hoàn tác.")) {
      StorageService.clearAll();
    }
  };

  return (
    <>
    <div className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10 gap-2">
      <div className="flex items-center flex-1 min-w-0 max-w-[400px] gap-4">
        <div className="relative flex-1 max-w-[160px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm..."
            spellCheck={false}
            className="w-full pl-9 pr-3 py-1.5 bg-accent/50 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        {/* Real-time Status Message */}
        {statusMsg && (
          <div className="text-[10px] font-medium text-primary bg-primary/5 px-3 py-1 rounded-md animate-in fade-in slide-in-from-left-2 duration-300 truncate">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tighter">
          {CURRENT_VERSION}
        </span>

        {/* Clear All Button */}
        <button
          onClick={handleClearAll}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 shadow-sm"
          title="Xoá tất cả dữ liệu"
        >
          <Trash2 size={16} />
        </button>

        {/* Global Fill Data Button */}
        <button
          onClick={async () => {
            if ((window as any).WordApiService) {
              await (window as any).WordApiService.fillDataToDocument(setStatusMsg);
            }
          }}
          className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs font-bold shadow-md cursor-pointer"
        >
          <Zap size={14} className="mr-1.5" />
          <span>ĐỔ DỮ LIỆU</span>
        </button>

        {/* Update / Version Manager button */}
        <button
          id="btn-version-manager"
          disabled={isChecking}
          onClick={async () => {
            await checkUpdates();
            setShowModal(true);
          }}
          className="relative flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-xs font-medium disabled:opacity-70 cursor-pointer"
        >
          <RefreshCw size={16} className={`mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? '...' : 'Cập nhật'}
          {hasUpdate && !isChecking && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"
              style={{ animation: 'pulse-badge 1.5s infinite' }}
            />
          )}
        </button>
      </div>
    </div>

    {showModal && (
      <VersionModal 
        changelog={changelog}
        onClose={() => setShowModal(false)} 
      />
    )}

    <style>{`
      @keyframes ping {
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      @keyframes pulse-badge {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
    `}</style>
    </>
  );
};
