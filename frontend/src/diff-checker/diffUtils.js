import * as Diff from 'diff';

/**
 * Normalizes text based on ignore options
 */
export function normalizeText(text, options = {}) {
  let result = text ?? '';
  if (options.ignoreCase) {
    result = result.toLowerCase();
  }
  if (options.ignoreWhitespaceChanges) {
    result = result.replace(/[ \t]+/g, ' ').replace(/^ +| +$/gm, '');
  }
  if (options.ignoreSpaces) {
    result = result.replace(/[ \t]/g, '');
  }
  if (options.ignoreLineBreaks) {
    result = result.replace(/\r?\n|\r/g, ' ');
  }
  return result;
}

/**
 * Computes side-by-side aligned line diff
 */
export function computeSideBySideDiff(originalText, modifiedText, options = {}) {
  const normOriginal = normalizeText(originalText, options);
  const normModified = normalizeText(modifiedText, options);

  // Original raw lines and modified raw lines
  const origRawLines = (originalText ?? '').split(/\r?\n/);
  const modRawLines = (modifiedText ?? '').split(/\r?\n/);

  // If both empty
  if (!originalText && !modifiedText) {
    return {
      leftLines: [],
      rightLines: [],
      addedCount: 0,
      removedCount: 0,
      modifiedCount: 0,
      totalCount: 0,
    };
  }

  // Use jsdiff line diff on normalized text
  const lineDiff = Diff.diffLines(normOriginal, normModified, {
    ignoreWhitespace: options.ignoreWhitespaceChanges,
    ignoreCase: options.ignoreCase,
  });

  const leftLines = [];
  const rightLines = [];
  let addedCount = 0;
  let removedCount = 0;
  let modifiedCount = 0;

  let origLineNum = 1;
  let modLineNum = 1;

  for (let i = 0; i < lineDiff.length; i++) {
    const part = lineDiff[i];
    const nextPart = lineDiff[i + 1];

    // Detect modified block (removed immediately followed by added)
    if (part.removed && nextPart && nextPart.added) {
      const removedLines = part.value.replace(/\n$/, '').split('\n');
      const addedLines = nextPart.value.replace(/\n$/, '').split('\n');
      const maxLen = Math.max(removedLines.length, addedLines.length);

      for (let j = 0; j < maxLen; j++) {
        const hasLeft = j < removedLines.length;
        const hasRight = j < addedLines.length;

        if (hasLeft) {
          const rawText = origRawLines[origLineNum - 1] ?? removedLines[j];
          leftLines.push({
            lineNum: origLineNum++,
            type: 'removed',
            text: rawText,
            prefix: '-',
          });
        } else {
          leftLines.push({
            lineNum: null,
            type: 'empty',
            text: '',
            prefix: ' ',
          });
        }

        if (hasRight) {
          const rawText = modRawLines[modLineNum - 1] ?? addedLines[j];
          rightLines.push({
            lineNum: modLineNum++,
            type: 'added',
            text: rawText,
            prefix: '+',
          });
        } else {
          rightLines.push({
            lineNum: null,
            type: 'empty',
            text: '',
            prefix: ' ',
          });
        }

        if (hasLeft && hasRight) {
          modifiedCount++;
        } else if (hasLeft) {
          removedCount++;
        } else if (hasRight) {
          addedCount++;
        }
      }

      i++; // Skip the next part since we handled it
      continue;
    }

    const lines = part.value.replace(/\n$/, '').split('\n');

    if (part.added) {
      addedCount += lines.length;
      for (const line of lines) {
        const rawText = modRawLines[modLineNum - 1] ?? line;
        leftLines.push({
          lineNum: null,
          type: 'empty',
          text: '',
          prefix: ' ',
        });
        rightLines.push({
          lineNum: modLineNum++,
          type: 'added',
          text: rawText,
          prefix: '+',
        });
      }
    } else if (part.removed) {
      removedCount += lines.length;
      for (const line of lines) {
        const rawText = origRawLines[origLineNum - 1] ?? line;
        leftLines.push({
          lineNum: origLineNum++,
          type: 'removed',
          text: rawText,
          prefix: '-',
        });
        rightLines.push({
          lineNum: null,
          type: 'empty',
          text: '',
          prefix: ' ',
        });
      }
    } else {
      // Unchanged
      for (const line of lines) {
        const rawLeft = origRawLines[origLineNum - 1] ?? line;
        const rawRight = modRawLines[modLineNum - 1] ?? line;
        leftLines.push({
          lineNum: origLineNum++,
          type: 'unchanged',
          text: rawLeft,
          prefix: ' ',
        });
        rightLines.push({
          lineNum: modLineNum++,
          type: 'unchanged',
          text: rawRight,
          prefix: ' ',
        });
      }
    }
  }

  const totalCount = Math.max(leftLines.length, rightLines.length);

  return {
    leftLines,
    rightLines,
    addedCount,
    removedCount,
    modifiedCount,
    totalCount,
  };
}

/**
 * Computes unified/inline diff list
 */
export function computeUnifiedDiff(originalText, modifiedText, options = {}) {
  const normOriginal = normalizeText(originalText, options);
  const normModified = normalizeText(modifiedText, options);

  const origRawLines = (originalText ?? '').split(/\r?\n/);
  const modRawLines = (modifiedText ?? '').split(/\r?\n/);

  const lineDiff = Diff.diffLines(normOriginal, normModified, {
    ignoreWhitespace: options.ignoreWhitespaceChanges,
    ignoreCase: options.ignoreCase,
  });

  const lines = [];
  let origLineNum = 1;
  let modLineNum = 1;

  for (const part of lineDiff) {
    const partLines = part.value.replace(/\n$/, '').split('\n');

    if (part.added) {
      for (const line of partLines) {
        const rawText = modRawLines[modLineNum - 1] ?? line;
        lines.push({
          origLineNum: null,
          modLineNum: modLineNum++,
          type: 'added',
          text: rawText,
          prefix: '+',
        });
      }
    } else if (part.removed) {
      for (const line of partLines) {
        const rawText = origRawLines[origLineNum - 1] ?? line;
        lines.push({
          origLineNum: origLineNum++,
          modLineNum: null,
          type: 'removed',
          text: rawText,
          prefix: '-',
        });
      }
    } else {
      for (const line of partLines) {
        const rawText = origRawLines[origLineNum - 1] ?? line;
        lines.push({
          origLineNum: origLineNum++,
          modLineNum: modLineNum++,
          type: 'unchanged',
          text: rawText,
          prefix: ' ',
        });
      }
    }
  }

  return lines;
}

/**
 * Creates standard patch text for download
 */
export function createPatchFile(originalText, modifiedText, filename = 'document.txt') {
  return Diff.createPatch(filename, originalText, modifiedText, 'Original', 'Modified');
}
