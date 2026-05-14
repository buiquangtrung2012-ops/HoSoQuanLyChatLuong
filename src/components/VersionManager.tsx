import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Clock, CheckCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

// The current app version — must match what's in Topbar.tsx
export const CURRENT_VERSION = 'v14052026.1600';

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

export const useVersionManager = () => {
  const [changelog, setChangelog] = useState<Changelog | null>(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkUpdates = async () => {
    setIsChecking(true);
    try {
      const base = import.meta.env.BASE_URL || '/';
      const url = `${base}changelog.json?v=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Changelog = await res.json();
      setChangelog(data);
      setHasUpdate(data.latest !== CURRENT_VERSION);
      // Artificial delay for UX so user sees the "checking" state
      await new Promise(resolve => setTimeout(resolve, 800));
      return data;
    } catch (err) {
      console.error('Check update failed:', err);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial silent check
    checkUpdates();
  }, []);

  return { changelog, hasUpdate, isChecking, checkUpdates };
};

interface VersionModalProps {
  changelog: Changelog | null;
  onClose: () => void;
}

// Single bullet item renderer
const ChangeItem: React.FC<{ text: string; accent?: boolean }> = ({ text, accent }) => (
  <li
    className="flex items-start gap-2 text-xs leading-relaxed list-none"
    style={{ color: accent ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)' }}
  >
    <span
      className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ background: accent ? '#818cf8' : 'rgba(255,255,255,0.25)' }}
    />
    {text}
  </li>
);

export const VersionModal: React.FC<VersionModalProps> = ({ changelog, onClose }) => {
  // Older versions are collapsed by default — user can expand each one
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
    const rootPath = import.meta.env.BASE_URL || '/';
    window.location.href = `${rootPath}?v=${Date.now()}`;
  };

  const handleRollback = (path: string) => {
    window.location.href = `${window.location.origin}${path}?v=${Date.now()}`;
  };

  const latestEntry = changelog?.versions[0];
  const olderVersions = changelog?.versions.slice(1) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl flex flex-col"
        style={{
          background: 'linear-gradient(155deg, hsl(225,28%,14%) 0%, hsl(220,24%,19%) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              <RefreshCw size={17} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Quản lý Phiên bản</h2>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Đang dùng:&nbsp;
                <span className="text-indigo-400 font-mono font-semibold">{CURRENT_VERSION}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.4) transparent' }}
        >
          {/* Empty state */}
          {!changelog && (
            <div className="py-10 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <RefreshCw size={24} className="mx-auto mb-3 opacity-40" />
              <p className="text-xs">Không thể tải thông tin phiên bản.<br />Kiểm tra kết nối mạng.</p>
            </div>
          )}

          {/* ── Latest version card ── */}
          {latestEntry && (
            <div
              className="rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg,rgba(99,102,241,0.13),rgba(139,92,246,0.13))',
                border: '1px solid rgba(99,102,241,0.28)',
              }}
            >
              {/* Version header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-indigo-300">{latestEntry.version}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-bold tracking-wide"
                      style={{ background: 'rgba(99,102,241,0.35)', color: '#a5b4fc' }}
                    >
                      MỚI NHẤT
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    {latestEntry.date}
                  </p>
                </div>
                {CURRENT_VERSION !== latestEntry.version ? (
                  <button
                    onClick={handleUpdateNow}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                  >
                    <RefreshCw size={11} />
                    Cập nhật ngay
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold flex-shrink-0">
                    <CheckCircle size={13} />
                    Đang dùng
                  </div>
                )}
              </div>

              {/* All changes — fully visible, scroll via parent */}
              <ul className="space-y-2">
                {latestEntry.changes.map((change, i) => (
                  <ChangeItem key={i} text={change} accent />
                ))}
              </ul>
            </div>
          )}

          {/* ── Older versions ── */}
          {olderVersions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 mt-1">
                <Clock size={12} style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Phiên bản cũ hơn
                </span>
              </div>

              <div className="space-y-2">
                {olderVersions.map(entry => {
                  const isExpanded = expandedVersions.has(entry.version);
                  const isCurrent = CURRENT_VERSION === entry.version;
                  return (
                    <div
                      key={entry.version}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: isCurrent
                          ? 'rgba(16,185,129,0.08)'
                          : 'rgba(255,255,255,0.035)',
                        border: isCurrent
                          ? '1px solid rgba(16,185,129,0.25)'
                          : '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      {/* Row header */}
                      <div className="flex items-center justify-between px-4 py-2.5">
                        {/* Left: expand toggle + version info */}
                        <button
                          className="flex items-center gap-2 text-left flex-1 min-w-0"
                          onClick={() => toggleExpand(entry.version)}
                        >
                          <span style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </span>
                          <span
                            className="font-mono font-semibold text-xs truncate"
                            style={{ color: isCurrent ? '#6ee7b7' : 'rgba(255,255,255,0.75)' }}
                          >
                            {entry.version}
                          </span>
                          <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {entry.date}
                          </span>
                          {isCurrent && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                              style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}
                            >
                              Đang dùng
                            </span>
                          )}
                        </button>

                        {/* Right: rollback button */}
                        {!isCurrent && (
                          <button
                            onClick={() => handleRollback(entry.path)}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-all hover:bg-white/10 flex-shrink-0 ml-2"
                            style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <ArrowLeft size={11} />
                            Dùng bản này
                          </button>
                        )}
                      </div>

                      {/* Expanded change list */}
                      {isExpanded && entry.changes.length > 0 && (
                        <div
                          className="px-4 pb-3 pt-1"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <ul className="space-y-1.5 mt-1">
                            {entry.changes.map((change, i) => (
                              <ChangeItem key={i} text={change} />
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-5 py-2.5 text-center flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Dữ liệu người dùng (localStorage) không bị ảnh hưởng khi rollback.
          </p>
        </div>
      </div>
    </div>
  );
};
