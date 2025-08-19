import { useAuth } from '../contexts/AuthContext'

const Landing = () => {
  const { user, loading } = useAuth()

  const handleLogin = () => {
    // Use the API base URL from environment variables
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const loginUrl = `${apiUrl}/auth/airtable/login`
    
    // Use a more reliable redirect method
    try {
      window.location.assign(loginUrl)
    } catch (error) {
      console.error('Redirect failed:', error)
      // Fallback: open in new tab
      window.open(loginUrl, '_blank')
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is logged in, show dashboard link instead of redirect
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h1>
          <a 
            href="/dashboard" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Dynamic Airtable
            <span className="text-blue-600"> Form Builder</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create beautiful, dynamic forms from your Airtable bases. Add conditional logic, 
            collect responses, and sync data seamlessly.
          </p>
          
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Login with Airtable
              </button>
            </div>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-blue-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Easy Form Building</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Select your Airtable base and table, then build forms from supported field types with drag-and-drop simplicity.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-blue-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Conditional Logic</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add smart show/hide rules to create dynamic forms that adapt based on user responses.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-blue-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Seamless Sync</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Form submissions are automatically saved to your Airtable base using your authenticated connection.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Field Types</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Short Text', 'Long Text', 'Single Select', 'Multi Select', 'Attachments'].map((type) => (
                <span key={type} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing