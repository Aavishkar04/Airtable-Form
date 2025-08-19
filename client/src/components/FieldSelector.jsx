import { useState } from 'react'
import ConditionalLogicEditor from './ConditionalLogicEditor'

const FieldSelector = ({ formData, availableFields, onFieldsUpdate, onNameChange }) => {
  const [showConditionalEditor, setShowConditionalEditor] = useState(null)

  const addField = (availableField) => {
    const newField = {
      fieldId: availableField.id,
      fieldName: availableField.name,
      questionLabel: availableField.name,
      type: availableField.type,
      required: false,
      options: availableField.options || [],
      order: formData.fields.length
    }

    onFieldsUpdate([...formData.fields, newField])
  }

  const removeField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index)
    onFieldsUpdate(updatedFields.map((field, i) => ({ ...field, order: i })))
  }

  const updateField = (index, updates) => {
    const updatedFields = formData.fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    )
    onFieldsUpdate(updatedFields)
  }

  const moveField = (dragIndex, hoverIndex) => {
    const draggedField = formData.fields[dragIndex]
    const updatedFields = [...formData.fields]
    updatedFields.splice(dragIndex, 1)
    updatedFields.splice(hoverIndex, 0, draggedField)
    
    // Update order
    const reorderedFields = updatedFields.map((field, i) => ({ ...field, order: i }))
    onFieldsUpdate(reorderedFields)
  }

  const getFieldTypeIcon = (type) => {
    switch (type) {
      case 'short_text':
        return '📝'
      case 'long_text':
        return '📄'
      case 'single_select':
        return '🔘'
      case 'multi_select':
        return '☑️'
      case 'attachment':
        return '📎'
      default:
        return '❓'
    }
  }

  const getFieldTypeName = (type) => {
    switch (type) {
      case 'short_text':
        return 'Short Text'
      case 'long_text':
        return 'Long Text'
      case 'single_select':
        return 'Single Select'
      case 'multi_select':
        return 'Multi Select'
      case 'attachment':
        return 'Attachment'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Form Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter form name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Available Fields */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Available Fields</h3>
        <div className="space-y-2">
          {availableFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getFieldTypeIcon(field.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">{field.name}</p>
                  <p className="text-sm text-gray-500">{getFieldTypeName(field.type)}</p>
                </div>
              </div>
              <button
                onClick={() => addField(field)}
                disabled={formData.fields.some(f => f.fieldId === field.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-sm"
              >
                {formData.fields.some(f => f.fieldId === field.id) ? 'Added' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Form Fields</h3>
        {formData.fields.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No fields added yet. Add fields from the available fields above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.fields.map((field, index) => (
              <FormFieldItem
                key={field.fieldId}
                field={field}
                index={index}
                onUpdate={(updates) => updateField(index, updates)}
                onRemove={() => removeField(index)}
                onMove={moveField}
                onEditConditional={() => setShowConditionalEditor(index)}
                formFields={formData.fields}
              />
            ))}
          </div>
        )}
      </div>

      {/* Conditional Logic Editor Modal */}
      {showConditionalEditor !== null && (
        <ConditionalLogicEditor
          field={formData.fields[showConditionalEditor]}
          availableFields={formData.fields.filter((_, i) => i < showConditionalEditor)}
          onSave={(showWhen) => {
            updateField(showConditionalEditor, { showWhen })
            setShowConditionalEditor(null)
          }}
          onCancel={() => setShowConditionalEditor(null)}
        />
      )}
    </div>
  )
}

const FormFieldItem = ({ field, index, onUpdate, onRemove, onMove, onEditConditional, formFields }) => {
  return (
    <div className="p-4 bg-white border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Field Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Label
            </label>
            <input
              type="text"
              value={field.questionLabel}
              onChange={(e) => onUpdate({ questionLabel: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Field Options */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>

            {formFields.length > 1 && (
              <button
                onClick={onEditConditional}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {field.showWhen ? 'Edit Conditions' : 'Add Conditions'}
              </button>
            )}
          </div>

          {/* Conditional Logic Indicator */}
          {field.showWhen && field.showWhen.conditions && field.showWhen.conditions.length > 0 && (
            <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
              Conditional: Shows when {field.showWhen.mode === 'all' ? 'all' : 'any'} of {field.showWhen.conditions.length} condition(s) are met
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => index > 0 && onMove(index, index - 1)}
              disabled={index === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={() => onMove(index, index + 1)}
              className="text-gray-400 hover:text-gray-600"
              title="Move down"
            >
              ↓
            </button>
          </div>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FieldSelector