import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import AuthCallback from './pages/AuthCallback'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import FormViewer from './pages/FormViewer'
import Test from './pages/Test'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/test" element={<Test />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/builder" 
                element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/builder/:id" 
                element={
                  <ProtectedRoute>
                    <FormBuilder />
                  </ProtectedRoute>
                } 
              />
              <Route path="/form/:id" element={<FormViewer />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App