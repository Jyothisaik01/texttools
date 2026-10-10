import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Clipboard,
  Trash2,
  Upload,
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ChevronDown,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  X,
  Palette,
  Highlighter,
  Pipette,
  RemoveFormatting,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import TextTransformIllustration from './TextTransformIllustration';
import CustomDropdown from './CustomDropdown';
import DownloadModal from './DownloadModal';
import {
  UNICODE_FONT_STYLES,
  WEB_FONT_FAMILIES,
  loadGoogleFont,
} from './fontStylesCatalog';

const SAMPLE_TEXT = `Welcome to TextTools! Effortlessly transform, analyze, and format your text.`;

// Abundant Curated Colors (54 distinct shades across all color families + custom hex)
const TEXT_COLOR_PALETTE = [
  // Grayscale & Monochromes
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Dark Slate', hex: '#1E293B' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Slate Gray', hex: '#64748B' },
  { name: 'Cool Gray', hex: '#94A3B8' },
  { name: 'Light Silver', hex: '#CBD5E1' },

  // Reds & Corals
  { name: 'Dark Crimson', hex: '#7F1D1D' },
  { name: 'Ruby Red', hex: '#B91C1C' },
  { name: 'Vibrant Red', hex: '#DC2626' },
  { name: 'Bright Coral', hex: '#EF4444' },
  { name: 'Rose Red', hex: '#F43F5E' },
  { name: 'Deep Carmine', hex: '#991B1B' },

  // Oranges & Ambers
  { name: 'Rust Orange', hex: '#C2410C' },
  { name: 'Vivid Orange', hex: '#EA580C' },
  { name: 'Sunset Orange', hex: '#F97316' },
  { name: 'Tangerine', hex: '#FB923C' },
  { name: 'Dark Amber', hex: '#B45309' },
  { name: 'Golden Amber', hex: '#D97706' },

  // Yellows & Golds
  { name: 'Warm Honey', hex: '#F59E0B' },
  { name: 'Bright Gold', hex: '#FBBF24' },
  { name: 'Canary Yellow', hex: '#EAB308' },
  { name: 'Sunflower', hex: '#FACC15' },
  { name: 'Lime Gold', hex: '#84CC16' },
  { name: 'Dark Olive', hex: '#4D7C0F' },

  // Greens & Emeralds
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Deep Emerald', hex: '#065F46' },
  { name: 'Pine Green', hex: '#15803D' },
  { name: 'Classic Green', hex: '#16A34A' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Bright Mint', hex: '#34D399' },

  // Teals & Cyans
  { name: 'Deep Teal', hex: '#0F766E' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Turquoise', hex: '#14B8A6' },
  { name: 'Aqua Cyan', hex: '#06B6D4' },
  { name: 'Ocean Cyan', hex: '#0891B2' },
  { name: 'Sky Cyan', hex: '#0EA5E9' },

  // Blues & Indigos
  { name: 'Midnight Blue', hex: '#1E3A8A' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Classic Cobalt', hex: '#2563EB' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Deep Indigo', hex: '#4338CA' },

  // Purples & Violets
  { name: 'Imperial Violet', hex: '#581C87' },
  { name: 'Royal Purple', hex: '#6D28D9' },
  { name: 'Vivid Violet', hex: '#7C3AED' },
  { name: 'Amethyst', hex: '#8B5CF6' },
  { name: 'Bright Purple', hex: '#9333EA' },
  { name: 'Lavender Violet', hex: '#A855F7' },

  // Pinks & Magentas
  { name: 'Deep Plum', hex: '#701A75' },
  { name: 'Fuchsia', hex: '#A21CAF' },
  { name: 'Magenta', hex: '#C026D3' },
  { name: 'Hot Pink', hex: '#DB2777' },
  { name: 'Blush Pink', hex: '#EC4899' },
  { name: 'Soft Rose', hex: '#F472B6' },
];

const HIGHLIGHT_COLOR_PALETTE = [
  { name: 'None (Transparent)', hex: 'transparent' },
  { name: 'Neon Yellow', hex: '#FEF08A' },
  { name: 'Bright Canary', hex: '#FDE047' },
  { name: 'Golden Sunlight', hex: '#FEF9C3' },
  { name: 'Soft Peach', hex: '#FED7AA' },
  { name: 'Fluorescent Orange', hex: '#FFEDD5' },
  { name: 'Coral Glow', hex: '#FEE2E2' },
  { name: 'Neon Green', hex: '#BBF7D0' },
  { name: 'Spring Mint', hex: '#86EFAC' },
  { name: 'Pale Sage', hex: '#DCFCE7' },
  { name: 'Aqua Foam', hex: '#CCFBF1' },
  { name: 'Neon Cyan', hex: '#BAE6FD' },
  { name: 'Sky Frost', hex: '#E0F2FE' },
  { name: 'Ice Blue', hex: '#DBEAFE' },
  { name: 'Soft Periwinkle', hex: '#C7D2FE' },
  { name: 'Lavender Mist', hex: '#DDD6FE' },
  { name: 'Lilac Bloom', hex: '#E9D5FF' },
  { name: 'Cotton Pink', hex: '#FBCFE8' },
  { name: 'Rose Quartz', hex: '#FECDD3' },
  { name: 'Warm Neutral', hex: '#F1F5F9' },
  { name: 'Silver Slate', hex: '#E2E8F0' },
];

// Normalize all unicode styled characters, combining marks, brackets, and markdown into clean plain text
export function removeUnicodeAndFormatting(text) {
  if (!text) return '';

  const reverseMap = {
    // Inverted dark circled letters
    '🅐': 'A', '🅑': 'B', '🅒': 'C', '🅓': 'D', '🅔': 'E', '🅕': 'F', '🅖': 'G', '🅗': 'H', '🅘': 'I', '🅙': 'J',
    '🅚': 'K', '🅛': 'L', '🅜': 'M', '🅝': 'N', '🅞': 'O', '🅟': 'P', '🅠': 'Q', '🅡': 'R', '🅢': 'S', '🅣': 'T',
    '🅤': 'U', '🅥': 'V', '🅦': 'W', '🅧': 'X', '🅨': 'Y', '🅩': 'Z',
    // Inverted dark squared letters
    '🅰': 'A', '🅱': 'B', '🅲': 'C', '🅳': 'D', '🅴': 'E', '🅵': 'F', '🅶': 'G', '🅷': 'H', '🇮': 'I', '🅹': 'J',
    '🅺': 'K', '🅻': 'L', '🅼': 'M', '🅽': 'N', '🅾': 'O', '🅿': 'P', '🆀': 'Q', '🆁': 'R', '🆂': 'S', '🆃': 'T',
    '🆄': 'U', '🆅': 'V', '🆆': 'W', '🆇': 'X', '🆈': 'Y', '🆉': 'Z',
    // Small caps
    'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ꜰ': 'f', 'ɢ': 'g', 'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j',
    'ᴋ': 'k', 'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o', 'ᴘ': 'p', 'ǫ': 'q', 'ʀ': 'r', 'ꜱ': 's', 'ᴛ': 't',
    'ᴜ': 'u', 'ᴠ': 'v', 'ᴡ': 'w', 'ʏ': 'y', 'ᴢ': 'z',
    // Upside down
    'ɐ': 'a', 'q': 'b', 'ɔ': 'c', 'p': 'd', 'ǝ': 'e', 'ɟ': 'f', 'ƃ': 'g', 'ɥ': 'h', 'ᴉ': 'i', 'ɾ': 'j',
    'ʞ': 'k', 'l': 'l', 'ɯ': 'm', 'u': 'n', 'o': 'o', 'd': 'p', 'b': 'q', 'ɹ': 'r', 's': 's', 'ʇ': 't',
    'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y', 'z': 'z',
    '∀': 'A', '𐐒': 'B', 'Ɔ': 'C', 'ᗡ': 'D', 'Ǝ': 'E', 'Ⅎ': 'F', '⅁': 'G', 'H': 'H', 'I': 'I', 'ſ': 'J',
    '˥': 'L', 'W': 'M', 'N': 'N', 'O': 'O', 'Ԁ': 'P', 'Ό': 'Q', 'ᴚ': 'R', 'S': 'S', '┴': 'T',
    '∩': 'U', 'Λ': 'V', 'X': 'X', '⅄': 'Y', 'Z': 'Z',
    // Superscript
    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j',
    'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u',
    'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z',
    'ᴬ': 'A', 'ᴮ': 'B', 'ᴰ': 'D', 'ᴱ': 'E', 'ᴳ': 'G', 'ᴴ': 'H', 'ᴵ': 'I', 'ᴶ': 'J', 'ᴷ': 'K', 'ᴸ': 'L',
    'ᴹ': 'M', 'ᴺ': 'N', 'ᴼ': 'O', 'ᴾ': 'P', 'ᴿ': 'R', 'ᵀ': 'T', 'ᵁ': 'U', 'ᵂ': 'W',
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    // Subscript
    'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o',
    'ₚ': 'p', 'ᵣ': 'r', 'ₛ': 's', 'ₜ': 't', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x',
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };

  let unmapped = '';
  for (const ch of text) {
    unmapped += reverseMap[ch] !== undefined ? reverseMap[ch] : ch;
  }

  // Decompose all Unicode fonts (bold, italic, script, fraktur, double-struck, monospace, circled, squared, fullwidth)
  let normalized = unmapped.normalize('NFKD');

  // Strip all combining diacritical marks (strikethrough \u0336, underline \u0332, double underline \u0333, overline \u0305, zalgo)
  normalized = normalized.replace(/[\u0300-\u036f\u0489\u20d0-\u20ff]/g, '');

  // Strip decorative brackets/sparkles, markdown, and html tags
  normalized = normalized
    .replace(/^【\s*|\s*】$/g, '')
    .replace(/^✨\s*|\s*✨$/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_~`#]/g, '');

  return normalized;
}

// Update, merge, and split highlight intervals cleanly
export function updateHighlightRanges(currentHighlights, newStart, newEnd, color, textLen) {
  const start = Math.max(0, Math.min(newStart, textLen));
  const end = Math.max(start, Math.min(newEnd, textLen));
  if (start >= end) return currentHighlights;

  // Cut existing intervals by [start, end]
  const remaining = [];
  for (const h of currentHighlights) {
    if (h.end <= start || h.start >= end) {
      // Completely outside the new range
      remaining.push(h);
    } else {
      // Overlaps with the new range
      if (h.start < start) {
        remaining.push({ start: h.start, end: start, color: h.color });
      }
      if (h.end > end) {
        remaining.push({ start: end, end: h.end, color: h.color });
      }
    }
  }

  // If color is not transparent, add the new interval
  if (color && color !== 'transparent') {
    remaining.push({ start, end, color });
  }

  // Sort by start position
  remaining.sort((a, b) => a.start - b.start);

  // Merge adjacent intervals with identical color
  const merged = [];
  for (const item of remaining) {
    if (merged.length > 0) {
      const last = merged[merged.length - 1];
      if (last.end === item.start && last.color.toLowerCase() === item.color.toLowerCase()) {
        last.end = item.end;
        continue;
      }
    }
    merged.push({ ...item });
  }

  return merged;
}

// Keep highlight positions accurate when user types, deletes, or modifies text
export function adjustHighlightsOnTextChange(highlights, oldText, newText, cursorPos) {
  if (!highlights || highlights.length === 0) return [];
  const delta = newText.length - oldText.length;
  if (delta === 0) {
    return highlights
      .map((h) => ({
        ...h,
        start: Math.max(0, Math.min(h.start, newText.length)),
        end: Math.max(h.start, Math.min(h.end, newText.length)),
      }))
      .filter((h) => h.start < h.end);
  }

  const editPos = typeof cursorPos === 'number' ? cursorPos : oldText.length;

  return highlights
    .map((h) => {
      let s = h.start;
      let e = h.end;

      if (editPos <= s) {
        s += delta;
        e += delta;
      } else if (editPos < e) {
        e += delta;
      }

      s = Math.max(0, Math.min(s, newText.length));
      e = Math.max(s, Math.min(e, newText.length));

      return { ...h, start: s, end: e };
    })
    .filter((h) => h.start < h.end);
}

// Render synchronized background highlight spans for editor backdrop
export function renderHighlightSpans(text, highlights) {
  if (!text) return null;
  if (!highlights || highlights.length === 0) {
    return <span style={{ color: 'transparent' }}>{text}</span>;
  }

  const spans = [];
  let currentIndex = 0;

  for (let i = 0; i < highlights.length; i++) {
    const { start, end, color } = highlights[i];
    const clampedStart = Math.max(0, Math.min(start, text.length));
    const clampedEnd = Math.max(clampedStart, Math.min(end, text.length));

    if (clampedStart > currentIndex) {
      spans.push(
        <span key={`plain-${currentIndex}`} style={{ color: 'transparent' }}>
          {text.slice(currentIndex, clampedStart)}
        </span>
      );
    }

    if (clampedEnd > clampedStart) {
      spans.push(
        <mark
          key={`hl-${clampedStart}-${clampedEnd}`}
          style={{
            backgroundColor: color,
            color: 'transparent',
            borderRadius: '3px',
            padding: 0,
            margin: 0,
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}
        >
          {text.slice(clampedStart, clampedEnd)}
        </mark>
      );
      currentIndex = clampedEnd;
    }
  }

  if (currentIndex < text.length) {
    spans.push(
      <span key={`plain-${currentIndex}`} style={{ color: 'transparent' }}>
        {text.slice(currentIndex)}
      </span>
    );
  }

  return spans;
}

// Render visible highlighted spans in transformed output preview
export function renderTransformedSpans(text, highlights) {
  if (!text) return null;
  if (!highlights || highlights.length === 0) return text;

  const spans = [];
  let currentIndex = 0;

  for (let i = 0; i < highlights.length; i++) {
    const { start, end, color } = highlights[i];
    const clampedStart = Math.max(0, Math.min(start, text.length));
    const clampedEnd = Math.max(clampedStart, Math.min(end, text.length));

    if (clampedStart > currentIndex) {
      spans.push(text.slice(currentIndex, clampedStart));
    }

    if (clampedEnd > clampedStart) {
      spans.push(
        <mark
          key={`trans-hl-${clampedStart}-${clampedEnd}`}
          style={{
            backgroundColor: color,
            color: '#0f172a',
            borderRadius: '2px',
            padding: '1px 2px',
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
          }}
        >
          {text.slice(clampedStart, clampedEnd)}
        </mark>
      );
      currentIndex = clampedEnd;
    }
  }

  if (currentIndex < text.length) {
    spans.push(text.slice(currentIndex));
  }

  return spans;
}

export default function TextTransform({ darkMode, showToast }) {
  // Core text state with Undo/Redo history
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [history, setHistory] = useState([SAMPLE_TEXT]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Formatting state
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedFontSize, setSelectedFontSize] = useState('16px');
  const [selectedBlock, setSelectedBlock] = useState('Paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textColor, setTextColor] = useState('#2563EB');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [alignment, setAlignment] = useState('left');

  // Text highlighting state: array of { start: number, end: number, color: string }
  const [textHighlights, setTextHighlights] = useState([]);
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const selectionRef = useRef({ start: 0, end: 0 });
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const lineGutterRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // UI Dropdowns & Modals
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [fontModalTab, setFontModalTab] = useState('All');
  const [fontModalSearch, setFontModalSearch] = useState('');

  // Selected transformation state
  const [selectedTransformId, setSelectedTransformId] = useState('uppercase');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Pre-load common Google Fonts on mount
  useEffect(() => {
    WEB_FONT_FAMILIES.slice(0, 30).forEach((f) => loadGoogleFont(f.name));
  }, []);

  // Measure textarea scrollbar to maintain 1:1 backdrop wrap alignment
  useEffect(() => {
    if (textareaRef.current) {
      const sbw = textareaRef.current.offsetWidth - textareaRef.current.clientWidth;
      setScrollbarWidth(sbw);
    }
  }, [inputText, selectedFontSize]);

  // Close color popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setIsColorPickerOpen(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target)) {
        setIsHighlightPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track selection ranges inside the editor textarea
  const handleSelectionChange = (e) => {
    const start = e.target.selectionStart || 0;
    const end = e.target.selectionEnd || 0;
    selectionRef.current = { start, end };
    setSelectionRange({ start, end });
  };

  // Synchronize scroll between textarea, highlight backdrop, and line numbers gutter
  const handleEditorScroll = (e) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.target.scrollTop;
      backdropRef.current.scrollLeft = e.target.scrollLeft;
    }
    if (lineGutterRef.current) {
      lineGutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Apply or clear highlight for selection or whole text
  const handleApplyHighlight = (color) => {
    let start = selectionRef.current.start;
    let end = selectionRef.current.end;

    if (textareaRef.current) {
      const s = textareaRef.current.selectionStart;
      const e = textareaRef.current.selectionEnd;
      if (typeof s === 'number' && typeof e === 'number' && e > s) {
        start = s;
        end = e;
      }
    }

    const hasSelection = end > start && start >= 0 && end <= inputText.length;

    if (color === 'transparent') {
      if (hasSelection) {
        setTextHighlights((prev) => updateHighlightRanges(prev, start, end, 'transparent', inputText.length));
        showToast?.('Cleared highlight for selection', 'info', 'Highlight Cleared');
      } else {
        setTextHighlights([]);
        setHighlightColor('transparent');
        showToast?.('Cleared all text highlights', 'info', 'Highlights Cleared');
      }
    } else {
      setHighlightColor(color);
      if (hasSelection) {
        setTextHighlights((prev) => updateHighlightRanges(prev, start, end, color, inputText.length));
        showToast?.('Highlighted selected text', 'success', 'Highlight Applied');
      } else {
        setTextHighlights([{ start: 0, end: inputText.length, color }]);
        showToast?.('Highlighted all text', 'success', 'Highlight Applied');
      }
    }
    setIsHighlightPickerOpen(false);
  };

  // Push new state into undo/redo history
  const updateText = (newText, cursorPos) => {
    if (newText === inputText) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    const oldText = inputText;
    setInputText(newText);

    setTextHighlights((prev) =>
      adjustHighlightsOnTextChange(prev, oldText, newText, cursorPos)
    );
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setInputText(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setInputText(next);
    }
  };

  // Remove All Styles & Convert to Plain Text
  const handleRemoveStyles = () => {
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setIsStrikethrough(false);
    setSelectedFont('Inter');
    setSelectedFontSize('16px');
    setSelectedBlock('Paragraph');
    setTextColor(darkMode ? '#FFFFFF' : '#0F172A');
    setHighlightColor('transparent');
    setTextHighlights([]);
    setAlignment('left');

    const plainText = removeUnicodeAndFormatting(inputText);
    updateText(plainText);
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
    } catch {}
    showToast?.('All styles removed • Text converted to plain text', 'info', 'Styles Cleared');
  };

  // Direct Apply Handler: Immediately transforms text, adds confetti, and shows toast
  const applyDirectly = (fn, name) => {
    try {
      if (typeof fn === 'function') {
        const result = fn(inputText);
        if (result !== undefined && result !== null) {
          updateText(result);
        }
        try {
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.85 } });
        } catch {}
        showToast?.(`Applied ${name}!`, 'success', 'Transformed');
      }
    } catch (err) {
      console.error(err);
      showToast?.(`Failed to apply ${name}`, 'error', 'Error');
    }
  };

  // Direct Apply Font Handler: Directly sets font and updates editor
  const applyFontDirectly = (fontItem) => {
    try {
      if (fontItem.type === 'webfont') {
        loadGoogleFont(fontItem.name);
        setSelectedFont(fontItem.name);
        try {
          confetti({ particleCount: 25, spread: 50, origin: { y: 0.85 } });
        } catch {}
        showToast?.(`Font set to ${fontItem.name}!`, 'success', 'Font Applied');
      } else {
        const transformFn = fontItem.fn || fontItem.transform;
        if (typeof transformFn === 'function') {
          const result = transformFn(inputText);
          updateText(result);
          try {
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.85 } });
          } catch {}
          showToast?.(`Applied ${fontItem.name}!`, 'success', 'Font Applied');
        }
      }
    } catch (err) {
      console.error(err);
      showToast?.(`Failed to apply ${fontItem.name}`, 'error', 'Error');
    }
    setIsFontModalOpen(false);
  };

  // Base Transformations Catalog (Matching 2-column screenshot)
  const caseTransformations = useMemo(
    () => [
      {
        id: 'uppercase',
        name: 'UPPERCASE',
        desc: 'Convert all characters to uppercase',
        category: 'Case',
        badge: 'AA',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        fn: (t) => t.toUpperCase(),
      },
      {
        id: 'lowercase',
        name: 'lowercase',
        desc: 'Convert all characters to lowercase',
        category: 'Case',
        badge: 'aa',
        badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
        fn: (t) => t.toLowerCase(),
      },
      {
        id: 'titlecase',
        name: 'Title Case',
        desc: 'First Letter Capital',
        category: 'Case',
        badge: 'Tt',
        badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
        fn: (t) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()),
      },
      {
        id: 'sentencecase',
        name: 'Sentence case',
        desc: 'First letter of each sentence',
        category: 'Case',
        badge: 'Aa',
        badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
        fn: (t) => t.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      },
      {
        id: 'camelcase',
        name: 'camelCase',
        desc: 'Convert to camelCase',
        category: 'Case',
        badge: '</>',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        fn: (t) =>
          t
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
            .replace(/[\s\-_]+/g, ''),
      },
      {
        id: 'snakecase',
        name: 'snake_case',
        desc: 'Convert to snake_case',
        category: 'Case',
        badge: '—',
        badgeColor: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
        fn: (t) =>
          t
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_'),
      },
      {
        id: 'kebabcase',
        name: 'kebab-case',
        desc: 'Convert to kebab-case',
        category: 'Case',
        badge: '—',
        badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        fn: (t) =>
          t
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-'),
      },
      {
        id: 'pascalcase',
        name: 'PascalCase',
        desc: 'Convert to PascalCase',
        category: 'Case',
        badge: 'Aa',
        badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
        fn: (t) =>
          t
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase())
            .replace(/[\s\-_]+/g, ''),
      },
    ],
    []
  );

  const formattingTransformations = useMemo(
    () => [
      {
        id: 'bold-fmt',
        name: 'Bold',
        desc: 'Make text bold',
        category: 'Formatting',
        badge: 'B',
        badgeColor: 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white',
        fn: (t) => {
          setIsBold((b) => !b);
          return t;
        },
      },
      {
        id: 'italic-fmt',
        name: 'Italic',
        desc: 'Make text italic',
        category: 'Formatting',
        badge: 'I',
        badgeColor: 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white italic',
        fn: (t) => {
          setIsItalic((it) => !it);
          return t;
        },
      },
      {
        id: 'underline-fmt',
        name: 'Underline',
        desc: 'Underline text',
        category: 'Formatting',
        badge: 'U',
        badgeColor: 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white underline',
        fn: (t) => {
          setIsUnderline((u) => !u);
          return t;
        },
      },
      {
        id: 'strikethrough-fmt',
        name: 'Strikethrough',
        desc: 'Strike through text',
        category: 'Formatting',
        badge: 'S',
        badgeColor: 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white line-through',
        fn: (t) => {
          setIsStrikethrough((s) => !s);
          return t;
        },
      },
      {
        id: 'clear-fmt',
        name: 'Remove Styles (Plain Text)',
        desc: 'Strip all formatting and convert to plain text',
        category: 'Formatting',
        badge: '🧹',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        fn: (t) => {
          setIsBold(false);
          setIsItalic(false);
          setIsUnderline(false);
          setIsStrikethrough(false);
          setSelectedFont('Inter');
          setSelectedFontSize('16px');
          setSelectedBlock('Paragraph');
          setTextColor(darkMode ? '#FFFFFF' : '#0F172A');
          setHighlightColor('transparent');
          setTextHighlights([]);
          setAlignment('left');
          return removeUnicodeAndFormatting(t);
        },
      },
      {
        id: 'change-font-modal',
        name: 'Change Font Family',
        desc: 'Browse 165+ font styles across all genres',
        category: 'Formatting',
        badge: 'Aa',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        fn: (t) => {
          setIsFontModalOpen(true);
          return t;
        },
      },
    ],
    [darkMode]
  );

  // Other Transformations (Encoding, Text Cleaning)
  const otherTransformations = useMemo(
    () => [
      {
        id: 'clean-whitespace',
        name: 'Trim & Clean Spaces',
        desc: 'Collapse multiple spaces and trim edges',
        category: 'Text Cleaning',
        badge: '␣',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
        fn: (t) => t.trim().replace(/[ \t]+/g, ' '),
      },
      {
        id: 'remove-empty-lines',
        name: 'Remove Empty Lines',
        desc: 'Eliminate blank lines from text',
        category: 'Text Cleaning',
        badge: '≡',
        badgeColor: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
        fn: (t) =>
          t
            .split('\n')
            .filter((l) => l.trim().length > 0)
            .join('\n'),
      },
      {
        id: 'base64-encode',
        name: 'Base64 Encode',
        desc: 'Encode text to Base64',
        category: 'Encoding',
        badge: '64',
        badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
        fn: (t) => {
          try {
            return btoa(unescape(encodeURIComponent(t)));
          } catch {
            return t;
          }
        },
      },
      {
        id: 'base64-decode',
        name: 'Base64 Decode',
        desc: 'Decode Base64 string to plain text',
        category: 'Encoding',
        badge: '64',
        badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
        fn: (t) => {
          try {
            return decodeURIComponent(escape(atob(t.trim())));
          } catch {
            return t;
          }
        },
      },
    ],
    []
  );

  // 165+ Unified Font Styles List across ALL categories
  const allFontStylesList = useMemo(() => {
    const list = [];

    // Web & Google Fonts (130+ fonts)
    WEB_FONT_FAMILIES.forEach((item) => {
      let badge = 'Aa';
      let badgeColor = 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      if (item.category === 'Cursive & Script') {
        badge = '𝒞';
        badgeColor = 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 font-serif';
      } else if (item.category === 'Serif / Roman') {
        badge = 'R';
        badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-serif';
      } else if (item.category === 'Monospace') {
        badge = '</>';
        badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono';
      } else if (item.category === 'Gothic & Fraktur') {
        badge = '𝕲';
        badgeColor = 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      } else if (item.category === 'Display & Decorative') {
        badge = '★';
        badgeColor = 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300';
      }

      list.push({
        type: 'webfont',
        id: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        category: item.category,
        family: item.family,
        desc: item.desc,
        badge,
        badgeColor,
        preview: inputText || 'The quick brown fox jumps over the lazy dog',
        fn: (t) => {
          loadGoogleFont(item.name);
          setSelectedFont(item.name);
          return t;
        },
      });
    });

    // Algorithmic Unicode Styles (35 styles)
    UNICODE_FONT_STYLES.forEach((item) => {
      list.push({
        type: 'unicode',
        id: item.id,
        name: item.name,
        category: item.category,
        desc: 'Works on clipboard & social media',
        badge: item.sample.substring(0, 2),
        badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
        preview: item.transform(inputText || 'The quick brown fox jumps over the lazy dog'),
        fn: (t) => item.transform(t),
        transform: item.transform,
      });
    });

    return list;
  }, [inputText]);

  // Combined for live preview computation
  const allTransformations = useMemo(
    () => [
      ...caseTransformations,
      ...formattingTransformations,
      ...otherTransformations,
      ...allFontStylesList,
    ],
    [caseTransformations, formattingTransformations, otherTransformations, allFontStylesList]
  );

  // Real-time transformed preview calculation
  const transformedText = useMemo(() => {
    if (!inputText) return '';
    const active = allTransformations.find((item) => item.id === selectedTransformId);
    if (!active) return inputText;
    try {
      return active.fn(inputText);
    } catch {
      return inputText;
    }
  }, [inputText, selectedTransformId, allTransformations]);

  // Modal filtered font styles (165+ items)
  const filteredModalFonts = useMemo(() => {
    return allFontStylesList.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(fontModalSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(fontModalSearch.toLowerCase());
      if (fontModalTab === 'All') return matchSearch;
      if (fontModalTab === 'Sans-Serif') return matchSearch && item.category === 'Sans-Serif';
      if (fontModalTab === 'Serif / Roman') return matchSearch && item.category === 'Serif / Roman';
      if (fontModalTab === 'Cursive & Script') return matchSearch && item.category === 'Cursive & Script';
      if (fontModalTab === 'Monospace') return matchSearch && item.category === 'Monospace';
      if (fontModalTab === 'Gothic & Fraktur') return matchSearch && item.category === 'Gothic & Fraktur';
      if (fontModalTab === 'Display & Decorative') return matchSearch && item.category === 'Display & Decorative';
      if (fontModalTab === 'Unicode Styles') return matchSearch && item.type === 'unicode';
      return matchSearch;
    });
  }, [allFontStylesList, fontModalTab, fontModalSearch]);

  // Selected font family string for editor
  const activeFontFamilyCss = useMemo(() => {
    const found = WEB_FONT_FAMILIES.find((f) => f.name === selectedFont);
    return found ? found.family : selectedFont;
  }, [selectedFont]);

  // Text metrics
  const textStats = useMemo(() => {
    const chars = inputText.length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    return { chars, words };
  }, [inputText]);

  // Quick Action Handlers
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      updateText(text);
      showToast?.('Pasted text from clipboard', 'info', 'Pasted');
    } catch {
      showToast?.('Clipboard access denied', 'error', 'Permission Denied');
    }
  };

  const handleClear = () => {
    updateText('');
    setTextHighlights([]);
    setHighlightColor('transparent');
    showToast?.('Editor cleared', 'info', 'Cleared');
  };

  const handleSample = () => {
    updateText(SAMPLE_TEXT);
    showToast?.('Loaded sample text', 'info', 'Sample Loaded');
  };

  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        updateText(content);
        showToast?.(`Loaded ${file.name}`, 'success', 'File Loaded');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopy = async (textToCopy) => {
    const target = textToCopy || (isPreviewMode ? transformedText : inputText);
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      try {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.85 } });
      } catch {}
      showToast?.('Text copied to clipboard!', 'success', 'Copied');
    } catch {
      showToast?.('Failed to copy to clipboard', 'error', 'Copy Failed');
    }
  };

  const handleDownloadPdf = (customFileName) => {
    const content = isPreviewMode ? transformedText : inputText;
    if (!content || !content.trim()) {
      showToast?.('No text content available to export to PDF', 'info', 'Empty Text');
      return;
    }
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const margin = 45;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - margin * 2;
      let cursorY = 50;

      // Document Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('Transformed Document', margin, cursorY);
      cursorY += 20;

      // Subtitle
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated with TextTools • Font: ${selectedFont} • ${new Date().toLocaleString()}`, margin, cursorY);
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
        `Characters: ${content.length}   |   Words: ${content.trim() ? content.trim().split(/\s+/).length : 0}   |   Font: ${selectedFont}   |   Font Size: ${selectedFontSize}`,
        margin + 12,
        cursorY + 20
      );
      cursorY += 44;

      // Body text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);

      const splitText = doc.splitTextToSize(String(content), maxLineWidth);
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
      showToast?.(`Saved as ${saveName}`, 'success', 'PDF Exported');
    } catch (e) {
      console.error('PDF Generation Error:', e);
      showToast?.('Failed to generate PDF document.', 'error', 'Export Failed');
    }
  };

  const handleDownloadTxt = (customFileName) => {
    const content = isPreviewMode ? transformedText : inputText;
    if (!content) {
      showToast?.('No text content available to download', 'info', 'Empty Text');
      return;
    }
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const cleanName = (typeof customFileName === 'string' && customFileName.trim()) ? customFileName.trim() : 'transformed-text';
      const saveName = `${cleanName}.txt`;
      link.href = url;
      link.download = saveName;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      link.remove();
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.85 } });
      } catch {}
      showToast?.(`Saved as ${saveName}`, 'success', 'Downloaded');
    } catch {
      showToast?.('Failed to download TXT file.', 'error', 'Download Failed');
    }
  };

  const handleDownloadFile = ({ fileName, format }) => {
    if (format === 'pdf') {
      handleDownloadPdf(fileName);
    } else {
      handleDownloadTxt(fileName);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden select-text">
      {/* 1. Hero Banner: Text Transform */}
      <div
        className={`shrink-0 w-full rounded-2xl border overflow-hidden shadow-xs relative flex items-center transition-all min-h-[125px] sm:min-h-[135px] ${
          darkMode
            ? 'bg-zinc-950 border-zinc-800'
            : 'bg-gradient-to-r from-blue-50/50 via-white to-blue-50/40 border-slate-200'
        }`}
      >
        <div className="relative z-10 p-5 sm:p-6 max-w-2xl flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>Text</span>
            <span className="text-blue-600">Transform</span>
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 mt-2 font-normal leading-relaxed max-w-xl">
            Instantly convert case styles, format text, apply 165+ abundant fonts across all genres,
            pick custom colors, and transform text.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-3.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-blue-400'
                  : 'bg-white border-blue-100 text-blue-700 shadow-2xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              165+ Font Styles
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                darkMode
                  ? 'bg-zinc-900/80 border-zinc-800 text-blue-400'
                  : 'bg-white border-blue-100 text-blue-700 shadow-2xs'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              Abundant Colors
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
          </div>
        </div>

        <div className="hidden md:flex absolute right-4 top-0 bottom-0 w-80 items-center justify-end pointer-events-none">
          <TextTransformIllustration />
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: Text Editor & Rich Formatting Toolbar */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-3 flex flex-col justify-between relative z-20 shadow-xs transition-colors ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header Row: Title & Action Buttons */}
          <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-850">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className={`text-xs sm:text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Text Editor
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono hidden sm:inline">
                {textStats.chars} characters • {textStats.words} words
              </span>
            </div>

            {/* Quick Actions (Paste, Clear, Remove Styles, Sample, Upload) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={handlePaste}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Clipboard className="w-3 h-3" />
                Paste
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>

              <button
                type="button"
                onClick={handleRemoveStyles}
                className="px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Remove all styles and make it plain text"
              >
                <RemoveFormatting className="w-3 h-3" />
                Remove Styles
              </button>

              <button
                type="button"
                onClick={handleSample}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <FileText className="w-3 h-3" />
                Sample Text
              </button>

              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadFile}
                  accept=".txt,.md,.json,.csv,.js,.html,.css"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Rich Formatting Toolbar (Custom Dropdowns + Abundant Colors) */}
          <div
            className={`shrink-0 mb-2 p-1.5 rounded-xl border flex flex-wrap items-center gap-1 sm:gap-1.5 shadow-2xs select-none transition-colors relative z-30 ${
              darkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Undo / Redo */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

            {/* Paragraph / Block dropdown */}
            <CustomDropdown
              value={selectedBlock}
              onChange={setSelectedBlock}
              options={[
                { value: 'Paragraph', label: 'Paragraph' },
                { value: 'Heading 1', label: 'Heading 1' },
                { value: 'Heading 2', label: 'Heading 2' },
                { value: 'Heading 3', label: 'Heading 3' },
                { value: 'Quote', label: 'Quote' },
              ]}
              darkMode={darkMode}
              buttonClassName="py-1 px-2 text-xs"
            />

            {/* Font Family selector & Font Styles button */}
            <div className="flex items-center gap-1">
              <CustomDropdown
                value={selectedFont}
                onChange={(val) => {
                  loadGoogleFont(val);
                  setSelectedFont(val);
                }}
                options={[
                  // Sans-Serif
                  { value: 'Inter', label: 'Inter', font: 'Inter, sans-serif', group: 'Sans-Serif' },
                  { value: 'Roboto', label: 'Roboto', font: 'Roboto, sans-serif', group: 'Sans-Serif' },
                  { value: 'Poppins', label: 'Poppins', font: 'Poppins, sans-serif', group: 'Sans-Serif' },
                  { value: 'Montserrat', label: 'Montserrat', font: 'Montserrat, sans-serif', group: 'Sans-Serif' },
                  { value: 'Raleway', label: 'Raleway', font: 'Raleway, sans-serif', group: 'Sans-Serif' },
                  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', font: "'Plus Jakarta Sans', sans-serif", group: 'Sans-Serif' },

                  // Serif / Roman
                  { value: 'Times New Roman', label: 'Times New Roman', font: "'Times New Roman', serif", group: 'Serif / Roman' },
                  { value: 'Georgia', label: 'Georgia', font: 'Georgia, serif', group: 'Serif / Roman' },
                  { value: 'Playfair Display', label: 'Playfair Display', font: "'Playfair Display', serif", group: 'Serif / Roman' },
                  { value: 'Bodoni Moda', label: 'Bodoni Moda', font: "'Bodoni Moda', serif", group: 'Serif / Roman' },
                  { value: 'EB Garamond', label: 'EB Garamond', font: "'EB Garamond', serif", group: 'Serif / Roman' },
                  { value: 'Cinzel', label: 'Cinzel', font: "'Cinzel', serif", group: 'Serif / Roman' },
                  { value: 'Libre Baskerville', label: 'Libre Baskerville', font: "'Libre Baskerville', serif", group: 'Serif / Roman' },

                  // Cursive & Script
                  { value: 'Great Vibes', label: 'Great Vibes', font: "'Great Vibes', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Alex Brush', label: 'Alex Brush', font: "'Alex Brush', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Parisienne', label: 'Parisienne', font: "'Parisienne', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Allura', label: 'Allura', font: "'Allura', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Tangerine', label: 'Tangerine', font: "'Tangerine', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Pinyon Script', label: 'Pinyon Script', font: "'Pinyon Script', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Sacramento', label: 'Sacramento', font: "'Sacramento', cursive", isCursive: true, group: 'Cursive & Script' },
                  { value: 'Dancing Script', label: 'Dancing Script', font: "'Dancing Script', cursive", isCursive: true, group: 'Cursive & Script' },

                  // Monospace
                  { value: 'JetBrains Mono', label: 'JetBrains Mono', font: "'JetBrains Mono', monospace", group: 'Monospace' },
                  { value: 'Fira Code', label: 'Fira Code', font: "'Fira Code', monospace", group: 'Monospace' },
                  { value: 'Space Mono', label: 'Space Mono', font: "'Space Mono', monospace", group: 'Monospace' },

                  // Display & Gothic
                  { value: 'Bebas Neue', label: 'Bebas Neue', font: "'Bebas Neue', cursive", group: 'Display & Gothic' },
                  { value: 'Oswald', label: 'Oswald', font: "'Oswald', sans-serif", group: 'Display & Gothic' },
                  { value: 'UnifrakturMaguntia', label: 'Unifraktur (Fraktur)', font: "'UnifrakturMaguntia', cursive", group: 'Display & Gothic' },
                  { value: 'Lobster', label: 'Lobster', font: "'Lobster', cursive", group: 'Display & Gothic' },
                  { value: 'Press Start 2P', label: 'Press Start 2P (8-bit)', font: "'Press Start 2P', monospace", group: 'Display & Gothic' },
                ]}
                showFontPreview={true}
                darkMode={darkMode}
                buttonClassName="py-1 px-2 text-xs max-w-[145px]"
                menuClassName="min-w-[210px]"
              />

              <button
                type="button"
                onClick={() => setIsFontModalOpen(true)}
                className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
                title="Browse & apply 165+ font styles across all genres"
              >
                <Type className="w-3 h-3" />
                <span>Font Styles</span>
              </button>
            </div>

            {/* Font Size dropdown */}
            <CustomDropdown
              value={selectedFontSize}
              onChange={setSelectedFontSize}
              options={[
                { value: '12px', label: '12px' },
                { value: '14px', label: '14px' },
                { value: '16px', label: '16px' },
                { value: '18px', label: '18px' },
                { value: '20px', label: '20px' },
                { value: '24px', label: '24px' },
                { value: '32px', label: '32px' },
              ]}
              darkMode={darkMode}
              buttonClassName="py-1 px-2 text-xs w-[76px]"
              menuClassName="min-w-[85px]"
            />

            <span className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

            {/* Formatting toggles: B, I, U, S */}
            <button
              type="button"
              onClick={() => setIsBold(!isBold)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                isBold
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsItalic(!isItalic)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center italic text-xs transition-colors cursor-pointer ${
                isItalic
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsUnderline(!isUnderline)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center underline text-xs transition-colors cursor-pointer ${
                isUnderline
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsStrikethrough(!isStrikethrough)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center line-through text-xs transition-colors cursor-pointer ${
                isStrikethrough
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            {/* Quick Remove Styles Toolbar Button */}
            <button
              type="button"
              onClick={handleRemoveStyles}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
              title="Remove Styles (Plain Text)"
            >
              <RemoveFormatting className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

            {/* Abundant Text Color Picker (50+ shades + custom hex + eyedropper) */}
            <div ref={colorPickerRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsColorPickerOpen(!isColorPickerOpen);
                  setIsHighlightPickerOpen(false);
                }}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Text Color (Abundant Palette)"
              >
                <span className="underline decoration-2 font-black text-xs" style={{ textDecorationColor: textColor, color: textColor }}>
                  A
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {isColorPickerOpen && (
                <div
                  className={`absolute left-0 top-full mt-1.5 p-3 rounded-2xl border shadow-2xl z-50 w-72 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150 ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-1.5">
                    <span className="text-[11px] font-bold">Text Color Palette</span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: textColor }}>
                      {textColor}
                    </span>
                  </div>

                  {/* 54-Swatch Color Grid */}
                  <div className="grid grid-cols-9 gap-1.5 max-h-44 overflow-y-auto p-0.5">
                    {TEXT_COLOR_PALETTE.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => {
                          setTextColor(c.hex);
                          setIsColorPickerOpen(false);
                        }}
                        className={`w-6 h-6 rounded-lg border transition-all hover:scale-125 cursor-pointer relative ${
                          textColor === c.hex ? 'ring-2 ring-blue-500 scale-110 z-10' : 'border-slate-300/60 dark:border-zinc-700'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  {/* Custom Color Input with Eyedropper */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer flex-1">
                      <input
                        type="color"
                        value={textColor.startsWith('#') ? textColor : '#2563EB'}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">Custom Picker</span>
                    </label>

                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#hex"
                      className={`w-20 px-2 py-1 text-xs rounded-lg border font-mono outline-none ${
                        darkMode ? 'bg-black border-zinc-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Abundant Highlighter Picker (Soft Pastels + Custom) */}
            <div ref={highlightPickerRef} className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setIsHighlightPickerOpen(!isHighlightPickerOpen);
                  setIsColorPickerOpen(false);
                }}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-800 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Highlight Text (Selection or All)"
              >
                <Highlighter
                  className="w-3.5 h-3.5"
                  style={{ color: highlightColor !== 'transparent' ? highlightColor : 'currentColor' }}
                />
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {isHighlightPickerOpen && (
                <div
                  className={`absolute right-0 top-full mt-1.5 p-3 rounded-2xl border shadow-2xl z-50 w-72 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150 ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold">Highlight Text</span>
                      {selectionRange.end > selectionRange.start ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                          Selection ({selectionRange.end - selectionRange.start} chars)
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 font-medium">
                          All Text
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleApplyHighlight('transparent')}
                      className="text-[10px] text-rose-500 hover:underline font-semibold cursor-pointer"
                    >
                      {selectionRange.end > selectionRange.start ? 'Clear Selection' : 'Clear All'}
                    </button>
                  </div>

                  {/* Highlighter Swatches Grid */}
                  <div className="grid grid-cols-7 gap-1.5 max-h-40 overflow-y-auto p-0.5">
                    {HIGHLIGHT_COLOR_PALETTE.map((h, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleApplyHighlight(h.hex)}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] transition-all hover:scale-125 cursor-pointer ${
                          highlightColor === h.hex ? 'ring-2 ring-blue-500 scale-110' : 'border-slate-300 dark:border-zinc-700'
                        }`}
                        style={{ backgroundColor: h.hex === 'transparent' ? '#ffffff' : h.hex }}
                        title={h.name}
                      >
                        {h.hex === 'transparent' && '✕'}
                      </button>
                    ))}
                  </div>

                  {/* Custom Highlighter Input */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer flex-1">
                      <input
                        type="color"
                        value={highlightColor.startsWith('#') ? highlightColor : '#FEF08A'}
                        onChange={(e) => handleApplyHighlight(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400">Custom Pastel</span>
                    </label>

                    <input
                      type="text"
                      value={highlightColor === 'transparent' ? '' : highlightColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val || val === 'transparent') {
                          handleApplyHighlight('transparent');
                        } else if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                          handleApplyHighlight(val);
                        }
                      }}
                      placeholder="#hex"
                      className={`w-20 px-2 py-1 text-xs rounded-lg border font-mono outline-none ${
                        darkMode ? 'bg-black border-zinc-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            <span className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

            {/* List & Alignment */}
            <button
              type="button"
              onClick={() => {
                const lines = inputText.split('\n').map((l) => (l.startsWith('• ') ? l.slice(2) : `• ${l}`));
                updateText(lines.join('\n'));
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const lines = inputText
                  .split('\n')
                  .map((l, i) => (l.match(/^\d+\.\s/) ? l.replace(/^\d+\.\s/, '') : `${i + 1}. ${l}`));
                updateText(lines.join('\n'));
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Alignment Left / Center / Right */}
            <button
              type="button"
              onClick={() => setAlignment(alignment === 'left' ? 'center' : alignment === 'center' ? 'right' : 'left')}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              title={`Alignment: ${alignment}`}
            >
              {alignment === 'left' ? (
                <AlignLeft className="w-3.5 h-3.5" />
              ) : alignment === 'center' ? (
                <AlignCenter className="w-3.5 h-3.5" />
              ) : (
                <AlignRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 4. Text Editor Surface with Line Numbers Gutter */}
          <div
            className={`flex-1 min-h-[160px] rounded-xl border relative flex overflow-hidden transition-colors ${
              darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Line Numbers Gutter */}
            <div
              ref={lineGutterRef}
              className={`w-10 shrink-0 border-r select-none overflow-hidden py-3 text-right pr-2 font-mono text-xs ${
                darkMode ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
              style={{
                lineHeight: '1.625',
                fontSize: selectedFontSize,
              }}
            >
              {(inputText ? inputText.split('\n') : ['']).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editor Container with Synchronized Highlight Layer */}
            <div className="relative flex-1 min-w-0 h-full overflow-hidden">
              {/* Synchronized Text Highlight Backdrop (Applies only behind text words, never the whole canvas) */}
              <div
                ref={backdropRef}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none p-3 overflow-hidden select-none whitespace-pre-wrap break-words leading-relaxed font-sans"
                style={{
                  fontFamily: activeFontFamilyCss,
                  fontSize: selectedFontSize,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textAlign: alignment,
                  color: 'transparent',
                  paddingRight: `${12 + scrollbarWidth}px`,
                  boxSizing: 'border-box',
                  margin: 0,
                  border: 'none',
                  lineHeight: '1.625',
                }}
              >
                {renderHighlightSpans(inputText, textHighlights)}
                {inputText.endsWith('\n') && '\u200B'}
              </div>

              {/* Editable Text Area */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => updateText(e.target.value, e.target.selectionStart)}
                onSelect={handleSelectionChange}
                onKeyUp={handleSelectionChange}
                onMouseUp={handleSelectionChange}
                onScroll={handleEditorScroll}
                placeholder="Type, paste, or format your text here..."
                className={`absolute inset-0 w-full h-full p-3 outline-none resize-none overflow-y-auto leading-relaxed border-none bg-transparent font-sans ${
                  darkMode ? 'text-white placeholder-zinc-700' : 'text-slate-900 placeholder-slate-400'
                }`}
                style={{
                  fontFamily: activeFontFamilyCss,
                  fontSize: selectedFontSize,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: `${isUnderline ? 'underline' : ''} ${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                  color: textColor,
                  textAlign: alignment,
                  boxSizing: 'border-box',
                  margin: 0,
                  lineHeight: '1.625',
                  caretColor: textColor || (darkMode ? '#ffffff' : '#000000'),
                }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* 5. Transformed Output Card */}
          <div className="shrink-0 mt-3 flex flex-col gap-2">
            {/* Live Preview Switch and Copy Result */}
            <div className="flex items-center justify-between">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPreviewMode}
                  onChange={(e) => setIsPreviewMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-[18px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-transform after:duration-300 after:ease-out dark:border-zinc-700 peer-checked:bg-blue-600 transition-colors duration-300 ease-in-out shadow-inner" />
                <span className="ml-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Live Preview
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 ml-2 hidden sm:inline">
                  See transformed result instantly
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs cursor-pointer ${
                    darkMode
                      ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                  title="Download transformed text as PDF or TXT"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(transformedText)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-2xs cursor-pointer ${
                    darkMode
                      ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                  <span>Copy Result</span>
                </button>
              </div>
            </div>

            {/* Transformed Output Box */}
            <div
              className={`rounded-xl border p-3 flex flex-col gap-2 shadow-2xs ${
                darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-850 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Transformed Output
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(transformedText)}
                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 cursor-pointer"
                    title="Copy output"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 cursor-pointer"
                    title="Download output as PDF or TXT"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                className={`text-xs leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap select-text font-sans ${
                  darkMode ? 'text-zinc-300' : 'text-slate-800'
                }`}
                style={{
                  fontFamily: activeFontFamilyCss,
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: `${isUnderline ? 'underline' : ''} ${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                }}
              >
                {transformedText ? (
                  transformedText === inputText && textHighlights.length > 0 ? (
                    renderTransformedSpans(transformedText, textHighlights)
                  ) : (
                    transformedText
                  )
                ) : (
                  <span className="text-slate-400 dark:text-zinc-600 italic">
                    Transformed text will automatically appear here...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Available Transformations (165+ Font Styles Balanced across all genres) */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-3 flex flex-col justify-between overflow-hidden relative z-10 shadow-xs transition-colors ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header Row: Title & Search */}
          <div className="shrink-0 flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-zinc-850 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h3 className={`text-xs sm:text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Available Transformations
              </h3>
            </div>

            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transformations..."
                className={`w-full pl-8 pr-2.5 py-1 text-xs rounded-xl border outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Category Filter Pills (Balanced across all styles) */}
          <div className="shrink-0 flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 scrollbar-none select-none">
            {['All', 'Case', 'Formatting', 'Font Styles', 'Encoding', 'Text Cleaning'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : darkMode
                    ? 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Transformation Cards List (Direct Apply on Click) */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
            {/* Section 1: Text Case */}
            {(activeCategory === 'All' || activeCategory === 'Case') && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Aa</span>
                  <h4 className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    Text Case
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {caseTransformations
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedTransformId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTransformId(item.id);
                            applyDirectly(item.fn, item.name);
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                              : darkMode
                              ? 'border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700'
                              : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-2xs ${item.badgeColor}`}
                            >
                              {item.badge}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-slate-400 hover:text-blue-600">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Section 2: Text Formatting */}
            {(activeCategory === 'All' || activeCategory === 'Formatting') && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <h4 className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    Text Formatting
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formattingTransformations
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedTransformId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTransformId(item.id);
                            applyDirectly(item.fn, item.name);
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                              : darkMode
                              ? 'border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700'
                              : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-2xs ${item.badgeColor}`}
                            >
                              {item.badge}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-slate-400 hover:text-blue-600">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Section 3: Font Styles (Balanced Across ALL Genres - Sans, Serif, Cursive, Mono, Display, Gothic) */}
            {(activeCategory === 'All' || activeCategory === 'Font Styles') && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <h4 className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                      Font Styles ({allFontStylesList.length}+ Available)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFontModalOpen(true)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    View All ({allFontStylesList.length}+)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allFontStylesList
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, activeCategory === 'Font Styles' ? 40 : 8)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => applyFontDirectly(item)}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 cursor-pointer transition-all duration-200 hover:border-blue-400 active:scale-[0.98] ${
                          selectedFont === item.name
                            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                            : darkMode
                            ? 'border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900'
                            : 'border-slate-200/80 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                            {item.category}
                          </span>
                        </div>

                        {/* Real-time sample rendered in actual font */}
                        <div
                          className="text-xs truncate py-0.5 text-slate-700 dark:text-zinc-300"
                          style={{
                            fontFamily: item.family || undefined,
                            fontSize: item.category === 'Cursive & Script' ? '15px' : '13px',
                          }}
                        >
                          {item.preview}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Section 4: Encoding & Cleaning */}
            {(activeCategory === 'All' || activeCategory === 'Encoding' || activeCategory === 'Text Cleaning') && (
              <div>
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">⚡</span>
                  <h4 className={`text-xs font-bold ${darkMode ? 'text-zinc-200' : 'text-slate-800'}`}>
                    Encoding & Cleaning
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {otherTransformations
                    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => {
                      const isSelected = selectedTransformId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedTransformId(item.id);
                            applyDirectly(item.fn, item.name);
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                              : darkMode
                              ? 'border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700'
                              : 'border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs select-none shadow-2xs ${item.badgeColor}`}
                            >
                              {item.badge}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </div>

                          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-slate-400 hover:text-blue-600">
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Simple Font Styles Trigger */}
          <div className="shrink-0 pt-2.5 mt-2 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsFontModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Browse All {allFontStylesList.length}+ Font Styles</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Font Styles Browser Modal (165+ Categorized Fonts across ALL genres) */}
      {isFontModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-4xl max-h-[88vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden ${
              darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Type className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight">
                    Font Styles ({allFontStylesList.length}+ Across All Genres)
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    Comprehensive typography: Sans-Serif, Serif/Roman, Cursive Scripts, Monospace, Gothic, Display & Unicode.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFontModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search & Category Filter Tabs across ALL genres */}
            <div className="p-3 border-b border-slate-100 dark:border-zinc-850 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/50 dark:bg-zinc-900/40">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  'All',
                  'Sans-Serif',
                  'Serif / Roman',
                  'Cursive & Script',
                  'Monospace',
                  'Gothic & Fraktur',
                  'Display & Decorative',
                  'Unicode Styles',
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFontModalTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      fontModalTab === tab
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : darkMode
                        ? 'bg-zinc-900 text-zinc-400 hover:text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search bar inside modal */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={fontModalSearch}
                  onChange={(e) => setFontModalSearch(e.target.value)}
                  placeholder="Search 165+ font styles..."
                  className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border outline-none focus:ring-1 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-black border-zinc-800 text-white placeholder-zinc-600'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Modal Body: Direct 1-Click Apply on Any Card */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredModalFonts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => applyFontDirectly(item)}
                  className={`p-3 rounded-xl border flex flex-col justify-between gap-2.5 transition-all hover:border-blue-500 hover:shadow-xs cursor-pointer active:scale-[0.99] ${
                    selectedFont === item.name
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                      : darkMode
                      ? 'bg-zinc-900/60 border-zinc-800'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {item.type}
                    </span>
                  </div>

                  {/* Real-time Rendered Sample in actual font */}
                  <div
                    className="p-2.5 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-sm leading-relaxed overflow-x-auto select-text"
                    style={{
                      fontFamily: item.family || undefined,
                      fontSize: item.category === 'Cursive & Script' ? '18px' : '14px',
                    }}
                  >
                    {item.preview}
                  </div>

                  {/* Card Action */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Click to apply directly</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.preview);
                      }}
                      className="px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 text-slate-600 dark:text-zinc-300"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              ))}

              {filteredModalFonts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                  No font styles found matching "{fontModalSearch}".
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>Showing {filteredModalFonts.length} of {allFontStylesList.length} font styles</span>
              <button
                type="button"
                onClick={() => setIsFontModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Download Popup Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownloadFile}
        darkMode={darkMode}
        title="Download Transformed Text"
        subtitle="Choose format and customize file name"
        defaultFileName="transformed-text"
        defaultFormat="pdf"
        formats={['pdf', 'txt']}
      />
    </div>
  );
}
