import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2, Check, BookmarkPlus, Database, Sparkles } from 'lucide-react';
import { getPresets, createPreset, removePreset } from '../services/api';

export default function PresetsModal({
  isOpen,
  onClose,
  currentRules,
  onApplyPreset,
}) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadPresets();
      setShowSaveForm(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const loadPresets = async () => {
    setLoading(true);
    const data = await getPresets();
    setPresets(data);
    setLoading(false);
  };

  const handleSaveCurrent = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMsg('Please enter a name for this preset');
      return;
    }
    setErrorMsg('');

    const payload = {
      name: newName.trim(),
      description: newDesc.trim(),
      rules: currentRules.map(({ findText, replaceText, matchCase, matchWholeWord, isRegex, enabled }) => ({
        findText,
        replaceText,
        matchCase,
        matchWholeWord,
        isRegex,
        enabled,
      })),
      tags: ['custom'],
    };

    const res = await createPreset(payload);
    if (res.success) {
      setSuccessMsg(`Preset "${newName}" saved to MongoDB!`);
      setNewName('');
      setNewDesc('');
      setShowSaveForm(false);
      loadPresets();
    } else {
      setErrorMsg(res.message || 'Failed to save preset');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete preset "${name}"?`)) {
      await removePreset(id);
      loadPresets();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rule Presets & Templates</h3>
              <p className="text-xs text-slate-400">Stored locally in your browser for instant reuse</p>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {successMsg ? (
            <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              {successMsg}
            </div>
          ) : null}
          {errorMsg ? (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
              {errorMsg}
            </div>
          ) : null}

          {/* Save Current Rules Card */}
          {!showSaveForm ? (
            <button
              onClick={() => setShowSaveForm(true)}
              className="w-full p-3.5 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <BookmarkPlus className="w-4 h-4 text-indigo-400" />
              Save Current Rules ({currentRules.length}) as New Preset
            </button>
          ) : (
            <form onSubmit={handleSaveCurrent} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save as Preset
                </span>
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Preset Name (e.g. Resume Redactor, SQL Migration)"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short description (optional)"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                >
                  Save Preset
                </button>
              </div>
            </form>
          )}

          {/* Preset List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Presets</h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading presets from database...</div>
            ) : presets.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No presets saved yet.</div>
            ) : (
              presets.map((p) => (
                <div
                  key={p._id}
                  className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 hover:border-slate-650 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-semibold text-white truncate">{p.name}</h5>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                        {p.rules?.length || 0} rules
                      </span>
                    </div>
                    {p.description ? (
                      <p className="text-xs text-slate-400 truncate">{p.description}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onApplyPreset(p.rules || []);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 rounded-lg transition-all"
                    >
                      Apply
                    </button>
                    {p.tags?.includes('custom') ? (
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

