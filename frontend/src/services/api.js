import { jsPDF } from 'jspdf';

const PRESETS_STORAGE_KEY = 'textflow_rule_presets_v1';
const HISTORY_STORAGE_KEY = 'textflow_job_history_v1';

const DEFAULT_PRESETS = [
  {
    _id: 'preset_pii',
    name: '🔒 PII & Privacy Redactor',
    description: 'Anonymize email addresses, phone numbers, and placeholder personal data',
    tags: ['privacy', 'security'],
    rules: [
      {
        findText: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        replaceText: '[EMAIL_REDACTED]',
        isRegex: true,
        matchCase: false,
        matchWholeWord: false,
        enabled: true,
      },
      {
        findText: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}',
        replaceText: '[PHONE_REDACTED]',
        isRegex: true,
        matchCase: false,
        matchWholeWord: false,
        enabled: true,
      },
      {
        findText: 'John Doe',
        replaceText: 'Anonymous User',
        matchCase: false,
        matchWholeWord: false,
        isRegex: false,
        enabled: true,
      },
    ],
  },
  {
    _id: 'preset_dev',
    name: '💻 Dev Identifier Sanitizer',
    description: 'Clean up legacy variable names and database keys in scripts or SQL',
    tags: ['developer', 'code'],
    rules: [
      { findText: 'var ', replaceText: 'const ', matchCase: true, matchWholeWord: false, isRegex: false, enabled: true },
      { findText: 'user_id', replaceText: 'userId', matchCase: true, matchWholeWord: false, isRegex: false, enabled: true },
      { findText: 'created_at', replaceText: 'createdAt', matchCase: true, matchWholeWord: false, isRegex: false, enabled: true },
      { findText: 'updated_at', replaceText: 'updatedAt', matchCase: true, matchWholeWord: false, isRegex: false, enabled: true },
    ],
  },
  {
    _id: 'preset_uk_us',
    name: '✍️ British to American English',
    description: 'Standardize spelling from British English to American English',
    tags: ['writing', 'grammar'],
    rules: [
      { findText: 'colour', replaceText: 'color', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
      { findText: 'flavour', replaceText: 'flavor', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
      { findText: 'behaviour', replaceText: 'behavior', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
      { findText: 'centre', replaceText: 'center', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
      { findText: 'theatre', replaceText: 'theater', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
      { findText: 'organise', replaceText: 'organize', matchCase: false, matchWholeWord: true, isRegex: false, enabled: true },
    ],
  },
];

/**
 * Fetch Rule Presets from LocalStorage
 */
export async function getPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESETS));
      return DEFAULT_PRESETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_PRESETS;
  }
}

/**
 * Save New Preset to LocalStorage
 */
export async function createPreset(data) {
  try {
    const existing = await getPresets();
    const newPreset = {
      ...data,
      _id: 'preset_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newPreset, ...existing];
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, data: newPreset };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Delete Preset from LocalStorage
 */
export async function removePreset(id) {
  try {
    const existing = await getPresets();
    const updated = existing.filter((p) => p._id !== id);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Fetch Past Transformations History from LocalStorage
 */
export async function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Save Replacement Job to History in LocalStorage
 */
export async function recordHistory(data) {
  try {
    const existing = await getHistory();
    const newEntry = {
      ...data,
      _id: 'hist_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    // Keep last 30 entries
    const updated = [newEntry, ...existing].slice(0, 30);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, data: newEntry };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Clear All History
 */
export async function clearAllHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Generate PDF - 100% Pure Client-Side Browser Engine (jsPDF)
 * Zero server connection needed!
 */
export async function generatePdf({
  text,
  title = 'Transformed Document',
  subtitle = 'Generated via TextFlow Replacer',
  fontSize = 11,
  includeStats = true,
  stats = {},
  rules = [],
}) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 45;
    const maxLineWidth = pageWidth - margin * 2;
    let cursorY = 55;

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, margin, cursorY);
    cursorY += 22;

    // Subtitle & Timestamp
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`${subtitle} • Generated on ${new Date().toLocaleString()}`, margin, cursorY);
    cursorY += 15;

    // Decorative Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 18;

    // Optional Stats Summary Box
    if (includeStats && stats && stats.totalReplacements !== undefined) {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, cursorY, maxLineWidth, 40, 5, 5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, cursorY, maxLineWidth, 40, 5, 5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('TRANSFORMATION METRICS:', margin + 14, cursorY + 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Total Replacements: ${stats.totalReplacements}  |  Rules: ${rules.length}  |  Words: ${stats.replacedWords || 0}  |  Characters: ${stats.replacedChars || 0}`,
        margin + 14,
        cursorY + 29
      );
      cursorY += 55;
    }

    // Main Body Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(Number(fontSize) || 10.5);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(text, maxLineWidth);
    const lineHeight = (Number(fontSize) || 10.5) * 1.35;

    for (let i = 0; i < splitText.length; i++) {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(splitText[i], margin, cursorY);
      cursorY += lineHeight;
    }

    // Appendix: Applied Rules
    if (rules && rules.length > 0) {
      cursorY += 25;
      if (cursorY > pageHeight - 90) {
        doc.addPage();
        cursorY = margin;
      }

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 16;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('RULES APPLIED IN THIS SESSION:', margin, cursorY);
      cursorY += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      rules.forEach((r, idx) => {
        if (!r.findText) return;
        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        const flags = [
          r.matchCase ? 'Case-sensitive' : '',
          r.matchWholeWord ? 'Whole word' : '',
          r.isRegex ? 'Regex' : '',
        ]
          .filter(Boolean)
          .join(', ');

        doc.text(
          `${idx + 1}. "${r.findText}" ➔ "${r.replaceText || '[empty]'}" ${flags ? `(${flags})` : ''}`,
          margin + 8,
          cursorY
        );
        cursorY += 12;
      });
    }

    doc.save(`${title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'document'}.pdf`);
    return { success: true };
  } catch (err) {
    console.error('jsPDF generation failed:', err);
    throw err;
  }
}
