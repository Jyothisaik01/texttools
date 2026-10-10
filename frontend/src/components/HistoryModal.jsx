import React, { useState, useEffect } from 'react';
import { X, History as HistoryIcon, RotateCcw, Trash2, ArrowRight, Clock, Layers } from 'lucide-react';
import { getHistory, clearAllHistory } from '../services/api';

export default function HistoryModal({
  isOpen,
  onClose,
  onRestoreJob,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleClear = async () => {
    if (window.confirm('Clear all transformation history?')) {
      await clearAllHistory();
      setHistory([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HistoryIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Job History</h3>
              <p className="text-xs text-slate-400">Past transformations saved in browser</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No transformation history yet. Past jobs you run or export will be recorded here automatically!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-xl bg-slate-850 border border-slate-750 hover:border-slate-650 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-400 rounded-md border border-emerald-500/30">
                      {item.stats?.totalReplacements || 0} replaced
                    </span>
                    <button
                      onClick={() => {
                        onRestoreJob(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restore
                    </button>
                  </div>
                </div>

                {/* Snippet comparison */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="truncate text-slate-400">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">Original:</span>
                    {item.originalText.slice(0, 100)}...
                  </div>
                  <div className="truncate text-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600 block mb-0.5">Replaced:</span>
                    {item.replacedText.slice(0, 100)}...
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

