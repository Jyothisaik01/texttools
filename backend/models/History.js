const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled Replacement' },
    originalText: { type: String, required: true },
    replacedText: { type: String, required: true },
    rulesCount: { type: Number, default: 0 },
    rules: [
      {
        findText: String,
        replaceText: String,
        matchCase: Boolean,
        matchWholeWord: Boolean,
        isRegex: Boolean,
      },
    ],
    stats: {
      totalReplacements: { type: Number, default: 0 },
      originalChars: { type: Number, default: 0 },
      replacedChars: { type: Number, default: 0 },
      originalWords: { type: Number, default: 0 },
      replacedWords: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', HistorySchema);

