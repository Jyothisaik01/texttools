/**
 * Escape special Regex characters for safe literal matching
 */
export function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Execute multi-rule find and replace
 * Returns:
 * - resultText: Final transformed text
 * - ruleStats: Array of { ruleId, count }
 * - totalReplacements: Sum of all replacements
 */
export function executeReplacement(sourceText, rules = []) {
  if (!sourceText) {
    return {
      resultText: '',
      ruleStats: {},
      totalReplacements: 0,
      ruleHighlights: [],
    };
  }

  let currentText = sourceText;
  const ruleStats = {};
  let totalReplacements = 0;

  rules.forEach((rule) => {
    if (!rule.enabled || !rule.findText) {
      ruleStats[rule.id] = 0;
      return;
    }

    try {
      let pattern;
      let flags = rule.matchCase ? 'g' : 'gi';

      if (rule.isRegex) {
        pattern = new RegExp(rule.findText, flags);
      } else {
        const escaped = escapeRegex(rule.findText);
        const term = rule.matchWholeWord ? `\\b${escaped}\\b` : escaped;
        pattern = new RegExp(term, flags);
      }

      // Count matches
      const matches = currentText.match(pattern);
      const matchCount = matches ? matches.length : 0;
      ruleStats[rule.id] = matchCount;
      totalReplacements += matchCount;

      // Apply replacement
      currentText = currentText.replace(pattern, rule.replaceText ?? '');
    } catch (err) {
      console.warn(`Rule evaluation error for "${rule.findText}":`, err.message);
      ruleStats[rule.id] = 0;
    }
  });

  return {
    resultText: currentText,
    ruleStats,
    totalReplacements,
  };
}

/**
 * Calculate Word and Character Metrics
 */
export function calculateMetrics(text = '') {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

  return { chars, charsNoSpaces, words, lines };
}

