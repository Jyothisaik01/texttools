import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  ArrowRight,
  Trash2,
  Plus,
  Copy,
  Download,
  RotateCcw,
  Check,
  Moon,
  Sun,
  Settings,
  Zap,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  FileDown,
  X,
  Wand2,
  Code,
  AlignLeft,
  ArrowRightLeft,
  Undo2,
  Redo2,
  LayoutGrid,
  Type,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import DownloadModal from './components/DownloadModal';
import SettingsModal from './components/SettingsModal';
import DiffChecker from './diff-checker/DiffChecker';
import TextTransform from './components/TextTransform';

// 30 Distinct, accessible, beautiful color themes for rules and diff badges
const RULE_COLORS = [
  // 1. Emerald
  {
    name: 'emerald',
    rowBg: 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-100 dark:border-emerald-900/40',
    numBadge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    highlight: 'bg-emerald-100 text-emerald-800 border-emerald-300/70 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-700/60',
  },
  // 2. Blue
  {
    name: 'blue',
    rowBg: 'bg-blue-50/70 dark:bg-blue-950/25 border-blue-100 dark:border-blue-900/40',
    numBadge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    highlight: 'bg-blue-100 text-blue-800 border-blue-300/70 dark:bg-blue-950/90 dark:text-blue-300 dark:border-blue-700/60',
  },
  // 3. Purple
  {
    name: 'purple',
    rowBg: 'bg-purple-50/70 dark:bg-purple-950/25 border-purple-100 dark:border-purple-900/40',
    numBadge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
    highlight: 'bg-purple-100 text-purple-800 border-purple-300/70 dark:bg-purple-950/90 dark:text-purple-300 dark:border-purple-700/60',
  },
  // 4. Amber
  {
    name: 'amber',
    rowBg: 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-100 dark:border-amber-900/40',
    numBadge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    highlight: 'bg-amber-100 text-amber-800 border-amber-300/70 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-700/60',
  },
  // 5. Rose
  {
    name: 'rose',
    rowBg: 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-100 dark:border-rose-900/40',
    numBadge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    highlight: 'bg-rose-100 text-rose-800 border-rose-300/70 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-700/60',
  },
  // 6. Teal
  {
    name: 'teal',
    rowBg: 'bg-teal-50/70 dark:bg-teal-950/25 border-teal-100 dark:border-teal-900/40',
    numBadge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
    highlight: 'bg-teal-100 text-teal-800 border-teal-300/70 dark:bg-teal-950/90 dark:text-teal-300 dark:border-teal-700/60',
  },
  // 7. Indigo
  {
    name: 'indigo',
    rowBg: 'bg-indigo-50/70 dark:bg-indigo-950/25 border-indigo-100 dark:border-indigo-900/40',
    numBadge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
    highlight: 'bg-indigo-100 text-indigo-800 border-indigo-300/70 dark:bg-indigo-950/90 dark:text-indigo-300 dark:border-indigo-700/60',
  },
  // 8. Orange
  {
    name: 'orange',
    rowBg: 'bg-orange-50/70 dark:bg-orange-950/25 border-orange-100 dark:border-orange-900/40',
    numBadge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300',
    highlight: 'bg-orange-100 text-orange-800 border-orange-300/70 dark:bg-orange-950/90 dark:text-orange-300 dark:border-orange-700/60',
  },
  // 9. Cyan
  {
    name: 'cyan',
    rowBg: 'bg-cyan-50/70 dark:bg-cyan-950/25 border-cyan-100 dark:border-cyan-900/40',
    numBadge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300',
    highlight: 'bg-cyan-100 text-cyan-800 border-cyan-300/70 dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-700/60',
  },
  // 10. Lime
  {
    name: 'lime',
    rowBg: 'bg-lime-50/70 dark:bg-lime-950/25 border-lime-100 dark:border-lime-900/40',
    numBadge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/60 dark:text-lime-300',
    highlight: 'bg-lime-100 text-lime-800 border-lime-300/70 dark:bg-lime-950/90 dark:text-lime-300 dark:border-lime-700/60',
  },
  // 11. Fuchsia
  {
    name: 'fuchsia',
    rowBg: 'bg-fuchsia-50/70 dark:bg-fuchsia-950/25 border-fuchsia-100 dark:border-fuchsia-900/40',
    numBadge: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/60 dark:text-fuchsia-300',
    highlight: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300/70 dark:bg-fuchsia-950/90 dark:text-fuchsia-300 dark:border-fuchsia-700/60',
  },
  // 12. Sky
  {
    name: 'sky',
    rowBg: 'bg-sky-50/70 dark:bg-sky-950/25 border-sky-100 dark:border-sky-900/40',
    numBadge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
    highlight: 'bg-sky-100 text-sky-800 border-sky-300/70 dark:bg-sky-950/90 dark:text-sky-300 dark:border-sky-700/60',
  },
  // 13. Violet
  {
    name: 'violet',
    rowBg: 'bg-violet-50/70 dark:bg-violet-950/25 border-violet-100 dark:border-violet-900/40',
    numBadge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    highlight: 'bg-violet-100 text-violet-800 border-violet-300/70 dark:bg-violet-950/90 dark:text-violet-300 dark:border-violet-700/60',
  },
  // 14. Pink
  {
    name: 'pink',
    rowBg: 'bg-pink-50/70 dark:bg-pink-950/25 border-pink-100 dark:border-pink-900/40',
    numBadge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',
    highlight: 'bg-pink-100 text-pink-800 border-pink-300/70 dark:bg-pink-950/90 dark:text-pink-300 dark:border-pink-700/60',
  },
  // 15. Red
  {
    name: 'red',
    rowBg: 'bg-red-50/70 dark:bg-red-950/25 border-red-100 dark:border-red-900/40',
    numBadge: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
    highlight: 'bg-red-100 text-red-800 border-red-300/70 dark:bg-red-950/90 dark:text-red-300 dark:border-red-700/60',
  },
  // 16. Yellow
  {
    name: 'yellow',
    rowBg: 'bg-yellow-50/70 dark:bg-yellow-950/25 border-yellow-100 dark:border-yellow-900/40',
    numBadge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-300',
    highlight: 'bg-yellow-100 text-yellow-800 border-yellow-300/70 dark:bg-yellow-950/90 dark:text-yellow-300 dark:border-yellow-700/60',
  },
  // 17. Green (Forest)
  {
    name: 'green',
    rowBg: 'bg-green-50/70 dark:bg-green-950/25 border-green-100 dark:border-green-900/40',
    numBadge: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300',
    highlight: 'bg-green-100 text-green-800 border-green-300/70 dark:bg-green-950/90 dark:text-green-300 dark:border-green-700/60',
  },
  // 18. Slate
  {
    name: 'slate',
    rowBg: 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60',
    numBadge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    highlight: 'bg-slate-200 text-slate-800 border-slate-300/80 dark:bg-slate-900/90 dark:text-slate-300 dark:border-slate-700/60',
  },
  // 19. Coral
  {
    name: 'coral',
    rowBg: 'bg-[#FFF5F2] dark:bg-[#3D1408]/30 border-[#FFDDD2] dark:border-[#5C2314]/50',
    numBadge: 'bg-[#FFE5DC] text-[#C2410C] dark:bg-[#7C2D12]/60 dark:text-[#FDBA74]',
    highlight: 'bg-[#FFE5DC] text-[#9A3412] border-[#FDBA74]/80 dark:bg-[#431407]/90 dark:text-[#FDBA74] dark:border-[#9A3412]',
  },
  // 20. Mint
  {
    name: 'mint',
    rowBg: 'bg-[#F0FDF9] dark:bg-[#042F2E]/30 border-[#CCFBEF] dark:border-[#115E59]/50',
    numBadge: 'bg-[#CCFBEF] text-[#0F766E] dark:bg-[#134E4A]/60 dark:text-[#5EEAD4]',
    highlight: 'bg-[#CCFBEF] text-[#115E59] border-[#5EEAD4]/80 dark:bg-[#042F2E]/90 dark:text-[#5EEAD4] dark:border-[#14B8A6]',
  },
  // 21. Lavender
  {
    name: 'lavender',
    rowBg: 'bg-[#F5F3FF] dark:bg-[#2E1065]/30 border-[#EDE9FE] dark:border-[#4C1D95]/50',
    numBadge: 'bg-[#DDD6FE] text-[#6D28D9] dark:bg-[#4C1D95]/60 dark:text-[#C4B5FD]',
    highlight: 'bg-[#DDD6FE] text-[#5B21B6] border-[#A78BFA]/80 dark:bg-[#2E1065]/90 dark:text-[#C4B5FD] dark:border-[#7C3AED]',
  },
  // 22. Bronze
  {
    name: 'bronze',
    rowBg: 'bg-[#FAF5ED] dark:bg-[#3B2816]/30 border-[#F5E6CC] dark:border-[#5A3E24]/50',
    numBadge: 'bg-[#F5E6CC] text-[#8C531B] dark:bg-[#5A3E24]/60 dark:text-[#E4BA84]',
    highlight: 'bg-[#F5E6CC] text-[#713F12] border-[#DDA76A]/80 dark:bg-[#3B2816]/90 dark:text-[#E4BA84] dark:border-[#A16207]',
  },
  // 23. Turquoise
  {
    name: 'turquoise',
    rowBg: 'bg-[#ECFEFF] dark:bg-[#083344]/30 border-[#CFFAFE] dark:border-[#155E75]/50',
    numBadge: 'bg-[#BAE6FD] text-[#0369A1] dark:bg-[#075985]/60 dark:text-[#7DD3FC]',
    highlight: 'bg-[#BAE6FD] text-[#075985] border-[#7DD3FC]/80 dark:bg-[#083344]/90 dark:text-[#7DD3FC] dark:border-[#0284C7]',
  },
  // 24. Ruby
  {
    name: 'ruby',
    rowBg: 'bg-[#FFF1F2] dark:bg-[#4C0519]/30 border-[#FFE4E6] dark:border-[#881337]/50',
    numBadge: 'bg-[#FECDD3] text-[#BE123C] dark:bg-[#881337]/60 dark:text-[#FDA4AF]',
    highlight: 'bg-[#FECDD3] text-[#9F1239] border-[#FB7185]/80 dark:bg-[#4C0519]/90 dark:text-[#FDA4AF] dark:border-[#E11D48]',
  },
  // 25. Gold
  {
    name: 'gold',
    rowBg: 'bg-[#FEFCE8] dark:bg-[#362A05]/30 border-[#FEF08A] dark:border-[#634E09]/50',
    numBadge: 'bg-[#FEF08A] text-[#854D0E] dark:bg-[#713F12]/60 dark:text-[#FDE047]',
    highlight: 'bg-[#FEF08A] text-[#713F12] border-[#FACC15]/80 dark:bg-[#362A05]/90 dark:text-[#FDE047] dark:border-[#CA8A04]',
  },
  // 26. Plum
  {
    name: 'plum',
    rowBg: 'bg-[#FAF5FF] dark:bg-[#3B0764]/30 border-[#F3E8FF] dark:border-[#581C87]/50',
    numBadge: 'bg-[#E9D5FF] text-[#7E22CE] dark:bg-[#581C87]/60 dark:text-[#D8B4FE]',
    highlight: 'bg-[#E9D5FF] text-[#6B21A8] border-[#C084FC]/80 dark:bg-[#3B0764]/90 dark:text-[#D8B4FE] dark:border-[#9333EA]',
  },
  // 27. Olive
  {
    name: 'olive',
    rowBg: 'bg-[#F7FEE7] dark:bg-[#1A2E05]/30 border-[#ECFCCB] dark:border-[#365314]/50',
    numBadge: 'bg-[#D9F99D] text-[#4D7C0F] dark:bg-[#365314]/60 dark:text-[#BEF264]',
    highlight: 'bg-[#D9F99D] text-[#3F6212] border-[#A3E635]/80 dark:bg-[#1A2E05]/90 dark:text-[#BEF264] dark:border-[#65A30D]',
  },
  // 28. Sapphire
  {
    name: 'sapphire',
    rowBg: 'bg-[#EFF6FF] dark:bg-[#172554]/30 border-[#DBEAFE] dark:border-[#1E3A8A]/50',
    numBadge: 'bg-[#BFDBFE] text-[#1D4ED8] dark:bg-[#1E40AF]/60 dark:text-[#93C5FD]',
    highlight: 'bg-[#BFDBFE] text-[#1E40AF] border-[#60A5FA]/80 dark:bg-[#172554]/90 dark:text-[#93C5FD] dark:border-[#2563EB]',
  },
  // 29. Peach
  {
    name: 'peach',
    rowBg: 'bg-[#FFF7ED] dark:bg-[#431407]/30 border-[#FFEDD5] dark:border-[#7C2D12]/50',
    numBadge: 'bg-[#FED7AA] text-[#C2410C] dark:bg-[#9A3412]/60 dark:text-[#FDBA74]',
    highlight: 'bg-[#FED7AA] text-[#9A3412] border-[#FB923C]/80 dark:bg-[#431407]/90 dark:text-[#FDBA74] dark:border-[#EA580C]',
  },
  // 30. Crimson
  {
    name: 'crimson',
    rowBg: 'bg-[#FEF2F2] dark:bg-[#450A0A]/30 border-[#FEE2E2] dark:border-[#7F1D1D]/50',
    numBadge: 'bg-[#FECACA] text-[#B91C1C] dark:bg-[#991B1B]/60 dark:text-[#FCA5A5]',
    highlight: 'bg-[#FECACA] text-[#991B1B] border-[#F87171]/80 dark:bg-[#450A0A]/90 dark:text-[#FCA5A5] dark:border-[#DC2626]',
  },
];

