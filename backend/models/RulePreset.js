const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  findText: { type: String, default: '' },
  replaceText: { type: String, default: '' },
  matchCase: { type: Boolean, default: false },
  matchWholeWord: { type: Boolean, default: false },
  isRegex: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
});

const RulePresetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    rules: [RuleSchema],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('RulePreset', RulePresetSchema);

