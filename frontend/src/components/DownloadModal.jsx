import React, { useState, useEffect, useRef } from 'react';
import { X, Download, FileText, Check } from 'lucide-react';

export default function DownloadModal({
  isOpen,
  onClose,
  onDownload,
  darkMode,
}) {
  const [fileName, setFileName] = useState('transformed-text');
  const [format, setFormat] = useState('pdf'); // 'pdf' | 'txt'
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFileName('transformed-text');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const sanitized = fileName
      .trim()
      .replace(/[\\/:*?"<>|]/g, '_'); // Remove invalid file characters
    const cleanName = sanitized || 'transformed-text';
    onDownload({ fileName: cleanName, format });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all duration-150 ${
          darkMode
            ? 'bg-black border-zinc-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            darkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Download Transformed Text</h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Choose format and customize file name
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              darkMode
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* File Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-tight">
              File Name
            </label>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="transformed-text"
                className={`w-full pr-14 pl-3.5 py-2.5 rounded-xl border text-xs font-medium outline-hidden transition-colors ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white'
                }`}
              />
              <span className="absolute right-3 text-xs font-semibold text-slate-400 dark:text-zinc-500 select-none">
                .{format}
              </span>
            </div>
          </div>

          {/* Format Selection (PDF vs TXT with Text and Icons) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-tight">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* PDF Option Card */}
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 relative ${
                  format === 'pdf'
                    ? 'border-red-500 bg-red-50/60 dark:bg-red-950/20 ring-1 ring-red-500/40 shadow-xs'
                    : darkMode
                    ? 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  {/* Red PDF Icon Badge */}
                  <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/80 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-red-600 dark:text-red-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <text
                        x="12"
                        y="16.5"
                        fill="currentColor"
                        stroke="none"
                        fontSize="6"
                        fontWeight="900"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        PDF
                      </text>
                    </svg>
                  </div>
                  {format === 'pdf' && (
                    <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    PDF Document
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                    Formatted text layout (.pdf)
                  </div>
                </div>
              </button>

              {/* TXT Option Card */}
              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 relative ${
                  format === 'txt'
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 ring-1 ring-blue-500/40 shadow-xs'
                    : darkMode
                    ? 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  {/* Blue TXT Icon Badge */}
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  {format === 'txt' && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    Text File
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-zinc-400 leading-tight mt-0.5">
                    Standard plain text (.txt)
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                darkMode
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download {format.toUpperCase()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

