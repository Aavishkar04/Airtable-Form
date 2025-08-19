import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { evaluateConditionalLogic, validateForm } from '../utils/conditionalLogic'

const FormViewer = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await api.get(`/api/forms/${id}`)
      setForm(response.data)
    } catch (error) {
      console.error('Failed to fetch form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }))
    }
  }

  const handleFileUpload = async (fieldId, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/api/airtable/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      handleAnswerChange(fieldId, response.data.url)
    } catch (error) {
      console.error('File upload failed:', error)
      alert('File upload failed. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form) return

    // Validate form
    const validationErrors = validateForm(form.fields, answers)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      const response = await api.post(`/api/forms/${id}/submit`, {
        answers
      })

      setSubmitResult(response.data)
      setSubmitted(true)
    } catch (error) {
      console.error('Form submission failed:', error)
      if (error.response?.data?.errors) {
        // Server validation errors
        const serverErrors = {}
        error.response.data.errors.forEach(err => {
          // Try to match error to field
          const field = form.fields.find(f => err.includes(f.questionLabel))
          if (field) {
            serverErrors[field.fieldId] = err
          }
        })
        setErrors(serverErrors)
      } else {
        alert('Form submission failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (field) => {
    const value = answers[field.fieldId] || ''
    const error = errors[field.fieldId]

    const fieldComponent = (() => {
      switch (field.type) {
        case 'short_text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter text..."
              required={field.required}
            />
          )

        case 'long_text':
          return (
            <textarea
              value={value}
              onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter text..."
              required={field.required}
            />
          )

        case 'single_select':
          return (
            <select
              value={value}
              onChange={(e) => handleAnswerChange(field.fieldId, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              required={field.required}
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
            <div>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    handleFileUpload(field.fieldId, file)
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.csv"
              />
              {value && (
                <div className="mt-2 text-sm text-green-600">
                  File uploaded successfully
                </div>
              )}
            </div>
          )

        default:
          return (
            <div className="text-gray-500 italic">
              Unsupported field type: {field.type}
            </div>
          )
      }
    })()

    return (
      <div key={field.fieldId} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.questionLabel}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {fieldComponent}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your form has been submitted successfully.
          </p>
          {submitResult?.recordId && (
            <p className="text-sm text-gray-500">
              Record ID: {submitResult.recordId}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    )
  }

  const visibleFields = evaluateConditionalLogic(form.fields, answers)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.name}</h1>
            <p className="text-sm text-gray-500">
              {form.baseName} → {form.tableName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {visibleFields.map(renderField)}

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>

          {/* Hidden fields indicator */}
          {form.fields.length > visibleFields.length && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                Some fields are hidden based on your current answers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormViewer