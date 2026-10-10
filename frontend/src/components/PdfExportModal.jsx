import React, { useState } from 'react';
import { X, FileDown, CheckCircle2, Settings, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePdf } from '../services/api';

export default function PdfExportModal({
  isOpen,
  onClose,
  text,
  rules,
  stats,
  onExportSuccess,
}) {
  const [title, setTitle] = useState('Transformed Document');
  const [subtitle, setSubtitle] = useState('Processed via TextFlow Multi-Rule Replacer');
  const [fontSize, setFontSize] = useState(11);
  const [includeStats, setIncludeStats] = useState(true);
  const [exportMode, setExportMode] = useState('server'); // 'server' | 'client'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!text || !text.trim()) {
      setErrorMsg('No text content available to export to PDF');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await generatePdf({
        text,
        title: title.trim() || 'Transformed Document',
        subtitle: subtitle.trim(),
        fontSize,
        includeStats,
        stats,
        rules: rules.filter((r) => r.enabled && r.findText),
        useClientSide: exportMode === 'client',
      });

      setLoading(false);

      // Celebrate with confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}

      if (onExportSuccess) onExportSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to generate PDF document');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate PDF Document</h3>
              <p className="text-xs text-slate-400">Custom layout, typography & metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg ? (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
              {errorMsg}
            </div>
          ) : null}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Header Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sanitized Code, Meeting Transcript"
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subtitle / Author Note:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Optional description"
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Body Font Size:
              </label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500"
              >
                <option value={9}>Compact (9 pt)</option>
                <option value={11}>Standard (11 pt)</option>
                <option value={13}>Comfortable (13 pt)</option>
                <option value={15}>Large (15 pt)</option>
              </select>
            </div>

            {/* Page Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paper Size:
              </label>
              <select
                value={exportMode}
                onChange={(e) => setExportMode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-emerald-500"
              >
                <option value="a4">Standard A4</option>
                <option value="letter">US Letter</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeStats"
                checked={includeStats}
                onChange={(e) => setIncludeStats(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="includeStats" className="text-xs text-slate-300 cursor-pointer">
                Include summary box (replacements count, word count, date)
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            {stats.totalReplacements} changes ready to export
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={loading || !text.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