// Format / Beautify Engine (like Postman JSON & VS Code Format Document)
function formatAndBeautify(raw) {
  if (!raw || !raw.trim()) return '';

  // 1. Try JSON pretty-print (Postman style)
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Not JSON, continue to code / text formatting
  }

  // 2. VS Code style text / markdown alignment & clean up
  const lines = raw.split(/\r?\n/);
  const formattedLines = [];
  let prevBlank = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBlank = line.trim().length === 0;

    if (isBlank) {
      if (!prevBlank) {
        formattedLines.push('');
        prevBlank = true;
      }
    } else {
      // Trim right whitespace, clean internal double spaces
      let clean = line.trimEnd();
      clean = clean.replace(/([^\s])\s{2,}([^\s])/g, '$1 $2');
      formattedLines.push(clean);
      prevBlank = false;
    }
  }

  return formattedLines.join('\n');
}

// Render markdown formatted elements (bold, italics, inline code, headers) and unique colored replacements
function renderFormattedContent(markedText, replacementRegistry, darkMode) {
  if (!markedText) return null;

  const lines = markedText.split('\n');

  return lines.map((line, lineIdx) => {
    // Check if line is a header
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const headerClasses =
        level === 1
          ? 'text-lg font-bold text-blue-600 dark:text-blue-400 mt-2 mb-1'
          : level === 2
          ? (darkMode ? 'text-base font-bold text-white mt-1.5 mb-0.5' : 'text-base font-bold text-slate-900 mt-1.5 mb-0.5')
          : (darkMode ? 'text-sm font-semibold text-zinc-100 mt-1' : 'text-sm font-semibold text-slate-800 mt-1');

      return (
        <div key={lineIdx} className={headerClasses}>
          {renderLineWithReplacements(content, replacementRegistry)}
        </div>
      );
    }

    return (
      <div key={lineIdx} className="min-h-[1.25rem]">
        {renderLineWithReplacements(line, replacementRegistry)}
      </div>
    );
  });
}

