const express = require('express');
const router = express.Router();
const History = require('../models/History');

// GET recent history
router.get('/', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST save history item
router.post('/', async (req, res) => {
  try {
    const { title, originalText, replacedText, rules, stats } = req.body;
    if (!originalText || !replacedText) {
      return res.status(400).json({ success: false, message: 'Text content is required' });
    }

    const item = new History({
      title: title || `Text Transformation (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      originalText,
      replacedText,
      rulesCount: rules?.length || 0,
      rules: rules || [],
      stats: stats || {},
    });

    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE single item
router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'History item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE clear all
router.delete('/', async (req, res) => {
  try {
    await History.deleteMany({});
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

