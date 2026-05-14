import React, { useState } from 'react';
import { Search, RefreshCw, Zap } from 'lucide-react';
import { useVersionManager, VersionModal, CURRENT_VERSION } from './VersionManager';
import { WordApiService } from '../services/wordApiService';

export const Topbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { changelog, hasUpdate, isChecking, checkUpdates } = useVersionManager();

  return (
    <>
    <div className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10 gap-2">
      {/* DIAGNOSTIC BUTTON - VERY LEFT */}
      <button 
        onClick={() => {
          alert("TOPBAR TEST CLICK!");
          if ((window as any).WordApiService) {
            (window as any).WordApiService.fillDataToDocument();
          } else {
            alert("WordApiService NOT FOUND on window!");
          }
        }}
        className="px-2 py-1 bg-red-600 text-white text-[10px] rounded z-[9999]"
      >
        TEST CLICK
      </button>

      <div className="relative flex-1 min-w-0 max-w-[160px]">
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

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-tighter">
            {CURRENT_VERSION}
          </span>

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
            {isChecking ? 'Đang...' : 'Cập nhật'}
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
