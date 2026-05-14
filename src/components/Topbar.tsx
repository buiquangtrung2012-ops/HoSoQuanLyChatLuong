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
            <button 
              onClick={() => alert("CLICKED VERSION: " + CURRENT_VERSION)}
              className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tighter"
            >
              {CURRENT_VERSION}
            </button>

            {/* Global Fill Data Button - ULTRA SIMPLE TEST */}
            <button
              onClick={() => {
                alert("BẮT ĐẦU ĐỔ DỮ LIỆU...");
                WordApiService.fillDataToDocument();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"
            >
              ĐỔ DỮ LIỆU
            </button>

            {/* Update / Version Manager button */}
            <button
              disabled={isChecking}
              onClick={async () => {
                await checkUpdates();
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
            >
              <RefreshCw size={18} className={`mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Cập nhật
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
