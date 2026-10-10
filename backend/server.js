const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const rulesRoutes = require('./routes/rules.routes');
const historyRoutes = require('./routes/history.routes');
const pdfRoutes = require('./routes/pdf.routes');

const app = express();
const PORT = process.env.PORT || 5060;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/text_replacer_db';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'TextFlow Replacer MERN Backend',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// API Routes
app.use('/api/presets', rulesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/pdf', pdfRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Connect MongoDB and Start Server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`✅ MongoDB Connected successfully to: ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 TextFlow Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Still start server even if DB is connecting
    app.listen(PORT, () => {
      console.log(`⚠️ TextFlow Backend started on http://localhost:${PORT} (MongoDB offline)`);
    });
  });

