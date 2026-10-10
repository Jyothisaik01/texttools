import React from 'react';
import {
  Search,
  ArrowRight,
  Trash2,
  Check,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';

export default function RuleCard({
  rule,
  index,
  totalRules,
  matchCount = 0,
  onChange,
  onDelete,
}) {
  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        rule.enabled
          ? 'bg-slate-850/80 border-slate-750 hover:border-slate-650 shadow-sm'
          : 'bg-slate-900/40 border-slate-800/60 opacity-60'
      }`}
    >
      <div className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center gap-3">
        {/* Left: Index & Active Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-colors ${
                rule.enabled
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              {index + 1}
            </span>
            <button
              onClick={() => onChange(rule.id, { enabled: !rule.enabled })}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              title={rule.enabled ? 'Click to disable rule' : 'Click to enable rule'}
            >
              {rule.enabled ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              ) : (
                <span className="text-slate-500">Muted</span>
              )}
            </button>
          </div>

          {/* Matches Badge (Mobile) */}
          <div className="md:hidden">
            {matchCount > 0 ? (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </span>
            ) : rule.findText ? (
              <span className="text-[11px] text-slate-500">0 matches</span>
            ) : null}
          </div>
        </div>

        {/* Center: Find & Replace Inputs */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-center">
          {/* Find Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={rule.findText}
              onChange={(e) => onChange(rule.id, { findText: e.target.value })}
              placeholder={rule.isRegex ? 'Regex pattern (e.g. \\d{4})' : 'Find text or phrase...'}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-900 border border-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-lg text-slate-100 placeholder-slate-500 font-mono transition-colors"
            />
            {rule.findText ? (
              <button
                onClick={() => onChange(rule.id, { findText: '' })}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Replace Input */}
          <div className="relative flex items-center gap-2">
            <div className="hidden sm:flex text-slate-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={rule.replaceText}
                onChange={(e) => onChange(rule.id, { replaceText: e.target.value })}
                placeholder="Replace with..."
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-750 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg text-slate-100 placeholder-slate-500 font-mono transition-colors"
              />
              {rule.replaceText ? (
                <button
                  onClick={() => onChange(rule.id, { replaceText: '' })}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: Options Flags & Match Count & Delete */}
        <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t border-slate-800/60 md:border-t-0">
          {/* Match Count (Desktop) */}
          <div className="hidden md:block">
            {matchCount > 0 ? (
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </span>
            ) : rule.findText ? (
              <span className="text-xs text-slate-500">0 matches</span>
            ) : null}
          </div>

          {/* Rule Flags */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-750">
            {/* Match Case */}
            <button
              onClick={() => onChange(rule.id, { matchCase: !rule.matchCase })}
              className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-colors ${
                rule.matchCase
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Match Case (Aa)"
            >
              Aa
            </button>

            {/* Whole Word */}
            <button
              onClick={() => onChange(rule.id, { matchWholeWord: !rule.matchWholeWord })}
              className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-colors ${
                rule.matchWholeWord
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Match Whole Word (\bword\b)"
            >
              \b
            </button>

            {/* Regex */}
            <button
              onClick={() => onChange(rule.id, { isRegex: !rule.isRegex })}
              className={`px-2 py-1 text-xs font-mono font-semibold rounded transition-colors ${
                rule.isRegex
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Regular Expression (.*)"
            >
              .*
            </button>
          </div>

          {/* Delete Button */}
          {totalRules > 1 && (
            <button
              onClick={() => onDelete(rule.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete this rule"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

