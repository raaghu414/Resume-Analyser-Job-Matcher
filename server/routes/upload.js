const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parsePDF } = require('../utils/pdfParser');
const { analyzeResume } = require('../services/ai');

const router = express.Router();
const Resume = require('../models/resume');
const { optionalAuth } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ts = Date.now();
    cb(null, `${ts}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  try {
    let extractedText = '';
    if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      extractedText = await parsePDF(filePath);
    } else {
      // For non-PDF formats, return placeholder. Later: add docx/text parsing.
      extractedText = `Uploaded file ${req.file.originalname} saved. Parsing for this file type not yet implemented.`;
    }

    // Call AI analysis (skill extraction, scoring)
    const aiResult = await analyzeResume(extractedText);

    // Persist resume if user available
    try {
      const resumeDoc = new Resume({
        user: req.user ? req.user._id : undefined,
        filename: req.file.filename,
        text: extractedText,
        ai: aiResult
      });
      await resumeDoc.save();
    } catch (err) {
      console.warn('Failed to save resume:', err);
    }

    res.json({ message: 'File received and parsed', file: req.file.filename, ai: aiResult, text: extractedText });
  } catch (err) {
    console.error('Upload/parse error:', err);
    res.status(500).json({ error: 'Failed to parse file' });
  }
});

module.exports = router;
