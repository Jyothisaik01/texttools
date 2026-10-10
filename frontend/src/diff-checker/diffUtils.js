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
 * Computes intra-line character/word level tokens for VS Code style diff highlighting.
 * Preserves unchanged text with subtle background, while highlighting exact changed tokens in darker/richer colors.
 */
export function computeIntraLineTokens(oldLine = '', newLine = '') {
  if (oldLine === newLine) {
    return {
      leftTokens: [{ text: oldLine, type: 'unchanged' }],
      rightTokens: [{ text: newLine, type: 'unchanged' }],
    };
  }

  // Use word diff with space preservation as base
  const wordDiff = Diff.diffWordsWithSpace(oldLine, newLine);
  const leftTokens = [];
  const rightTokens = [];

  for (let i = 0; i < wordDiff.length; i++) {
    const part = wordDiff[i];
    const next = wordDiff[i + 1];

    if (part.removed && next && next.added) {
      const pVal = part.value;
      const nVal = next.value;

      // If one word is a prefix/suffix of the other (e.g. 'kl' vs 'k', 'user' vs 'userId', 'select' vs 'CustomDropdown')
      const sharesAffix =
        pVal.length > 0 &&
        nVal.length > 0 &&
        (pVal.startsWith(nVal) || nVal.startsWith(pVal) || pVal.endsWith(nVal) || nVal.endsWith(pVal));

      if (sharesAffix) {
        const charDiff = Diff.diffChars(pVal, nVal);
        for (const c of charDiff) {
          if (c.removed) {
            leftTokens.push({ text: c.value, type: 'removed' });
          } else if (c.added) {
            rightTokens.push({ text: c.value, type: 'added' });
          } else {
            leftTokens.push({ text: c.value, type: 'unchanged' });
            rightTokens.push({ text: c.value, type: 'unchanged' });
          }
        }
      } else {
        // Distinct words: full word removal & addition (like 'select' vs 'CustomDropdown')
        leftTokens.push({ text: pVal, type: 'removed' });
        rightTokens.push({ text: nVal, type: 'added' });
      }
      i++; // Skip paired addition
    } else if (part.removed) {
      leftTokens.push({ text: part.value, type: 'removed' });
    } else if (part.added) {
      rightTokens.push({ text: part.value, type: 'added' });
    } else {
      leftTokens.push({ text: part.value, type: 'unchanged' });
      rightTokens.push({ text: part.value, type: 'unchanged' });
    }
  }

  return { leftTokens, rightTokens };
}

