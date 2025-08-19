import { useState } from 'react'
import { evaluateConditionalLogic } from '../utils/conditionalLogic'

const FormPreview = ({ formData }) => {
  const [answers, setAnswers] = useState({})

  const visibleFields = evaluateConditionalLogic(formData.fields, answers)

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }

  const renderField = (field) => {
    const value = answers[field.fieldId] || ''

    switch (field.type) {
      case 'short_text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
          />
        )

      case 'long_text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
          />
        )

      case 'single_select':
        return (
          <select
            value={value}
            onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option...</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'multi_select':
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleAnswerChange(field.fieldId, [...currentValues, option])
                    } else {
                      handleAnswerChange(field.fieldId, currentValues.filter(v => v !== option))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'attachment':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">File upload (preview only)</p>
          </div>
        )

      default:
        return (
          <div className="text-gray-500 italic">
            Unsupported field type: {field.type}
          </div>
        )
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Form Preview</h3>
      
      {formData.name && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
          {formData.baseName && formData.tableName && (
            <p className="text-sm text-gray-500 mt-1">
              {formData.baseName} → {formData.tableName}
            </p>
          )}
        </div>
      )}

      {formData.fields.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Add fields to see the form preview
        </div>
      ) : (
        <div className="space-y-6">
          {visibleFields.map((field) => (
            <div key={field.fieldId} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.questionLabel}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              
              {/* Show conditional logic info */}
              {field.showWhen && field.showWhen.conditions && field.showWhen.conditions.length > 0 && (
                <p className="text-xs text-blue-600">
                  Conditional field (showing based on current answers)
                </p>
              )}
            </div>
          ))}

          <div className="pt-4 border-t">
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
              disabled
            >
              Submit (Preview Only)
            </button>
          </div>
        </div>
      )}

      {/* Hidden fields indicator */}
      {formData.fields.length > visibleFields.length && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            {formData.fields.length - visibleFields.length} field(s) hidden by conditional logic
          </p>
        </div>
      )}
    </div>
  )
}

export default FormPreview