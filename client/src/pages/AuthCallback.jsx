import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    console.log('AuthCallback: Component mounted')
    console.log('AuthCallback: Processing authentication...')
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    console.log('AuthCallback: Token:', token ? 'Present' : 'Missing')
    console.log('AuthCallback: Error:', error)
    console.log('AuthCallback: Current URL:', window.location.href)

    if (error) {
      console.error('AuthCallback: Authentication error:', error)
      alert('Authentication failed: ' + error)
      window.location.href = '/'
      return
    }

    if (token) {
      console.log('AuthCallback: Token found, logging in...')
      try {
        login(token)
        console.log('AuthCallback: Login function called successfully')
        setTimeout(() => {
          console.log('AuthCallback: Redirecting to dashboard...')
          window.location.href = '/dashboard'
        }, 1000)
      } catch (error) {
        console.error('AuthCallback: Error during login:', error)
        alert('Login failed: ' + error.message)
        window.location.href = '/'
      }
    } else {
      console.error('AuthCallback: No token received')
      alert('No authentication token received')
      window.location.href = '/'
    }
  }, [searchParams, login])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  )
}

export default AuthCallback