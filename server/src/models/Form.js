import mongoose from 'mongoose';

const conditionSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    enum: ['equals', 'not_equals', 'includes', 'not_includes'],
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const fieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  },
  questionLabel: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['short_text', 'long_text', 'single_select', 'multi_select', 'attachment'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String
  }],
  showWhen: {
    conditions: [conditionSchema],
    mode: {
      type: String,
      enum: ['all', 'any'],
      default: 'all'
    }
  },
  order: {
    type: Number,
    required: true
  }
});

const formSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  baseId: {
    type: String,
    required: true
  },
  baseName: {
    type: String,
    required: true
  },
  tableId: {
    type: String,
    required: true
  },
  tableName: {
    type: String,
    required: true
  },
  fields: [fieldSchema]
}, {
  timestamps: true
});

export default mongoose.model('Form', formSchema);