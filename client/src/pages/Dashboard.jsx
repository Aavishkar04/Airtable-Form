import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const Dashboard = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      const response = await api.get('/api/forms')
      setForms(response.data)
    } catch (error) {
      console.error('Failed to fetch forms:', error)
      setError('Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  const deleteForm = async (formId) => {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      await api.delete(`/api/forms/${formId}`)
      setForms(forms.filter(form => form._id !== formId))
    } catch (error) {
      console.error('Failed to delete form:', error)
      alert('Failed to delete form')
    }
  }

  const copyFormLink = (formId) => {
    const link = `${window.location.origin}/form/${formId}`
    navigator.clipboard.writeText(link)
    alert('Form link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
        <Link
          to="/builder"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create New Form
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first form.</p>
          <div className="mt-6">
            <Link
              to="/builder"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div key={form._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {form.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyFormLink(form._id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy form link"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteForm(form._id)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete form"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {form.baseName} → {form.tableName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="mt-4 flex space-x-3">
                  <Link
                    to={`/form/${form._id}`}
                    target="_blank"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-medium text-center"
                  >
                    Preview
                  </Link>
                  <Link
                    to={`/builder/${form._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium text-center"
                  >
                    Edit
                  </Link>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  Created {new Date(form.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard