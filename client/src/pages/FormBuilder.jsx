import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import BaseTableSelector from '../components/BaseTableSelector'
import FieldSelector from '../components/FieldSelector'
import FormPreview from '../components/FormPreview'

const FormBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    baseId: '',
    baseName: '',
    tableId: '',
    tableName: '',
    fields: []
  })
  
  // Available data
  const [bases, setBases] = useState([])
  const [tables, setTables] = useState([])
  const [availableFields, setAvailableFields] = useState([])

  useEffect(() => {
    if (id) {
      loadExistingForm()
    } else {
      fetchBases()
    }
  }, [id])

  const loadExistingForm = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/forms/${id}`)
      const form = response.data
      
      setFormData({
        name: form.name,
        baseId: form.baseId,
        baseName: form.baseName,
        tableId: form.tableId,
        tableName: form.tableName,
        fields: form.fields
      })
      
      // Load available fields for editing
      const fieldsResponse = await api.get(`/api/airtable/fields?baseId=${form.baseId}&tableId=${form.tableId}`)
      setAvailableFields(fieldsResponse.data)
      setStep(2)
    } catch (error) {
      console.error('Failed to load form:', error)
      setError('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const fetchBases = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/airtable/bases')
      setBases(response.data)
    } catch (error) {
      console.error('Failed to fetch bases:', error)
      setError('Failed to load Airtable bases')
    } finally {
      setLoading(false)
    }
  }

  const fetchTables = async (baseId) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/airtable/tables?baseId=${baseId}`)
      setTables(response.data)
    } catch (error) {
      console.error('Failed to fetch tables:', error)
      setError('Failed to load tables')
    } finally {
      setLoading(false)
    }
  }

  const fetchFields = async (baseId, tableId) => {
    try {
      setLoading(true)
      const response = await api.get(`/api/airtable/fields?baseId=${baseId}&tableId=${tableId}`)
      setAvailableFields(response.data)
    } catch (error) {
      console.error('Failed to fetch fields:', error)
      setError('Failed to load fields')
    } finally {
      setLoading(false)
    }
  }

  const handleBaseTableSelect = async (baseId, baseName, tableId, tableName) => {
    setFormData(prev => ({
      ...prev,
      baseId,
      baseName,
      tableId,
      tableName,
      fields: [] // Reset fields when changing base/table
    }))
    
    await fetchFields(baseId, tableId)
    setStep(2)
  }

  const handleFieldsUpdate = (fields) => {
    setFormData(prev => ({ ...prev, fields }))
  }

  const handleSaveForm = async () => {
    if (!formData.name.trim()) {
      setError('Please enter a form name')
      return
    }

    if (formData.fields.length === 0) {
      setError('Please add at least one field to your form')
      return
    }

    try {
      setLoading(true)
      
      if (id) {
        // Update existing form
        await api.put(`/api/forms/${id}`, {
          name: formData.name,
          fields: formData.fields
        })
      } else {
        // Create new form
        await api.post('/api/forms', formData)
      }
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to save form:', error)
      setError('Failed to save form')
    } finally {
      setLoading(false)
    }
  }

  const openPreview = () => {
    if (id) {
      window.open(`/form/${id}`, '_blank')
    } else {
      alert('Please save the form first to preview it')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Form' : 'Create New Form'}
            </h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                step === 1 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                1. Select Base & Table
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                step === 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                2. Build Form
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {id && (
              <button
                onClick={openPreview}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Preview
              </button>
            )}
            {step === 2 && (
              <button
                onClick={handleSaveForm}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {loading ? 'Saving...' : (id ? 'Update Form' : 'Save Form')}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step 1: Base & Table Selection */}
      {step === 1 && (
        <BaseTableSelector
          bases={bases}
          tables={tables}
          onBaseSelect={fetchTables}
          onTableSelect={handleBaseTableSelect}
          loading={loading}
        />
      )}

      {/* Step 2: Form Building */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FieldSelector
              formData={formData}
              availableFields={availableFields}
              onFieldsUpdate={handleFieldsUpdate}
              onNameChange={(name) => setFormData(prev => ({ ...prev, name }))}
            />
          </div>
          <div>
            <FormPreview
              formData={formData}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FormBuilder