function renderLineWithReplacements(line, replacementRegistry) {
  if (!line) return '\u00A0';

  // Split by unique replacement marker: \uE000(\d+)\uE001
  const markerRegex = /(\uE000\d+\uE001)/g;
  const parts = line.split(markerRegex);

  return parts.map((part, pIdx) => {
    const match = part.match(/^\uE000(\d+)\uE001$/);
    if (match) {
      const replId = parseInt(match[1], 10);
      const repl = replacementRegistry && replacementRegistry[replId];
      if (repl) {
        const color = RULE_COLORS[repl.ruleIdx % RULE_COLORS.length];
        return (
          <span
            key={`repl-${replId}-${pIdx}`}
            className={`inline-block ${color.highlight} font-semibold px-1.5 py-0.5 rounded-md border mx-0.5 text-xs sm:text-[13px] shadow-2xs transition-colors`}
          >
            {repl.text}
          </span>
        );
      }
    }

    return parseMarkdownFormatting(part, `p-${pIdx}`);
  });
}

function parseMarkdownFormatting(str, keyPrefix) {
  if (!str) return '';

  // Match bold **text**, italic *text*, and inline `code`
  const mdRegex = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  const parts = str.split(mdRegex);

  return parts.map((part, idx) => {
    const k = `${keyPrefix}-${idx}`;

    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return (
        <strong key={k} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return (
        <em key={k} className="italic text-slate-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={k}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-pink-600 dark:bg-zinc-900 dark:text-pink-400 border border-slate-200 dark:border-zinc-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_darkMode');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [inputText, setInputText] = useState(() => {
    try {
      return localStorage.getItem('tt_inputText') || '';
    } catch {
      return '';
    }
  });

  const [ignoreCase, setIgnoreCase] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_ignoreCase');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Default true as requested
  const [matchWholeWords, setMatchWholeWords] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_matchWholeWords');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('tt_rules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: '1', find: '', replace: '' },
      { id: '2', find: '', replace: '' },
    ];
  });

  const [copied, setCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('tt_activeTab') || 'diff-checker';
    } catch {
      return 'diff-checker';
    }
  });
  const [fontSize, setFontSize] = useState(() => {
    try {
      return localStorage.getItem('tt_fontSize') || 'text-xs';
    } catch {
      return 'text-xs';
    }
  });
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = React.useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('tt_activeTab', activeTab);
    } catch {}
  }, [activeTab]);

  // Undo / Redo history stacks for Input Text
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Sync dark mode class to html element (pure black #000000)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('tt_darkMode', JSON.stringify(darkMode));
    } catch {}
  }, [darkMode]);

  // Persist input text & options to localStorage (pure client-side, zero backend/mongo needed)
  useEffect(() => {
    try {
      localStorage.setItem('tt_inputText', inputText);
    } catch {}
  }, [inputText]);

  useEffect(() => {
    try {
      localStorage.setItem('tt_ignoreCase', JSON.stringify(ignoreCase));
    } catch {}
  }, [ignoreCase]);

  useEffect(() => {
    try {
      localStorage.setItem('tt_matchWholeWords', JSON.stringify(matchWholeWords));
    } catch {}
  }, [matchWholeWords]);

  useEffect(() => {
    try {
      localStorage.setItem('tt_rules', JSON.stringify(rules));
    } catch {}
  }, [rules]);

  useEffect(() => {
    try {
      localStorage.setItem('tt_fontSize', fontSize);
    } catch {}
  }, [fontSize]);

  const showToast = (message, type = 'success', title = '') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    const defaultTitle = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification';
    setToast({ message, type, title: title || defaultTitle });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Rule Handlers
  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      { id: Date.now().toString(), find: '', replace: '' },
    ]);
  };

  const handleUpdateRule = (id, field, value) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRule = (id) => {
    if (rules.length <= 1) {
      setRules([{ id: Date.now().toString(), find: '', replace: '' }]);
      return;
    }
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllRules = () => {
    setRules([
      { id: '1', find: '', replace: '' },
      { id: '2', find: '', replace: '' },
    ]);
    showToast('All find and replace rules have been cleared.', 'info', 'Rules Cleared');
  };

  const handleInputChange = (newVal) => {
    if (newVal === inputText) return;
    setUndoStack((prev) => {
      const next = [...prev, inputText];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
    setRedoStack([]);
    setInputText(newVal);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prevText = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, inputText]);
    setInputText(prevText);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextText = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, inputText]);
    setInputText(nextText);
  };

  const handleTextareaKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      if (e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else {
        e.preventDefault();
        handleUndo();
      }
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
      e.preventDefault();
      handleRedo();
    }
  };

  const handleClearText = () => {
    if (!inputText) return;
    setUndoStack((prev) => {
      const next = [...prev, inputText];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
    setRedoStack([]);
    setInputText('');
    showToast('Input text cleared (Undo available via ↶)', 'info', 'Text Cleared');
  };

  // Transformation Engine (Collision-proof per-replacement tracking)
  const { outputText, markedText, replacementRegistry, totalReplacements } = useMemo(() => {
    if (!inputText) {
      return { outputText: '', markedText: '', replacementRegistry: [], totalReplacements: 0 };
    }

    const activeRules = rules.filter((r) => r.find && r.find.trim() !== '');
    if (activeRules.length === 0) {
      return { outputText: inputText, markedText: inputText, replacementRegistry: [], totalReplacements: 0 };
    }

    let currentMarked = inputText;
    let currentClean = inputText;
    let count = 0;
    const registry = [];

    activeRules.forEach((rule, ruleIdx) => {
      const escaped = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = matchWholeWords ? `\\b${escaped}\\b` : escaped;
      const flags = ignoreCase ? 'gi' : 'g';

      try {
        const regexClean = new RegExp(pattern, flags);
        const matches = currentClean.match(regexClean);
        if (matches) {
          count += matches.length;
        }
        currentClean = currentClean.replace(regexClean, rule.replace ?? '');

        // For marked text, replace each match with a unique collision-proof marker
        const regexMark = new RegExp(pattern, flags);
        currentMarked = currentMarked.replace(regexMark, () => {
          const replId = registry.length;
          registry.push({
            id: replId,
            ruleIdx,
            text: rule.replace ?? '',
          });
          return `\uE000${replId}\uE001`;
        });
      } catch (e) {
        console.warn('Regex error:', e);
      }
    });

    return {
      outputText: currentClean,
      markedText: currentMarked,
      replacementRegistry: registry,
      totalReplacements: count,
    };
  }, [inputText, rules, ignoreCase, matchWholeWords]);

  // Beautify Action
  const handleBeautify = () => {
    if (!outputText) return;
    setUndoStack((prev) => {
      const next = [...prev, inputText];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
    setRedoStack([]);
    setInputText((prev) => formatAndBeautify(prev));
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    } catch (e) {}
    showToast('Beautified & Formatted! (VS Code / Postman style)');
  };

  // Metrics
  const countStats = (text) => {
    const chars = text ? text.length : 0;
    const words = text && text.trim() ? text.trim().split(/\s+/).length : 0;
    return { chars, words };
  };

  const inputStats = useMemo(() => countStats(inputText), [inputText]);
  const outputStats = useMemo(() => countStats(outputText), [outputText]);

  // Copy Result (Copies clean formatted text without HTML artifacts)
  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
      } catch (e) {}
      showToast('Text copied to clipboard successfully!', 'success', 'Copied');
    } catch (e) {
      showToast('Failed to copy text to clipboard.', 'error', 'Error');
    }
  };

  // Download as PDF (Pure Client-side jsPDF)
  const handleDownloadPdf = (customFileName) => {
    if (!outputText) {
      showToast('No text available to export.', 'info', 'Empty Text');
      return;
    }
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const margin = 45;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;
      let cursorY = 50;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('Processed Document', margin, cursorY);
      cursorY += 20;

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated with TextTools • ${new Date().toLocaleString()}`, margin, cursorY);
      cursorY += 15;

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 18;

      // Summary Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, cursorY, maxLineWidth, 32, 4, 4, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `Total Replacements: ${totalReplacements}   |   Words: ${outputStats.words}   |   Characters: ${outputStats.chars}`,
        margin + 12,
        cursorY + 20
      );
      cursorY += 44;

      // Body text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      const splitText = doc.splitTextToSize(String(outputText), maxLineWidth);
      const lineHeight = 14;

      for (let i = 0; i < splitText.length; i++) {
        if (cursorY + lineHeight > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(splitText[i], margin, cursorY);
        cursorY += lineHeight;
      }

      const cleanName = (typeof customFileName === 'string' && customFileName.trim()) ? customFileName.trim() : 'transformed-text';
      const saveName = `${cleanName}.pdf`;
      doc.save(saveName);
      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.85 } });
      } catch (e) {}
      showToast(`Saved as ${saveName}`, 'success', 'PDF Exported');
    } catch (e) {
      console.error('PDF Generation Error:', e);
      showToast('Failed to generate PDF document.', 'error', 'Export Failed');
    }
  };

  // Download as TXT (supports custom file name)
  const handleDownloadTxt = (customFileName) => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const saveName = `${(customFileName || 'transformed-text').trim()}.txt`;
      a.href = url;
      a.download = saveName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      showToast(`Saved as ${saveName}`, 'success', 'Downloaded');
    } catch (e) {
      showToast('Failed to download TXT file.', 'error', 'Download Failed');
    }
  };

  // Unified download handler triggered from the popup modal
  const handleDownloadFile = ({ fileName, format }) => {
    if (format === 'pdf') {
      handleDownloadPdf(fileName);
    } else {
      handleDownloadTxt(fileName);
    }
  };

  return (
    <div
      className={`h-screen max-h-screen flex flex-col overflow-hidden transition-colors duration-150 select-text ${
        darkMode ? 'bg-black text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top Right Toast Alert (Full medium toaster with soft normal colors) */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`min-w-[320px] max-w-sm p-3.5 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-md transition-all ${
              toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-900 dark:bg-zinc-950 dark:border-rose-900/60 dark:text-rose-200'
                : toast.type === 'info'
                ? 'bg-sky-50/95 border-sky-200 text-sky-900 dark:bg-zinc-950 dark:border-sky-900/60 dark:text-sky-200'
                : 'bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-zinc-950 dark:border-emerald-900/60 dark:text-emerald-200'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-xs font-bold leading-tight mb-0.5">
                {toast.title}
              </div>
              <div className="text-xs opacity-90 leading-relaxed font-normal">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 p-0.5 rounded-lg shrink-0 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slim Compact Top Header (Fits in 100% view without scroll) */}
      <header
        className={`shrink-0 border-b transition-colors ${
          darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="w-full px-4 sm:px-6 h-13 flex items-center justify-between">
          {/* Logo & Slogan */}
          <div
            onClick={() => setActiveTab('find-replace')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <img
              src="/favicon-64x64.png"
              alt="TextTools Logo"
              className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 shrink-0 rounded-xl shadow-2xs select-none object-contain"
            />
            <div className="flex flex-col justify-center select-none">
              <div className="flex items-center leading-none">
                <span className={`text-lg sm:text-xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Text
                </span>
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-600">
                  Tools
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-zinc-400 tracking-tight leading-tight mt-0.5">
                Find. Replace. Transform.
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (From Image) */}
          <nav className="hidden md:flex items-center gap-1.5 select-none">
            <button
              type="button"
              onClick={() => setActiveTab('find-replace')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'find-replace'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Find & Replace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('diff-checker')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'diff-checker'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Diff Checker</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text-transform')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'text-transform'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text Transform</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('more-tools')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'more-tools'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>More Tools</span>
            </button>
          </nav>

          {/* Right Header Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? 'border-zinc-800 bg-black text-yellow-400 hover:bg-zinc-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title={darkMode ? 'Switch to Pure White Light Mode' : 'Switch to Pure Black Dark Mode'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'border-zinc-800 bg-black text-zinc-400 hover:text-white hover:bg-zinc-900'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              title="Settings & Preferences"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* User Avatar Circle from Screenshot */}
            <div
              className={`w-7 h-7 rounded-xl border flex items-center justify-center font-bold text-xs select-none shadow-2xs ${
                darkMode
                  ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                  : 'bg-purple-100 border-purple-200 text-purple-700'
              }`}
              title="Jyothisai"
            >
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Screen Router */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Vertical Sidebar (Matching Screenshot) */}
        <aside
          className={`shrink-0 w-16 sm:w-18 border-r flex flex-col items-center py-4 gap-3 select-none transition-colors ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          {[
            { id: 'find-replace', label: 'Find &\nReplace', icon: Search },
            { id: 'diff-checker', label: 'Diff\nChecker', icon: ArrowRightLeft },
            { id: 'text-transform', label: 'Text\nTransform', icon: Type },
            { id: 'more-tools', label: 'More\nTools', icon: LayoutGrid },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-13 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-900 border border-transparent font-medium'
                }`}
                title={item.id}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="text-[9px] leading-tight text-center whitespace-pre-line tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Tool Content Router */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Diff Checker Screen */}
          {activeTab === 'diff-checker' && (
            <div className="flex-1 min-h-0 flex flex-col w-full mx-auto px-4 sm:px-6 py-3.5 overflow-hidden">
              <DiffChecker darkMode={darkMode} showToast={showToast} />
            </div>
          )}

          {/* Text Transform Screen */}
          {activeTab === 'text-transform' && (
            <div className="flex-1 min-h-0 flex flex-col max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-3.5 overflow-hidden">
              <TextTransform darkMode={darkMode} showToast={showToast} />
            </div>
          )}

          {/* More Tools Screen */}
          {activeTab === 'more-tools' && (
            <div className="flex-1 min-h-0 flex flex-col max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-3.5 overflow-hidden">
              <div
                className={`rounded-2xl border p-5 flex flex-col gap-4 shadow-xs ${
                  darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div>
                  <h2 className="text-xl font-black tracking-tight">
                    <span>Developer</span> <span className="text-blue-600">Text Tools</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Select a tool to launch and process your text.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => setActiveTab('find-replace')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all shadow-2xs"
                  >
                    <Search className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="font-bold text-sm">Find & Replace</div>
                    <div className="text-xs text-slate-400 mt-1">Multi-rule collision-free regex replacer</div>
                  </div>
                  <div
                    onClick={() => setActiveTab('diff-checker')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all shadow-2xs"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="font-bold text-sm">Diff Checker</div>
                    <div className="text-xs text-slate-400 mt-1">Side-by-side & unified text comparison</div>
                  </div>
                  <div
                    onClick={() => setActiveTab('text-transform')}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all shadow-2xs"
                  >
                    <Type className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="font-bold text-sm">Text Transform</div>
                    <div className="text-xs text-slate-400 mt-1">Case convert, Base64, URL encoding</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Find & Replace Screen */}
          {activeTab === 'find-replace' && (
            <div className="flex-1 min-h-0 flex flex-col max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-3.5 gap-3.5 overflow-hidden">
              {/* Hero Banner: Full-Bleed Realistic Banner with HD Background & Right Illustration */}
              <div
                className={`shrink-0 w-full rounded-2xl border overflow-hidden shadow-xs relative flex items-center transition-all min-h-[125px] sm:min-h-[135px] ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-800'
                    : 'bg-gradient-to-r from-white via-sky-50/70 to-[#E4EDFD] border-blue-100/90'
                }`}
              >
          {/* Right Illustration: Anchored to the right, full height, 100% UNCLIPPED & complete */}
          <div
            className={`absolute right-0 top-0 bottom-0 h-full w-auto flex items-center justify-end select-none pointer-events-none overflow-hidden ${
              darkMode ? 'opacity-40' : 'opacity-100'
            }`}
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%, black 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 35%, black 100%)',
            }}
          >
            <img
              src="/hero-banner-bg-hd.png"
              alt=""
              className="h-full w-auto object-contain object-right max-w-none"
            />
          </div>

          {/* Left Text Content & Pills */}
          <div className="relative z-10 px-5 py-3 sm:px-7 sm:py-3.5 space-y-1.5 sm:space-y-2 max-w-[62%] sm:max-w-[60%] lg:max-w-[65%]">
            <h2 className={`text-xl sm:text-2xl lg:text-[25px] font-extrabold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Find & Replace <span className="text-blue-600">Multiple Text</span>
            </h2>
            <p className={`text-xs sm:text-[13px] leading-normal line-clamp-2 sm:line-clamp-none ${darkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
              Replace multiple words or phrases in your text instantly. Paste, add your rules, and get the transformed text with one click.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 shadow-2xs backdrop-blur-xs ${
                darkMode ? 'bg-black/80 border-zinc-700 text-zinc-200' : 'bg-white/95 border-slate-200/90 text-slate-700'
              }`}>
                <Zap className="w-3 h-3 text-blue-500" />
                Multiple replacements
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 shadow-2xs backdrop-blur-xs ${
                darkMode ? 'bg-black/80 border-zinc-700 text-zinc-200' : 'bg-white/95 border-slate-200/90 text-slate-700'
              }`}>
                <Eye className="w-3 h-3 text-blue-500" />
                Instant preview
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 shadow-2xs backdrop-blur-xs ${
                darkMode ? 'bg-black/80 border-zinc-700 text-zinc-200' : 'bg-white/95 border-slate-200/90 text-slate-700'
              }`}>
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                100% private
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 shadow-2xs backdrop-blur-xs ${
                darkMode ? 'bg-black/80 border-zinc-700 text-zinc-200' : 'bg-white/95 border-slate-200/90 text-slate-700'
              }`}>
                <Download className="w-3 h-3 text-blue-600" />
                Copy & Download
              </span>
            </div>
          </div>
        </div>

        {/* 3-Card Main Grid (flex-1 min-h-0 with INTERNAL SCROLLING - Never stretches the page!) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Card 1: Find & Replace Rules */}
          <div
            className={`lg:col-span-4 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden transition-colors shadow-xs ${
              darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header (Matching Image 4) */}
            <div className="shrink-0 flex items-start justify-between mb-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      Replacement Rules
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/60">
                      {rules.length} {rules.length === 1 ? 'rule' : 'rules'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                    Changes apply instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearAllRules}
                className="px-3 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 border border-rose-200 hover:border-rose-300 dark:border-rose-900/60 rounded-xl flex items-center gap-1.5 transition-colors hover:bg-rose-50 dark:hover:bg-zinc-900 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>

            {/* Subheader Bar (Soft banner matching Image 4) */}
            <div className="shrink-0 bg-slate-50 dark:bg-zinc-900/80 rounded-xl px-3.5 py-2 mb-2 flex items-center text-xs font-semibold text-slate-700 dark:text-zinc-300 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 shrink-0"></div>
              <div className="flex-1 flex items-center gap-1.5 pl-1">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>Find</span>
              </div>
              <div className="flex-1 flex items-center gap-1.5 pl-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>Replace with</span>
              </div>
              <div className="w-6 shrink-0"></div>
            </div>

            {/* Rules List (Image 4 colored card containers with numbered badges) */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {rules.map((rule, idx) => {
                const color = RULE_COLORS[idx % RULE_COLORS.length];
                return (
                  <div
                    key={rule.id}
                    className={`rounded-2xl border p-2 flex items-center gap-2 transition-all ${color.rowBg}`}
                  >
                    {/* Number Badge (1, 2, 3...) */}
                    <div className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${color.numBadge}`}>
                      {idx + 1}
                    </div>

                    {/* Find Input */}
                    <input
                      type="text"
                      value={rule.find}
                      onChange={(e) => handleUpdateRule(rule.id, 'find', e.target.value)}
                      placeholder="e.g. apple"
                      className={`flex-1 min-w-0 px-3 py-1.5 text-xs rounded-xl border focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                        darkMode
                          ? 'bg-black border-zinc-800 text-white placeholder-zinc-600'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />

                    {/* Replace With Input */}
                    <input
                      type="text"
                      value={rule.replace}
                      onChange={(e) => handleUpdateRule(rule.id, 'replace', e.target.value)}
                      placeholder="e.g. orange"
                      className={`flex-1 min-w-0 px-3 py-1.5 text-xs rounded-xl border focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${
                        darkMode
                          ? 'bg-black border-zinc-800 text-white placeholder-zinc-600'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-zinc-900 rounded-lg transition-colors shrink-0"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Replacement Button (Matches Image 4) */}
            <div className="shrink-0 pt-2.5 mt-1 border-t border-slate-100 dark:border-zinc-850">
              <button
                onClick={handleAddRule}
                className={`w-full py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] ${
                  darkMode
                    ? 'bg-zinc-900 hover:bg-zinc-850 text-blue-400 border border-zinc-800'
                    : 'bg-blue-50 hover:bg-blue-100/80 text-blue-600 border border-blue-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Replacement
              </button>
            </div>
          </div>

          {/* Card 2: Input Text (Scrollable Textarea, Toggles at bottom) */}
          <div
            className={`lg:col-span-4 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden transition-colors shadow-xs ${
              darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Input Text
                  </h3>
                </div>

                {/* Separate Undo & Redo buttons (not in same pill) */}
                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    title="Undo (Ctrl+Z)"
                    aria-label="Undo"
                    className={`p-1.5 rounded-lg border transition-all ${
                      undoStack.length === 0
                        ? 'opacity-25 cursor-not-allowed border-slate-200/60 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'
                        : darkMode
                        ? 'border-zinc-800 bg-black text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer active:scale-95'
                        : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95 shadow-2xs'
                    }`}
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
                    aria-label="Redo"
                    className={`p-1.5 rounded-lg border transition-all ${
                      redoStack.length === 0
                        ? 'opacity-25 cursor-not-allowed border-slate-200/60 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'
                        : darkMode
                        ? 'border-zinc-800 bg-black text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer active:scale-95'
                        : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95 shadow-2xs'
                    }`}
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Characters: {inputStats.chars} | Words: {inputStats.words}
              </span>
            </div>

            {/* Scrollable Textarea */}
            <div
              className={`flex-1 min-h-0 rounded-xl p-2.5 border transition-colors overflow-hidden ${
                darkMode
                  ? 'bg-black border-zinc-800 focus-within:border-blue-600'
                  : 'bg-white border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100'
              }`}
            >
              <textarea
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="Paste your text here..."
                className={`w-full h-full ${fontSize} leading-relaxed border-none resize-none outline-none font-sans overflow-y-auto ${
                  darkMode ? 'bg-black text-white placeholder-zinc-600' : 'bg-white text-slate-800 placeholder-slate-400'
                }`}
                spellCheck={false}
              />
            </div>

            {/* Bottom Footer from Image 1 */}
            <div className="shrink-0 pt-2.5 mt-1.5 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ignoreCase}
                    onChange={(e) => setIgnoreCase(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    Ignore case
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={matchWholeWords}
                    onChange={(e) => setMatchWholeWords(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    Match whole words only
                  </span>
                </label>
              </div>

              <button
                onClick={handleClearText}
                disabled={!inputText}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                  darkMode
                    ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>

          {/* Card 3: Output Text (Formatted view with Bold/Italic/Markdown and Green Replacements) */}
          <div
            className={`lg:col-span-4 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden relative transition-colors shadow-xs ${
              darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Output Preview
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Characters: {outputStats.chars} | Words: {outputStats.words}
              </span>
            </div>

            {/* Scrollable Rich Output Area (renders markdown and distinct color highlights per word) */}
            <div
              className={`flex-1 min-h-0 rounded-xl p-2.5 border overflow-y-auto ${fontSize} leading-relaxed font-sans transition-colors ${
                darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
              }`}
            >
              {outputText ? (
                renderFormattedContent(markedText, replacementRegistry, darkMode)
              ) : (
                <span className="text-slate-400 dark:text-zinc-600 italic">
                  Transformed text will automatically appear here with replacement highlights...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar (Compact, sharp, matching Image 2 reference) */}
        <div
          className={`shrink-0 rounded-2xl border px-3 py-2 flex flex-wrap items-center justify-between gap-2.5 shadow-xs transition-colors ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Left: Enhanced Replacements Count (Clean, sharp contrast, refined typography) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 select-none">
            <span className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-white tabular-nums tracking-tight">
              {totalReplacements}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 tracking-tight">
              {totalReplacements === 1 ? 'replacement applied' : 'replacements applied'}
            </span>
          </div>

          {/* Right: Sharp Action Buttons with equipped icons (Image 2) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Result */}
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>

            {/* Single Unified Download Button (Opens popup modal) */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              disabled={!outputText}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-2xs ${
                darkMode
                  ? 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-200'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
              title="Download transformed text as PDF or TXT"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Download
            </button>

            {/* Beautify */}
            <button
              onClick={handleBeautify}
              disabled={!outputText}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-2xs ${
                darkMode
                  ? 'bg-emerald-950/30 hover:bg-emerald-900/50 border-emerald-900/60 text-emerald-400'
                  : 'bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
              }`}
              title="Auto-format and align text (like Postman & VS Code Prettier)"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Beautify
            </button>

            {/* Clear Text */}
            <button
              onClick={handleClearText}
              disabled={!inputText}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-2xs ${
                darkMode
                  ? 'bg-rose-950/30 hover:bg-rose-900/50 border-rose-900/60 text-rose-400'
                  : 'bg-rose-50/80 hover:bg-rose-100 border-rose-200 text-rose-600'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Clear Text
            </button>
          </div>
        </div>
      </div>
          )}
        </main>
      </div>

      {/* Unified Download Popup Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadFile}
        darkMode={darkMode}
      />

      {/* Settings & Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        ignoreCase={ignoreCase}
        setIgnoreCase={setIgnoreCase}
        matchWholeWords={matchWholeWords}
        setMatchWholeWords={setMatchWholeWords}
        rules={rules}
        setRules={setRules}
        setInputText={setInputText}
        showToast={showToast}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />
    </div>
  );
}