/**
 * Computes side-by-side aligned line diff with intra-line tokens
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

        const rawLeft = hasLeft ? (origRawLines[origLineNum - 1] ?? removedLines[j]) : '';
        const rawRight = hasRight ? (modRawLines[modLineNum - 1] ?? addedLines[j]) : '';

        if (hasLeft && hasRight) {
          const { leftTokens, rightTokens } = computeIntraLineTokens(rawLeft, rawRight);
          leftLines.push({
            lineNum: origLineNum++,
            type: 'removed',
            text: rawLeft,
            prefix: '-',
            tokens: leftTokens,
          });
          rightLines.push({
            lineNum: modLineNum++,
            type: 'added',
            text: rawRight,
            prefix: '+',
            tokens: rightTokens,
          });
          modifiedCount++;
        } else if (hasLeft) {
          leftLines.push({
            lineNum: origLineNum++,
            type: 'removed',
            text: rawLeft,
            prefix: '-',
            tokens: [{ text: rawLeft, type: 'removed' }],
          });
          rightLines.push({
            lineNum: null,
            type: 'empty',
            text: '',
            prefix: ' ',
            tokens: [],
          });
          removedCount++;
        } else if (hasRight) {
          leftLines.push({
            lineNum: null,
            type: 'empty',
            text: '',
            prefix: ' ',
            tokens: [],
          });
          rightLines.push({
            lineNum: modLineNum++,
            type: 'added',
            text: rawRight,
            prefix: '+',
            tokens: [{ text: rawRight, type: 'added' }],
          });
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
          tokens: [],
        });
        rightLines.push({
          lineNum: modLineNum++,
          type: 'added',
          text: rawText,
          prefix: '+',
          tokens: [{ text: rawText, type: 'added' }],
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
          tokens: [{ text: rawText, type: 'removed' }],
        });
        rightLines.push({
          lineNum: null,
          type: 'empty',
          text: '',
          prefix: ' ',
          tokens: [],
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
          tokens: [{ text: rawLeft, type: 'unchanged' }],
        });
        rightLines.push({
          lineNum: modLineNum++,
          type: 'unchanged',
          text: rawRight,
          prefix: ' ',
          tokens: [{ text: rawRight, type: 'unchanged' }],
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
 * Computes unified/inline diff list with intra-line tokens
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

  for (let i = 0; i < lineDiff.length; i++) {
    const part = lineDiff[i];
    const nextPart = lineDiff[i + 1];

    if (part.removed && nextPart && nextPart.added) {
      const remLines = part.value.replace(/\n$/, '').split('\n');
      const addLines = nextPart.value.replace(/\n$/, '').split('\n');
      const minCount = Math.min(remLines.length, addLines.length);

      for (let k = 0; k < minCount; k++) {
        const rawRem = origRawLines[origLineNum - 1] ?? remLines[k];
        const rawAdd = modRawLines[modLineNum - 1] ?? addLines[k];
        const { leftTokens, rightTokens } = computeIntraLineTokens(rawRem, rawAdd);
        lines.push({
          origLineNum: origLineNum++,
          modLineNum: null,
          type: 'removed',
          text: rawRem,
          prefix: '-',
          tokens: leftTokens,
        });
        lines.push({
          origLineNum: null,
          modLineNum: modLineNum++,
          type: 'added',
          text: rawAdd,
          prefix: '+',
          tokens: rightTokens,
        });
      }

      for (let r = minCount; r < remLines.length; r++) {
        const rawRem = origRawLines[origLineNum - 1] ?? remLines[r];
        lines.push({
          origLineNum: origLineNum++,
          modLineNum: null,
          type: 'removed',
          text: rawRem,
          prefix: '-',
          tokens: [{ text: rawRem, type: 'removed' }],
        });
      }

      for (let a = minCount; a < addLines.length; a++) {
        const rawAdd = modRawLines[modLineNum - 1] ?? addLines[a];
        lines.push({
          origLineNum: null,
          modLineNum: modLineNum++,
          type: 'added',
          text: rawAdd,
          prefix: '+',
          tokens: [{ text: rawAdd, type: 'added' }],
        });
      }

      i++;
      continue;
    }

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
          tokens: [{ text: rawText, type: 'added' }],
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
          tokens: [{ text: rawText, type: 'removed' }],
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
          tokens: [{ text: rawText, type: 'unchanged' }],
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

/**
 * Returns line-by-line diff status array for live typing editor
 */
