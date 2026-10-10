const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');

/**
 * POST /api/pdf/generate
 * Generates and downloads a clean, beautifully formatted PDF
 */
router.post('/generate', (req, res) => {
  try {
    const {
      text,
      title = 'Processed Document',
      subtitle = 'Generated via TextFlow Find & Replace',
      fontSize = 11,
      includeStats = true,
      stats = {},
      rules = [],
    } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text content is required to generate PDF' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: title,
        Author: 'TextFlow Replacer',
        Subject: 'Transformed Text Document',
      },
    });

    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'document'}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Header styling
    doc
      .fillColor('#0F172A')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text(title, { align: 'left' });

    doc
      .fillColor('#64748B')
      .fontSize(10)
      .font('Helvetica')
      .text(`${subtitle} • ${new Date().toLocaleString()}`, { align: 'left' })
      .moveDown(0.8);

    // Decorative divider
    doc
      .strokeColor('#E2E8F0')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(1);

    // Stats bar if requested
    if (includeStats && stats && stats.totalReplacements !== undefined) {
      const startY = doc.y;
      doc
        .roundedRect(50, startY, 495, 45, 6)
        .fillColor('#F8FAFC')
        .fill()
        .strokeColor('#E2E8F0')
        .stroke();

      doc
        .fillColor('#0F172A')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('METRICS SUMMARY:', 65, startY + 10);

      doc
        .fillColor('#334155')
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Total Replacements: ${stats.totalReplacements}   |   Rules Applied: ${rules.length}   |   Words: ${stats.replacedWords || 0}   |   Characters: ${stats.replacedChars || 0}`,
          65,
          startY + 25
        );

      doc.y = startY + 60;
    }

    // Main Body Content
    doc
      .fillColor('#1E293B')
      .fontSize(Number(fontSize) || 11)
      .font('Helvetica')
      .lineGap(3)
      .text(text, {
        align: 'left',
        paragraphGap: 8,
      });

    // Appendix: Rules table (if rules were provided)
    if (rules && rules.length > 0) {
      doc.moveDown(2);
      if (doc.y > 680) {
        doc.addPage();
      }

      doc
        .strokeColor('#E2E8F0')
        .lineWidth(0.5)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(0.8);

      doc
        .fillColor('#64748B')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('RULES APPLIED IN THIS TRANSFORMATION:', { align: 'left' })
        .moveDown(0.5);

      rules.forEach((r, idx) => {
        if (!r.findText) return;
        const flags = [
          r.matchCase ? 'Case-sensitive' : '',
          r.matchWholeWord ? 'Whole word' : '',
          r.isRegex ? 'Regex' : '',
        ]
          .filter(Boolean)
          .join(', ');

        doc
          .fillColor('#475569')
          .fontSize(8.5)
          .font('Helvetica')
          .text(
            `${idx + 1}. "${r.findText}"  ➔  "${r.replaceText || '[empty]'}" ${flags ? `(${flags})` : ''}`,
            { indent: 10 }
          );
      });
    }

    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
});

module.exports = router;

