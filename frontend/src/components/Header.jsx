import React from 'react';
import {
  Sparkles,
  BookOpen,
  History as HistoryIcon,
  RotateCcw,
  FileText,
  Layers,
  Zap,
} from 'lucide-react';

export default function Header({
  onOpenPresets,
  onOpenHistory,
  onLoadSample,
  onResetAll,
  stats,
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">TextFlow</h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Instant Client
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Rule Find & Replace with Live Diff & PDF Export
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLoadSample}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            title="Load sample document to try features"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Sample Text</span>
          </button>

          <button
            onClick={onOpenPresets}
            className="px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            title="Load or save rule presets"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Presets</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            title="View recent transformations from history"
          >
            <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={onResetAll}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
            title="Clear all text and rules"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

