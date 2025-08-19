import { useState, useEffect } from 'react'

const Test = () => {
  const [backendStatus, setBackendStatus] = useState('Testing...')
  const [oauthTest, setOauthTest] = useState('Not tested')

  useEffect(() => {
    testBackend()
  }, [])

  const testBackend = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const response = await fetch(`${apiUrl}/health`)
      const data = await response.json()
      setBackendStatus(`✅ Backend OK: ${data.status}`)
    } catch (error) {
      setBackendStatus(`❌ Backend Error: ${error.message}`)
    }
  }

  const testOAuth = () => {
    setOauthTest('Redirecting...')
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    window.location.href = `${apiUrl}/auth/airtable/login`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Backend Status</h2>
            <p className="text-sm">{backendStatus}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">OAuth Test</h2>
            <p className="text-sm mb-2">{oauthTest}</p>
            <button
              onClick={testOAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Test Airtable Login
            </button>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Manual Tests</h2>
            <ul className="text-sm space-y-1">
              <li>• Backend Health: <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/health`} target="_blank" className="text-blue-600">Backend Health Check</a></li>
              <li>• OAuth Login: <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/auth/airtable/login`} target="_blank" className="text-blue-600">OAuth Login Test</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Test