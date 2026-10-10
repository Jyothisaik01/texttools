const express = require('express');
const router = express.Router();
const RulePreset = require('../models/RulePreset');

const DEFAULT_PRESETS = [
  {
    name: '🔒 PII & Privacy Redactor',
    description: 'Anonymize email addresses, phone numbers, and placeholder personal data',
    tags: ['privacy', 'security'],
    rules: [
      { findText: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', replaceText: '[EMAIL_REDACTED]', isRegex: true, enabled: true },
      { findText: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}', replaceText: '[PHONE_REDACTED]', isRegex: true, enabled: true },
      { findText: 'John Doe', replaceText: 'Anonymous User', matchCase: false, enabled: true },
    ],
  },
  {
    name: '💻 Dev Identifier Sanitizer',
    description: 'Clean up legacy variable names and database keys in scripts or SQL',
    tags: ['developer', 'code'],
    rules: [
      { findText: 'var ', replaceText: 'const ', matchCase: true, enabled: true },
      { findText: 'user_id', replaceText: 'userId', matchCase: true, enabled: true },
      { findText: 'created_at', replaceText: 'createdAt', matchCase: true, enabled: true },
      { findText: 'updated_at', replaceText: 'updatedAt', matchCase: true, enabled: true },
    ],
  },
  {
    name: '✍️ British to American English',
    description: 'Standardize spelling from British English to American English',
    tags: ['writing', 'grammar'],
    rules: [
      { findText: 'colour', replaceText: 'color', matchCase: false, matchWholeWord: true, enabled: true },
      { findText: 'flavour', replaceText: 'flavor', matchCase: false, matchWholeWord: true, enabled: true },
      { findText: 'behaviour', replaceText: 'behavior', matchCase: false, matchWholeWord: true, enabled: true },
      { findText: 'centre', replaceText: 'center', matchCase: false, matchWholeWord: true, enabled: true },
      { findText: 'theatre', replaceText: 'theater', matchCase: false, matchWholeWord: true, enabled: true },
      { findText: 'organise', replaceText: 'organize', matchCase: false, matchWholeWord: true, enabled: true },
    ],
  },
];

// Seed defaults if empty
async function seedDefaultPresets() {
  try {
    const count = await RulePreset.countDocuments();
    if (count === 0) {
      await RulePreset.insertMany(DEFAULT_PRESETS);
      console.log('Seeded default rule presets into MongoDB');
    }
  } catch (err) {
    console.warn('Preset seed error:', err.message);
  }
}

// GET all presets
router.get('/', async (req, res) => {
  try {
    await seedDefaultPresets();
    const presets = await RulePreset.find().sort({ updatedAt: -1 });
    res.json({ success: true, data: presets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST save a new preset
router.post('/', async (req, res) => {
  try {
    const { name, description, rules, tags } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Preset name is required' });
    }
    const newPreset = new RulePreset({
      name: name.trim(),
      description: description || '',
      rules: rules || [],
      tags: tags || [],
    });
    await newPreset.save();
    res.status(201).json({ success: true, data: newPreset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a preset
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await RulePreset.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }
    res.json({ success: true, message: 'Preset deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

