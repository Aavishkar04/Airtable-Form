const express = require('express');
const auth = require('../middleware/auth');
const Form = require('../models/Form');
const Submission = require('../models/Submission');
const AirtableAPI = require('../utils/airtable');

const router = express.Router();

// Create form
router.post('/', auth, async (req, res) => {
  try {
    const { name, baseId, baseName, tableId, tableName, fields } = req.body;
    
    if (!name || !baseId || !tableId || !fields || !Array.isArray(fields)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const form = new Form({
      ownerId: req.user._id,
      name,
      baseId,
      baseName,
      tableId,
      tableName,
      fields
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's forms
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get form by ID (public endpoint for form viewing)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('ownerId', 'name email');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update form
router.put('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      ownerId: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const { name, fields } = req.body;
    
    if (name) form.name = name;
    if (fields) form.fields = fields;

    await form.save();
    res.json(form);
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete form
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ 
      _id: req.params.id, 
      ownerId: req.user._id 
    });
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit form
router.post('/:id/submit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('ownerId');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const { answers } = req.body;
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers format' });
    }

    // Validate required fields
    const errors = [];
    const visibleFields = evaluateConditionalLogic(form.fields, answers);
    
    for (const field of visibleFields) {
      if (field.required && (!answers[field.fieldId] || answers[field.fieldId] === '')) {
        errors.push(`${field.questionLabel} is required`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors });
    }

    // Transform answers to Airtable format
    const airtableData = {};
    
    for (const field of form.fields) {
      const answer = answers[field.fieldId];
      if (answer !== undefined && answer !== null && answer !== '') {
        
        switch (field.type) {
          case 'attachment':
            // Handle file URLs for attachments
            if (Array.isArray(answer)) {
              airtableData[field.fieldName] = answer.map(url => ({ url }));
            } else if (typeof answer === 'string') {
              airtableData[field.fieldName] = [{ url: answer }];
            }
            break;
          
          case 'multi_select':
            // Ensure multi-select is an array
            airtableData[field.fieldName] = Array.isArray(answer) ? answer : [answer];
            break;
          
          default:
            airtableData[field.fieldName] = answer;
        }
      }
    }

    // Create record in Airtable
    const airtable = new AirtableAPI(form.ownerId.getDecryptedToken());
    const record = await airtable.createRecord(form.baseId, form.tableId, airtableData);

    // Store submission locally
    const submission = new Submission({
      formId: form._id,
      airtableRecordId: record.id,
      payload: answers
    });
    await submission.save();

    res.json({
      success: true,
      recordId: record.id,
      submissionId: submission._id,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to evaluate conditional logic
function evaluateConditionalLogic(fields, answers) {
  return fields.filter(field => {
    if (!field.showWhen || !field.showWhen.conditions || field.showWhen.conditions.length === 0) {
      return true; // Show field if no conditions
    }

    const { conditions, mode } = field.showWhen;
    const results = conditions.map(condition => {
      const fieldValue = answers[condition.fieldId];
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'includes':
          return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
        case 'not_includes':
          return !Array.isArray(fieldValue) || !fieldValue.includes(condition.value);
        default:
          return false;
      }
    });

    return mode === 'all' ? results.every(r => r) : results.some(r => r);
  });
}

module.exports = router;