import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Clock, ChevronDown, ChevronUp, CheckCircle, ArrowLeft } from 'lucide-react';

// The current app version — must match what's in Topbar.tsx
export const CURRENT_VERSION = 'v14052026.1108';

interface VersionEntry {
  version: string;
  date: string;
  changes: string[];
  path: string;
}

interface Changelog {
  latest: string;
  versions: VersionEntry[];
}

interface VersionManagerProps {
  onOpenModal?: () => void;
}

export const useVersionManager = () => {
  const [changelog, setChangelog] = useState<Changelog | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChangelog = async () => {
      setLoading(true);
      try {
        const base = import.meta.env.BASE_URL || '/';
        const url = `${base}changelog.json?v=${Date.now()}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data: Changelog = await res.json();
        setChangelog(data);
        setHasUpdate(data.latest !== CURRENT_VERSION);
      } catch {
        // Silently fail — offline or local dev
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  return { changelog, hasUpdate, loading };
};

interface VersionModalProps {
  changelog: Changelog | null;
  onClose: () => void;
}

export const VersionModal: React.FC<VersionModalProps> = ({ changelog, onClose }) => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const toggleExpand = (version: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });
  };

  const handleUpdateNow = () => {
    const url = new URL(window.location.href);
    // Navigate to root path with cache-bust
    const rootPath = import.meta.env.BASE_URL || '/';
    window.location.href = `${rootPath}?v=${Date.now()}`;
  };

  const handleRollback = (path: string) => {
    const base = window.location.origin;
    window.location.href = `${base}${path}?v=${Date.now()}`;
  };

  const latestEntry = changelog?.versions[0];
  const olderVersions = changelog?.versions.slice(1) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(220,30%,13%) 0%, hsl(220,25%,18%) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <RefreshCw size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Quản lý Phiên bản</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Đang dùng: <span className="text-indigo-400 font-mono font-semibold">{CURRENT_VERSION}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Latest version */}
          {latestEntry && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">{latestEntry.version}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc' }}>MỚI NHẤT</span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{latestEntry.date}</p>
                </div>
                {CURRENT_VERSION !== latestEntry.version && (
                  <button
                    onClick={handleUpdateNow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  >
                    <RefreshCw size={12} />
                    Cập nhật ngay
                  </button>
                )}
                {CURRENT_VERSION === latestEntry.version && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle size={14} />
                    Đang dùng
                  </div>
                )}
              </div>
              <ul className="space-y-1.5">
                {latestEntry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Older versions */}
          {olderVersions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Phiên bản cũ hơn</span>
              </div>
              <div className="space-y-2">
                {olderVersions.map(entry => (
                  <div
                    key={entry.version}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleExpand(entry.version)}
                          className="flex items-center gap-2 text-xs"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {expandedVersions.has(entry.version) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          <span className="font-mono font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>{entry.version}</span>
                          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{entry.date}</span>
                        </button>
                        {CURRENT_VERSION === entry.version && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>Đang dùng</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRollback(entry.path)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all hover:bg-white/10"
                        style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <ArrowLeft size={11} />
                        Dùng bản này
                      </button>
                    </div>
                    {expandedVersions.has(entry.version) && (
                      <div className="px-4 pb-3 pt-1 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        {entry.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs list-none" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <span className="mt-1 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                            {change}
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!changelog && (
            <div className="py-8 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <RefreshCw size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">Không thể tải thông tin phiên bản.<br />Kiểm tra kết nối mạng.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Dữ liệu người dùng (localStorage) không bị ảnh hưởng khi rollback.
          </p>
        </div>
      </div>
    </div>
  );
};
