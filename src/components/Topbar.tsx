import React, { useState } from 'react';
import { Search, RefreshCw, Zap } from 'lucide-react';
import { useVersionManager, VersionModal, CURRENT_VERSION } from './VersionManager';
import { WordApiService } from '../services/wordApiService';

export const Topbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { changelog, hasUpdate, isChecking, checkUpdates } = useVersionManager();

  return (
    <>
      <div className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            spellCheck={false}
            className="w-full pl-10 pr-4 py-2 bg-accent/50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span 
              onClick={() => alert("Version Badge Clicked! Version: " + CURRENT_VERSION)}
              className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tighter cursor-help"
            >
              {CURRENT_VERSION}
            </span>

            {/* Global Fill Data Button */}
            <button
              id="btn-fill-data-global"
              onClick={async (e) => {
                e.stopPropagation();
                alert("Đã nhấn nút Đổ dữ liệu (Global)");
                try {
                  await WordApiService.fillDataToDocument();
                } catch (err: any) {
                  alert("Lỗi thực thi: " + err.message);
                }
              }}
              className="relative z-50 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-bold shadow-md shadow-green-600/20 gap-2 cursor-pointer"
            >
              <Zap size={16} className="pointer-events-none" /> 
              <span className="hidden lg:inline pointer-events-none">Đổ dữ liệu</span>
              <span className="lg:hidden pointer-events-none">Đổ</span>
            </button>

            {/* Update / Version Manager button with pulsing badge when update available */}
            <button
              id="btn-version-manager"
              disabled={isChecking}
              onClick={async () => {
                await checkUpdates();
                setShowModal(true);
              }}
              className="relative flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all text-sm font-medium disabled:opacity-70"
            >
              <RefreshCw size={18} className={`mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Đang kiểm tra...' : 'Cập nhật'}
              {hasUpdate && !isChecking && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center"
                  style={{ animation: 'pulse-badge 1.5s infinite' }}
                >
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" style={{ animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Version Manager Modal */}
      {showModal && (
        <VersionModal changelog={changelog} onClose={() => setShowModal(false)} />
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
