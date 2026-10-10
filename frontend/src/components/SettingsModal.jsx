import React, { useEffect } from 'react';
import {
  X,
  Settings,
  Moon,
  Sun,
  RotateCcw,
  Download,
  Upload,
  Check,
  Keyboard,
  Sliders,
  Database,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  ignoreCase,
  setIgnoreCase,
  matchWholeWords,
  setMatchWholeWords,
  rules,
  setRules,
  setInputText,
  showToast,
  fontSize,
  setFontSize,
}) {
  // Close on Escape key
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

  // Export rules to JSON
  const handleExportRules = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rules, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'texttools-rules.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast?.('Rules configuration exported to JSON!', 'success', 'Exported');
    } catch {
      showToast?.('Failed to export rules.', 'error', 'Export Error');
    }
  };

  // Import rules from JSON
  const handleImportRules = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const validated = imported.map((r, i) => ({
            id: String(r.id || Date.now() + i),
            find: String(r.find ?? ''),
            replace: String(r.replace ?? ''),
          }));
          setRules(validated);
          showToast?.(`Loaded ${validated.length} rules successfully!`, 'success', 'Rules Imported');
        } else {
          showToast?.('Invalid JSON format for rules.', 'error', 'Import Failed');
        }
      } catch {
        showToast?.('Failed to parse JSON file.', 'error', 'Import Error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset all to defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all saved input text, rules, and settings to defaults?')) {
      try {
        localStorage.removeItem('tt_inputText');
        localStorage.removeItem('tt_rules');
        localStorage.removeItem('tt_ignoreCase');
        localStorage.removeItem('tt_matchWholeWords');
      } catch {}
      setInputText('');
      setRules([
        { id: '1', find: '', replace: '' },
        { id: '2', find: '', replace: '' },
      ]);
      setIgnoreCase(true);
      setMatchWholeWords(true);
      showToast?.('Settings and storage reset to defaults.', 'info', 'Reset Complete');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-150 flex flex-col max-h-[90vh] ${
          darkMode
            ? 'bg-black border-zinc-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-zinc-700 flex items-center justify-center text-blue-600">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight">
                Settings & Preferences
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Customize appearance, editor behaviour, and rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs">
          {/* Section: Appearance */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Appearance & Editor</span>
            </div>
            <div className={`rounded-xl border p-3 space-y-3 ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/70 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-zinc-100">Theme Mode</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">Pure Black (#000000) or Clean White (#FFFFFF)</div>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    darkMode
                      ? 'bg-zinc-900 border-zinc-700 text-yellow-400 hover:bg-zinc-850'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{darkMode ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              {fontSize && setFontSize && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-zinc-100">Editor Text Size</div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">Adjust font size inside textareas</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[
                      { label: 'Small', value: 'text-xs' },
                      { label: 'Medium', value: 'text-sm' },
                      { label: 'Large', value: 'text-base' },
                    ].map((sz) => (
                      <button
                        key={sz.value}
                        type="button"
                        onClick={() => setFontSize(sz.value)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                          fontSize === sz.value
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : darkMode
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Matching Options */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Matching Options</span>
            </div>
            <div className={`rounded-xl border p-3 space-y-2.5 ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/70 border-slate-200'}`}>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-zinc-100">Ignore Case</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">Case-insensitive matching (treat "Hello" and "hello" as equal)</div>
                </div>
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60 dark:border-zinc-800/80">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-zinc-100">Match Whole Words Only</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">Prevent replacing substrings inside longer words</div>
                </div>
                <input
                  type="checkbox"
                  checked={matchWholeWords}
                  onChange={(e) => setMatchWholeWords(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section: Backup & Storage */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-zinc-300 mb-2.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Data & Rules Backup</span>
            </div>
            <div className={`rounded-xl border p-3 space-y-2.5 ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/70 border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-zinc-100">Export & Import Rules</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">Save your find/replace rules as a JSON file or import them</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExportRules}
                    className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export</span>
                  </button>
                  <label
                    className={`px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportRules}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-rose-600 dark:text-rose-400">Reset All Storage</div>
                  <div className="text-[11px] text-slate-400 dark:text-zinc-500">Clear all cached input, rules, and reset preferences</div>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Keyboard Shortcuts */}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-zinc-300 mb-2">
              <Keyboard className="w-3.5 h-3.5 text-blue-600" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className={`rounded-xl border p-2.5 grid grid-cols-2 gap-2 text-[11px] ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/70 border-slate-200'}`}>
              <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Undo text</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-mono text-[10px]">Ctrl+Z</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Redo text</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-mono text-[10px]">Ctrl+Y</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