export function getLineDiffStatuses(originalText, modifiedText, options = {}) {
  const origLines = (originalText || '').split('\n');
  const modLines = (modifiedText || '').split('\n');

  const origStatuses = new Array(origLines.length).fill('unchanged');
  const modStatuses = new Array(modLines.length).fill('unchanged');
  const origTokens = new Array(origLines.length);
  const modTokens = new Array(modLines.length);

  for (let i = 0; i < origLines.length; i++) {
    origTokens[i] = [{ text: origLines[i], type: 'unchanged' }];
  }
  for (let j = 0; j < modLines.length; j++) {
    modTokens[j] = [{ text: modLines[j], type: 'unchanged' }];
  }

  if (!originalText && !modifiedText) {
    return {
      origStatuses,
      modStatuses,
      origTokens,
      modTokens,
      addedCount: 0,
      removedCount: 0,
      modifiedCount: 0,
      totalCount: 0,
    };
  }

  if (!originalText && modifiedText) {
    return {
      origStatuses: [],
      modStatuses: new Array(modLines.length).fill('added'),
      origTokens: [],
      modTokens: modLines.map((l) => [{ text: l, type: 'added' }]),
      addedCount: modLines.length,
      removedCount: 0,
      modifiedCount: 0,
      totalCount: modLines.length,
    };
  }

  if (originalText && !modifiedText) {
    return {
      origStatuses: new Array(origLines.length).fill('removed'),
      modStatuses: [],
      origTokens: origLines.map((l) => [{ text: l, type: 'removed' }]),
      modTokens: [],
      addedCount: 0,
      removedCount: origLines.length,
      modifiedCount: 0,
      totalCount: origLines.length,
    };
  }

  const normOriginal = normalizeText(originalText, options);
  const normModified = normalizeText(modifiedText, options);

  const diff = Diff.diffLines(normOriginal, normModified, {
    ignoreWhitespace: options.ignoreWhitespaceChanges,
    ignoreCase: options.ignoreCase,
  });

  let origIdx = 0;
  let modIdx = 0;
  let addedCount = 0;
  let removedCount = 0;
  let modifiedCount = 0;

  for (let i = 0; i < diff.length; i++) {
    const part = diff[i];
    const next = diff[i + 1];

    if (part.removed && next && next.added) {
      const remLines = part.value.replace(/\n$/, '').split('\n');
      const addLines = next.value.replace(/\n$/, '').split('\n');
      const minCount = Math.min(remLines.length, addLines.length);

      for (let k = 0; k < minCount; k++) {
        const oIdx = origIdx + k;
        const mIdx = modIdx + k;
        if (oIdx < origStatuses.length) origStatuses[oIdx] = 'removed';
        if (mIdx < modStatuses.length) modStatuses[mIdx] = 'added';
        if (oIdx < origLines.length && mIdx < modLines.length) {
          const { leftTokens, rightTokens } = computeIntraLineTokens(origLines[oIdx], modLines[mIdx]);
          origTokens[oIdx] = leftTokens;
          modTokens[mIdx] = rightTokens;
        }
      }

      for (let r = minCount; r < remLines.length; r++) {
        const oIdx = origIdx + r;
        if (oIdx < origStatuses.length) {
          origStatuses[oIdx] = 'removed';
          origTokens[oIdx] = [{ text: origLines[oIdx], type: 'removed' }];
        }
      }

      for (let a = minCount; a < addLines.length; a++) {
        const mIdx = modIdx + a;
        if (mIdx < modStatuses.length) {
          modStatuses[mIdx] = 'added';
          modTokens[mIdx] = [{ text: modLines[mIdx], type: 'added' }];
        }
      }

      modifiedCount += minCount;
      if (remLines.length > minCount) removedCount += remLines.length - minCount;
      if (addLines.length > minCount) addedCount += addLines.length - minCount;

      origIdx += remLines.length;
      modIdx += addLines.length;
      i++;
      continue;
    }

    if (part.removed) {
      const remLines = part.value.replace(/\n$/, '').split('\n');
      for (let r = 0; r < remLines.length; r++) {
        const oIdx = origIdx + r;
        if (oIdx < origStatuses.length) {
          origStatuses[oIdx] = 'removed';
          origTokens[oIdx] = [{ text: origLines[oIdx], type: 'removed' }];
        }
      }
      removedCount += remLines.length;
      origIdx += remLines.length;
    } else if (part.added) {
      const addLines = part.value.replace(/\n$/, '').split('\n');
      for (let a = 0; a < addLines.length; a++) {
        const mIdx = modIdx + a;
        if (mIdx < modStatuses.length) {
          modStatuses[mIdx] = 'added';
          modTokens[mIdx] = [{ text: modLines[mIdx], type: 'added' }];
        }
      }
      addedCount += addLines.length;
      modIdx += addLines.length;
    } else {
      const unLines = part.value.replace(/\n$/, '').split('\n');
      for (let u = 0; u < unLines.length; u++) {
        const oIdx = origIdx + u;
        const mIdx = modIdx + u;
        if (oIdx < origTokens.length) origTokens[oIdx] = [{ text: origLines[oIdx], type: 'unchanged' }];
        if (mIdx < modTokens.length) modTokens[mIdx] = [{ text: modLines[mIdx], type: 'unchanged' }];
      }
      origIdx += unLines.length;
      modIdx += unLines.length;
    }
  }

  const totalCount = Math.max(origLines.length, modLines.length);

  return {
    origStatuses,
    modStatuses,
    origTokens,
    modTokens,
    addedCount,
    removedCount,
    modifiedCount,
    totalCount,
  };
}

