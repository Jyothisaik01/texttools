import React, { useState } from 'react';
import { X, PlusCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function BulkRuleModal({ isOpen, onClose, onImportRules }) {
  const [text, setText] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);

  if (!isOpen) return null;

  const handleImport = () => {
    if (!text.trim()) return;

    const lines = text.split(/\r\n|\r|\n/);
    const parsedRules = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      let find = '';
      let replace = '';

      // Support "->", "=>", "=", ",", or tab delimiters
      if (trimmed.includes('->')) {
        const parts = trimmed.split('->');
        find = parts[0].trim();
        replace = parts.slice(1).join('->').trim();
      } else if (trimmed.includes('=>')) {
        const parts = trimmed.split('=>');
        find = parts[0].trim();
        replace = parts.slice(1).join('=>').trim();
      } else if (trimmed.includes('=')) {
        const parts = trimmed.split('=');
        find = parts[0].trim();
        replace = parts.slice(1).join('=').trim();
      } else if (trimmed.includes('\t')) {
        const parts = trimmed.split('\t');
        find = parts[0].trim();
        replace = parts.slice(1).join('\t').trim();
      } else if (trimmed.includes(',')) {
        const parts = trimmed.split(',');
        find = parts[0].trim();
        replace = parts.slice(1).join(',').trim();
      }

      if (find) {
        parsedRules.push({
          id: 'rule_' + Math.random().toString(36).substr(2, 9),
          findText: find,
          replaceText: replace,
          matchCase: false,
          matchWholeWord: false,
          isRegex: false,
          enabled: true,
        });
      }
    });

    if (parsedRules.length > 0) {
      onImportRules(parsedRules, replaceExisting);
      setText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bulk Add Rules</h3>
              <p className="text-xs text-slate-400">Paste multiple Find/Replace pairs in bulk</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Paste rules (1 per line). Supports <code className="text-indigo-400">foo -&gt; bar</code>,{' '}
              <code className="text-indigo-400">cat =&gt; dog</code>, or CSV format:
            </label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`color -> colour\ncenter -> centre\nuser_id -> userId\n[EMAIL] -> info@example.com`}
              className="w-full p-3 text-sm bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="replaceExisting"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="replaceExisting" className="text-xs text-slate-400 cursor-pointer">
              Replace existing rules (instead of appending)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!text.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Import Rules
          </button>
        </div>
      </div>
    </div>
  );
}

