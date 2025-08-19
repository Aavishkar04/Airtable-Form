import express from 'express';
import auth from '../middleware/auth.js';
import AirtableAPI from '../utils/airtable.js';
import { upload } from '../utils/s3.js';

const router = express.Router();

// Get user's bases
router.get('/bases', auth, async (req, res) => {
  try {
    const airtable = new AirtableAPI(req.user.getDecryptedToken());
    const bases = await airtable.getBases();
    res.json(bases);
  } catch (error) {
    console.error('Get bases error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get tables in a base
router.get('/tables', auth, async (req, res) => {
  try {
    const { baseId } = req.query;

    if (!baseId) {
      return res.status(400).json({ error: 'baseId is required' });
    }

    const airtable = new AirtableAPI(req.user.getDecryptedToken());
    const tables = await airtable.getTables(baseId);
    res.json(tables);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get fields in a table (filtered to supported types)
router.get('/fields', auth, async (req, res) => {
  try {
    const { baseId, tableId } = req.query;

    if (!baseId || !tableId) {
      return res.status(400).json({ error: 'baseId and tableId are required' });
    }

    const airtable = new AirtableAPI(req.user.getDecryptedToken());
    const fields = await airtable.getFields(baseId, tableId);
    res.json(fields);
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create record in Airtable
router.post('/create-record', auth, async (req, res) => {
  try {
    const { baseId, tableId, recordData } = req.body;

    if (!baseId || !tableId || !recordData) {
      return res.status(400).json({ error: 'baseId, tableId, and recordData are required' });
    }

    const airtable = new AirtableAPI(req.user.getDecryptedToken());
    const record = await airtable.createRecord(baseId, tableId, recordData);

    res.json({
      success: true,
      recordId: record.id,
      record: record
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload file locally and return URL
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Return the local file URL
    const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;