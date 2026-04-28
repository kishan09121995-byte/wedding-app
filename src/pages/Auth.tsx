import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert simple username to full email format
      const authEmail = email.includes('@') ? email : `${email}@weddingapp.test`

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: { role: 'couple' },
          },
        })
        if (error) throw error
        setEmail('')
        setPassword('')
        setIsSignUp(false)
        setError('Check your email to confirm signup!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-rose-gold fill-rose-gold" />
            <h1 className="text-3xl font-bold text-mauve">Wedding App</h1>
          </div>
          <p className="text-gray-600">Kishan & Megha | June 21–22, 2026</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>

          {error && (
            <div className={`mb-4 p-3 rounded-lg flex gap-2 ${
              error.includes('Check')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kishan"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="space-y-4 mt-6">
            <p className="text-center text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-rose-gold hover:text-rose-gold/80 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
            {!isSignUp && (
              <p className="text-center text-sm text-gray-600">
                Need to change password?{' '}
                <button
                  onClick={() => navigate('/reset-password')}
                  className="text-rose-gold hover:text-rose-gold/80 font-medium"
                >
                  Reset Password
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          {isSignUp ? 'Sign up with any username (e.g., admin, test), then use Admin panel to create all accounts' : 'Login with username (e.g., kishan, megha, photographer) + password test123@'}
        </p>
      </div>
    </div>
  )
}
