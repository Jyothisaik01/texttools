import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText,
  Columns,
  List,
  Split,
  ArrowRightLeft,
  Copy,
  Download,
  Trash2,
  Clipboard,
  Zap,
  ShieldCheck,
  Check,
  Info,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import DiffIllustration from './DiffIllustration';
import DownloadModal from '../components/DownloadModal';
import {
  computeSideBySideDiff,
  computeUnifiedDiff,
  createPatchFile,
  getLineDiffStatuses,
} from './diffUtils';

export default function DiffChecker({ darkMode, showToast }) {
  // Texts state: default empty as requested by user
  const [originalText, setOriginalText] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_originalText');
      return saved !== null ? saved : '';
    } catch {
      return '';
    }
  });

  const [modifiedText, setModifiedText] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_modifiedText');
      return saved !== null ? saved : '';
    } catch {
      return '';
    }
  });

  // Comparison Mode: 'side-by-side' | 'unified' | 'inline'
  const [viewMode, setViewMode] = useState('side-by-side');

  // Ignore options with smooth transitions
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);
  const [ignoreLineBreaks, setIgnoreLineBreaks] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  // Download menu dropdown & popup modal
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadFormatPreference, setDownloadFormatPreference] = useState('pdf');
  const [copied, setCopied] = useState(false);
  const downloadRef = useRef(null);

  // Synchronized scroll refs for live editors
  const origTextareaRef = useRef(null);
  const origGutterRef = useRef(null);
  const origHighlightRef = useRef(null);

  const modTextareaRef = useRef(null);
  const modGutterRef = useRef(null);
  const modHighlightRef = useRef(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dc_originalText', originalText);
      localStorage.setItem('dc_modifiedText', modifiedText);
    } catch {}
  }, [originalText, modifiedText]);

  // Close download dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Diffs in Real-Time
  const ignoreOptions = useMemo(
    () => ({
      ignoreCase,
      ignoreSpaces,
      ignoreLineBreaks,
      ignoreWhitespaceChanges: ignoreWhitespace,
    }),
    [ignoreCase, ignoreSpaces, ignoreLineBreaks, ignoreWhitespace]
  );

  // Real-time line-by-line diff statuses for live typing editor
  const liveDiffStats = useMemo(
    () => getLineDiffStatuses(originalText, modifiedText, ignoreOptions),
    [originalText, modifiedText, ignoreOptions]
  );

  const sideBySideResult = useMemo(
    () => computeSideBySideDiff(originalText, modifiedText, ignoreOptions),
    [originalText, modifiedText, ignoreOptions]
  );

  const unifiedResult = useMemo(
    () => computeUnifiedDiff(originalText, modifiedText, ignoreOptions),
    [originalText, modifiedText, ignoreOptions]
  );

  // Original & Modified split lines
  const originalLines = useMemo(() => (originalText ? originalText.split('\n') : ['']), [originalText]);
  const modifiedLines = useMemo(() => (modifiedText ? modifiedText.split('\n') : ['']), [modifiedText]);

  // Scroll sync handlers
  const handleOrigScroll = () => {
    if (origTextareaRef.current) {
      const top = origTextareaRef.current.scrollTop;
      const left = origTextareaRef.current.scrollLeft;
      if (origGutterRef.current) origGutterRef.current.scrollTop = top;
      if (origHighlightRef.current) {
        origHighlightRef.current.scrollTop = top;
        origHighlightRef.current.scrollLeft = left;
      }
    }
  };

  const handleModScroll = () => {
    if (modTextareaRef.current) {
      const top = modTextareaRef.current.scrollTop;
      const left = modTextareaRef.current.scrollLeft;
      if (modGutterRef.current) modGutterRef.current.scrollTop = top;
      if (modHighlightRef.current) {
        modHighlightRef.current.scrollTop = top;
        modHighlightRef.current.scrollLeft = left;
      }
    }
  };

  // Text metrics
  const originalStats = useMemo(() => {
    const lines = originalText ? originalText.split('\n').length : 0;
    const chars = originalText ? originalText.length : 0;
    return { lines, chars };
  }, [originalText]);

  const modifiedStats = useMemo(() => {
    const lines = modifiedText ? modifiedText.split('\n').length : 0;
    const chars = modifiedText ? modifiedText.length : 0;
    return { lines, chars };
  }, [modifiedText]);

  // Actions
  const handleSwap = () => {
    setOriginalText(modifiedText);
    setModifiedText(originalText);
    showToast?.('Swapped original and modified texts', 'info', 'Swapped');
  };

  const handlePaste = async (target) => {
    try {
      const text = await navigator.clipboard.readText();
      if (target === 'original') setOriginalText(text);
      else setModifiedText(text);
      showToast?.('Pasted content from clipboard', 'success', 'Pasted');
    } catch {
      showToast?.('Unable to read clipboard. Please paste manually.', 'error', 'Paste Error');
    }
  };

  const handleClear = (target) => {
    if (target === 'original') setOriginalText('');
    else setModifiedText('');
    showToast?.('Cleared text', 'info', 'Cleared');
  };

  const handleCopyDiff = () => {
    const patch = createPatchFile(originalText, modifiedText);
    navigator.clipboard.writeText(patch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast?.('Unified diff copied to clipboard!', 'success', 'Copied');
  };

  const handleDownloadPatch = (customFileName) => {
    const patch = createPatchFile(originalText, modifiedText);
    const blob = new Blob([patch], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanName = (typeof customFileName === 'string' && customFileName.trim()) ? customFileName.trim() : 'diff-patch';
    const saveName = `${cleanName}.patch`;
    a.href = url;
    a.download = saveName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
    } catch {}
    showToast?.(`Saved as ${saveName}`, 'success', 'Downloaded');
    setIsDownloadOpen(false);
  };

  const handleDownloadText = (customFileName) => {
    const content = `=== DIFF COMPARISON REPORT ===\nGenerated with TextTools Diff Checker • ${new Date().toLocaleString()}\n\nSummary:\n- Added lines: ${liveDiffStats.addedCount}\n- Removed lines: ${liveDiffStats.removedCount}\n- Modified lines: ${liveDiffStats.modifiedCount}\n- Total lines: ${liveDiffStats.totalCount}\n\n=== UNIFIED DIFF ===\n${createPatchFile(originalText, modifiedText)}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanName = (typeof customFileName === 'string' && customFileName.trim()) ? customFileName.trim() : 'diff-report';
    const saveName = `${cleanName}.txt`;
    a.href = url;
    a.download = saveName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
    } catch {}
    showToast?.(`Saved as ${saveName}`, 'success', 'Downloaded');
    setIsDownloadOpen(false);
  };

  const handleDownloadPdf = (customFileName) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - margin * 2;
      let y = 45;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('Diff Comparison Report', margin, y);
      y += 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated with TextTools Diff Checker • ${new Date().toLocaleString()}`, margin, y);
      y += 15;

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 18;

      // Stats block
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, maxWidth, 30, 4, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `Added: ${liveDiffStats.addedCount} lines   |   Removed: ${liveDiffStats.removedCount} lines   |   Modified: ${liveDiffStats.modifiedCount} lines   |   Total: ${liveDiffStats.totalCount} lines`,
        margin + 12,
        y + 19
      );
      y += 42;

      // Diff lines
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);

      const patch = createPatchFile(originalText, modifiedText);
      const patchLines = patch.split('\n');

      for (let i = 0; i < patchLines.length; i++) {
        if (y + 12 > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }

        const line = patchLines[i];
        if (line.startsWith('+') && !line.startsWith('+++')) {
          doc.setTextColor(22, 101, 52); // green
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          doc.setTextColor(159, 18, 57); // red
        } else if (line.startsWith('@@')) {
          doc.setTextColor(3, 105, 161); // blue
        } else {
          doc.setTextColor(71, 85, 105); // neutral
        }

        doc.text(line.substring(0, 95), margin, y);
        y += 11;
      }

      const cleanName = (typeof customFileName === 'string' && customFileName.trim()) ? customFileName.trim() : 'diff-report';
      const saveName = `${cleanName}.pdf`;
      doc.save(saveName);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
      } catch {}
      showToast?.(`Saved as ${saveName}`, 'success', 'PDF Exported');
      setIsDownloadOpen(false);
    } catch {
      showToast?.('Failed to generate Diff PDF', 'error', 'Export Failed');
    }
  };

  const handleDownloadFile = ({ fileName, format }) => {
    if (format === 'pdf') {
      handleDownloadPdf(fileName);
    } else if (format === 'patch') {
      handleDownloadPatch(fileName);
    } else {
      handleDownloadText(fileName);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-visible lg:overflow-hidden select-text">
      {/* 1. Hero Banner: Diff Checker */}
      <div
        className={`shrink-0 w-full rounded-2xl border overflow-hidden shadow-xs relative flex items-center transition-all min-h-[125px] sm:min-h-[135px] ${
          darkMode
            ? 'bg-zinc-950 border-zinc-800'
            : 'bg-gradient-to-r from-blue-50/50 via-white to-blue-50/40 border-slate-200'
        }`}
      >
        <div className="relative z-10 p-5 sm:p-6 max-w-2xl flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>Diff</span>
            <span className="text-blue-600">Checker</span>
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 mt-2 font-normal leading-relaxed max-w-xl">
            Compare two texts and instantly see the differences. Highlights added, removed and
            modified content for easy review.
          </p>

          {/* 3 Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-3.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-blue-400'
                  : 'bg-white border-blue-100 text-blue-700 shadow-2xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              Instant comparison
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-blue-400'
                  : 'bg-white border-blue-100 text-blue-700 shadow-2xs'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              100% private
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-blue-400'
                  : 'bg-white border-blue-100 text-blue-700 shadow-2xs'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Copy & Download
            </span>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex absolute right-4 top-0 bottom-0 w-80 items-center justify-end pointer-events-none">
          <DiffIllustration />
        </div>
      </div>

      {/* 2. Control Row: Comparison Mode & Ignore Options */}
      <div
        className={`shrink-0 rounded-2xl border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs transition-colors ${
          darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Left: Comparison Mode Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 mr-1 select-none">
            Comparison Mode
          </span>
          <div className="flex items-center gap-1 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-black text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Side by Side
            </button>

            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-white dark:bg-black text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Unified View
            </button>

            <button
              type="button"
              onClick={() => setViewMode('inline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === 'inline'
                  ? 'bg-white dark:bg-black text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              Inline View
            </button>
          </div>
        </div>

        {/* Right: Ignore Options Toggles with buttery-smooth background transitions */}
        <div className="flex flex-wrap items-center gap-2 text-xs select-none">
          <span className="font-bold text-slate-700 dark:text-zinc-300 mr-1 hidden sm:inline">
            Ignore Options:
          </span>

          <button
            type="button"
            onClick={() => setIgnoreCase(!ignoreCase)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer text-xs font-semibold ${
              ignoreCase
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border text-[9px] transition-colors duration-200 ${
                ignoreCase
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              }`}
            >
              {ignoreCase && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>Ignore Case</span>
          </button>

          <button
            type="button"
            onClick={() => setIgnoreSpaces(!ignoreSpaces)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer text-xs font-semibold ${
              ignoreSpaces
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border text-[9px] transition-colors duration-200 ${
                ignoreSpaces
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              }`}
            >
              {ignoreSpaces && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>Ignore Spaces</span>
          </button>

          <button
            type="button"
            onClick={() => setIgnoreLineBreaks(!ignoreLineBreaks)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer text-xs font-semibold ${
              ignoreLineBreaks
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border text-[9px] transition-colors duration-200 ${
                ignoreLineBreaks
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              }`}
            >
              {ignoreLineBreaks && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>Ignore Line Breaks</span>
          </button>

          <button
            type="button"
            onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 ease-out cursor-pointer text-xs font-semibold ${
              ignoreWhitespace
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'bg-transparent border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border text-[9px] transition-colors duration-200 ${
                ignoreWhitespace
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
              }`}
            >
              {ignoreWhitespace && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>Ignore Whitespace</span>
          </button>

          <button
            type="button"
            title="Options to ignore differences in letter cases, tabs, trailing spaces, or line endings"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 cursor-help p-1"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Diff Panels Area */}
      {viewMode === 'side-by-side' ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3.5 overflow-hidden">
          {/* Card Left: Original Text (Live-typing editor with real-time diff gutter & highlights) */}
          <div
            className={`rounded-2xl border p-3 flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${
              darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Original Text
                </h3>
                <span className="text-[11px] text-slate-400 font-mono ml-2">
                  {originalStats.lines} lines • {originalStats.chars} characters
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePaste('original')}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  <Clipboard className="w-3 h-3" />
                  Paste
                </button>

                <button
                  type="button"
                  onClick={() => handleClear('original')}
                  className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            {/* Live Real-Time Editor with Diff Gutter & Background Highlights */}
            <div
              className={`flex-1 min-h-0 rounded-xl border relative flex overflow-hidden font-mono text-xs leading-5.5 transition-colors ${
                darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Line Gutter (Numbers & Diff marker) */}
              <div
                ref={origGutterRef}
                className={`w-12 shrink-0 border-r select-none overflow-hidden py-2 font-mono text-[11px] ${
                  darkMode ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {originalLines.map((_, i) => {
                  const status = liveDiffStats.origStatuses[i] || 'unchanged';
                  const isRemoved = status === 'removed';
                  return (
                    <div
                      key={i}
                      className={`h-[22px] px-1.5 flex items-center justify-between ${
                        isRemoved ? 'bg-rose-100/70 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold' : ''
                      }`}
                    >
                      <span className="text-right w-5">{i + 1}</span>
                      <span className="w-3 text-center font-bold text-xs">
                        {isRemoved ? '-' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Underlying Real-Time Highlight Layer */}
              <div
                ref={origHighlightRef}
                className="absolute left-12 right-0 top-0 bottom-0 pointer-events-none overflow-hidden py-2 font-mono text-xs leading-[22px]"
                aria-hidden="true"
              >
                {originalLines.map((line, i) => {
                  const status = liveDiffStats.origStatuses[i] || 'unchanged';
                  const isRemoved = status === 'removed';
                  const tokens = liveDiffStats.origTokens?.[i] || [];
                  return (
                    <div
                      key={i}
                      className={`h-[22px] px-3 whitespace-pre transition-colors ${
                        isRemoved
                          ? 'bg-rose-500/15 dark:bg-rose-950/30 shadow-[inset_3px_0_0_0_#f43f5e] text-transparent'
                          : 'text-transparent'
                      }`}
                    >
                      {tokens.length > 0 && line ? (
                        tokens.map((tok, tIdx) => (
                          <span
                            key={tIdx}
                            className={
                              tok.type === 'removed'
                                ? 'bg-red-300/90 dark:bg-red-600/60 rounded-[2px]'
                                : ''
                            }
                          >
                            {tok.text}
                          </span>
                        ))
                      ) : (
                        line || ' '
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Native Live Typing Textarea */}
              <textarea
                ref={origTextareaRef}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                onScroll={handleOrigScroll}
                placeholder="Paste or type original text here..."
                className={`relative z-10 flex-1 h-full py-2 px-3 resize-none outline-none border-none bg-transparent font-mono text-xs leading-[22px] overflow-auto ${
                  darkMode ? 'text-zinc-100 placeholder-zinc-700' : 'text-slate-900 placeholder-slate-400'
                }`}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Card Right: Modified Text (Live-typing editor with real-time diff gutter & highlights) */}
          <div
            className={`rounded-2xl border p-3 flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${
              darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Modified Text
                </h3>
                <span className="text-[11px] text-slate-400 font-mono ml-2">
                  {modifiedStats.lines} lines • {modifiedStats.chars} characters
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePaste('modified')}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  <Clipboard className="w-3 h-3" />
                  Paste
                </button>

                <button
                  type="button"
                  onClick={() => handleClear('modified')}
                  className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
            </div>

            {/* Live Real-Time Editor with Diff Gutter & Background Highlights */}
            <div
              className={`flex-1 min-h-0 rounded-xl border relative flex overflow-hidden font-mono text-xs leading-5.5 transition-colors ${
                darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Line Gutter (Numbers & Diff marker) */}
              <div
                ref={modGutterRef}
                className={`w-12 shrink-0 border-r select-none overflow-hidden py-2 font-mono text-[11px] ${
                  darkMode ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {modifiedLines.map((_, i) => {
                  const status = liveDiffStats.modStatuses[i] || 'unchanged';
                  const isAdded = status === 'added';
                  return (
                    <div
                      key={i}
                      className={`h-[22px] px-1.5 flex items-center justify-between ${
                        isAdded ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold' : ''
                      }`}
                    >
                      <span className="text-right w-5">{i + 1}</span>
                      <span className="w-3 text-center font-bold text-xs">
                        {isAdded ? '+' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Underlying Real-Time Highlight Layer */}
              <div
                ref={modHighlightRef}
                className="absolute left-12 right-0 top-0 bottom-0 pointer-events-none overflow-hidden py-2 font-mono text-xs leading-[22px]"
                aria-hidden="true"
              >
                {modifiedLines.map((line, i) => {
                  const status = liveDiffStats.modStatuses[i] || 'unchanged';
                  const isAdded = status === 'added';
                  const tokens = liveDiffStats.modTokens?.[i] || [];
                  return (
                    <div
                      key={i}
                      className={`h-[22px] px-3 whitespace-pre transition-colors ${
                        isAdded
                          ? 'bg-emerald-500/15 dark:bg-emerald-950/30 shadow-[inset_3px_0_0_0_#10b981] text-transparent'
                          : 'text-transparent'
                      }`}
                    >
                      {tokens.length > 0 && line ? (
                        tokens.map((tok, tIdx) => (
                          <span
                            key={tIdx}
                            className={
                              tok.type === 'added'
                                ? 'bg-emerald-300/90 dark:bg-emerald-600/60 rounded-[2px]'
                                : ''
                            }
                          >
                            {tok.text}
                          </span>
                        ))
                      ) : (
                        line || ' '
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Native Live Typing Textarea */}
              <textarea
                ref={modTextareaRef}
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                onScroll={handleModScroll}
                placeholder="Paste or type modified text here..."
                className={`relative z-10 flex-1 h-full py-2 px-3 resize-none outline-none border-none bg-transparent font-mono text-xs leading-[22px] overflow-auto ${
                  darkMode ? 'text-zinc-100 placeholder-zinc-700' : 'text-slate-900 placeholder-slate-400'
                }`}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Unified View / Inline View */
        <div
          className={`flex-1 min-h-0 rounded-2xl border p-3 flex flex-col justify-between overflow-hidden shadow-xs transition-colors ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-white">
              {viewMode === 'unified' ? 'Unified Diff View' : 'Inline Diff View'}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {unifiedResult.length} total diff lines
            </span>
          </div>

          <div
            className={`flex-1 min-h-0 rounded-xl border overflow-auto font-mono text-xs leading-relaxed ${
              darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-full min-w-max select-text font-mono text-xs">
              {unifiedResult.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-start min-h-[22px] px-2 py-0.5 border-b border-transparent transition-colors ${
                    line.type === 'added'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : line.type === 'removed'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                      : 'hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 text-slate-800 dark:text-zinc-200'
                  }`}
                >
                  <span className="w-8 shrink-0 text-right pr-2 text-slate-400 dark:text-zinc-600 select-none text-[11px]">
                    {line.origLineNum ?? ''}
                  </span>
                  <span className="w-8 shrink-0 text-right pr-3 text-slate-400 dark:text-zinc-600 select-none text-[11px]">
                    {line.modLineNum ?? ''}
                  </span>
                  <span
                    className={`w-4 shrink-0 text-center select-none font-bold ${
                      line.type === 'added'
                        ? 'text-emerald-500'
                        : line.type === 'removed'
                        ? 'text-rose-500'
                        : 'text-slate-300 dark:text-zinc-700'
                    }`}
                  >
                    {line.prefix}
                  </span>
                  <pre className="flex-1 whitespace-pre font-mono m-0 overflow-visible text-xs">
                    {line.tokens && line.tokens.length > 0 ? (
                      line.tokens.map((tok, tIdx) => (
                        <span
                          key={tIdx}
                          className={
                            tok.type === 'removed'
                              ? 'bg-red-200/90 dark:bg-red-900/80 text-red-950 dark:text-red-100 rounded-xs font-semibold'
                              : tok.type === 'added'
                              ? 'bg-emerald-200/90 dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-100 rounded-xs font-semibold'
                              : ''
                          }
                        >
                          {tok.text}
                        </span>
                      ))
                    ) : (
                      line.text
                    )}
                  </pre>
                </div>
              ))}
              {unifiedResult.length === 0 && (
                <div className="p-4 text-slate-400 italic font-sans text-xs">
                  Enter original and modified text in Side by Side view to generate diff.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Action & Summary Bar */}
      <div
        className={`shrink-0 rounded-2xl border px-3 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs transition-colors ${
          darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Left: Diff Summary Badges */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-white mr-1 select-none">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Diff Summary</span>
          </div>

          {/* Added Badge (Green) */}
          <div className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-900/50 flex items-center gap-1.5 text-xs transition-all">
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base leading-none">
              {liveDiffStats.addedCount}
            </span>
            <span className="text-emerald-800 dark:text-emerald-200 font-medium text-[11px] sm:text-xs">
              Added lines
            </span>
          </div>

          {/* Removed Badge (Red) */}
          <div className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 dark:bg-rose-950/40 dark:border-rose-900/50 flex items-center gap-1.5 text-xs transition-all">
            <span className="font-black text-rose-600 dark:text-rose-400 text-sm sm:text-base leading-none">
              {liveDiffStats.removedCount}
            </span>
            <span className="text-rose-800 dark:text-rose-200 font-medium text-[11px] sm:text-xs">
              Removed lines
            </span>
          </div>

          {/* Modified Badge (Amber/Orange) */}
          <div className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/40 dark:border-amber-900/50 flex items-center gap-1.5 text-xs transition-all">
            <span className="font-black text-amber-600 dark:text-amber-400 text-sm sm:text-base leading-none">
              {liveDiffStats.modifiedCount}
            </span>
            <span className="text-amber-800 dark:text-amber-200 font-medium text-[11px] sm:text-xs">
              Modified lines
            </span>
          </div>

          {/* Total Badge (Blue) */}
          <div className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-900/50 flex items-center gap-1.5 text-xs transition-all">
            <span className="font-black text-blue-600 dark:text-blue-400 text-sm sm:text-base leading-none">
              {liveDiffStats.totalCount}
            </span>
            <span className="text-blue-800 dark:text-blue-200 font-medium text-[11px] sm:text-xs">
              Total lines
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Swap Texts */}
          <button
            type="button"
            onClick={handleSwap}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs cursor-pointer ${
              darkMode
                ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            Swap Texts
          </button>

          {/* Copy Result */}
          <button
            type="button"
            onClick={handleCopyDiff}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs cursor-pointer ${
              darkMode
                ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>

          {/* Download Diff Button (Opens rename & format popup modal like Find & Replace) */}
          <button
            type="button"
            onClick={() => {
              setDownloadFormatPreference('pdf');
              setIsDownloadModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            title="Download Diff as PDF, Patch, or Text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Diff</span>
          </button>
        </div>
      </div>

      {/* Unified Download Popup Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadFile}
        darkMode={darkMode}
        title="Download Diff Comparison"
        subtitle="Choose format and customize file name"
        defaultFileName="diff-report"
        defaultFormat={downloadFormatPreference}
        formats={['pdf', 'patch', 'txt']}
      />
    </div>
  );
}
