import { useState } from 'react'

const ConditionalLogicEditor = ({ field, availableFields, onSave, onCancel }) => {
  const [conditions, setConditions] = useState(
    field.showWhen?.conditions || [{ fieldId: '', operator: 'equals', value: '' }]
  )
  const [mode, setMode] = useState(field.showWhen?.mode || 'all')

  const addCondition = () => {
    setConditions([...conditions, { fieldId: '', operator: 'equals', value: '' }])
  }

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index, updates) => {
    setConditions(conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    ))
  }

  const handleSave = () => {
    const validConditions = conditions.filter(c => c.fieldId && c.value !== '')
    
    if (validConditions.length === 0) {
      onSave(null) // Remove conditional logic
    } else {
      onSave({
        conditions: validConditions,
        mode
      })
    }
  }

  const getFieldOptions = (fieldId) => {
    const targetField = availableFields.find(f => f.fieldId === fieldId)
    return targetField?.options || []
  }

  const getOperatorOptions = (fieldType) => {
    switch (fieldType) {
      case 'single_select':
      case 'short_text':
      case 'long_text':
        return [
          { value: 'equals', label: 'equals' },
          { value: 'not_equals', label: 'does not equal' }
        ]
      case 'multi_select':
        return [
          { value: 'includes', label: 'includes' },
          { value: 'not_includes', label: 'does not include' }
        ]
      default:
        return [
          { value: 'equals', label: 'equals' },
          { value: 'not_equals', label: 'does not equal' }
        ]
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Conditional Logic for "{field.questionLabel}"
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show this field when:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All conditions are met (AND)</option>
              <option value="any">Any condition is met (OR)</option>
            </select>
          </div>

          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                {/* Field Selection */}
                <select
                  value={condition.fieldId}
                  onChange={(e) => updateCondition(index, { fieldId: e.target.value, value: '' })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select field...</option>
                  {availableFields.map((field) => (
                    <option key={field.fieldId} value={field.fieldId}>
                      {field.questionLabel}
                    </option>
                  ))}
                </select>

                {/* Operator Selection */}
                {condition.fieldId && (
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(index, { operator: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getOperatorOptions(
                      availableFields.find(f => f.fieldId === condition.fieldId)?.type
                    ).map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Value Input */}
                {condition.fieldId && (
                  <div className="flex-1">
                    {(() => {
                      const targetField = availableFields.find(f => f.fieldId === condition.fieldId)
                      const fieldOptions = getFieldOptions(condition.fieldId)
                      
                      if (fieldOptions.length > 0) {
                        return (
                          <select
                            value={condition.value}
                            onChange={(e) => updateCondition(index, { value: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select value...</option>
                            {fieldOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )
                      } else {
                        return (
                          <input
                            type="text"
                            value={condition.value}
                            onChange={(e) => updateCondition(index, { value: e.target.value })}
                            placeholder="Enter value..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )
                      }
                    })()}
                  </div>
                )}

                {/* Remove Condition */}
                <button
                  onClick={() => removeCondition(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addCondition}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add Condition
          </button>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(null)}
            className="px-4 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-md"
          >
            Remove Conditions
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Save Conditions
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConditionalLogicEditor