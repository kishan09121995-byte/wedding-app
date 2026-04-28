import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function PasswordReset() {
  const [step, setStep] = useState<'login' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const authEmail = email.includes('@') ? email : `${email}@wedding.local`

      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: currentPassword,
      })

      if (error) throw error
      setStep('reset')
      setMessage('Logged in! Now set your new password.')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setSuccess(true)
      setMessage('Password updated successfully! Please log out and log back in.')
      setTimeout(() => {
        supabase.auth.signOut()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Password update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-8 h-8 text-rose-gold" />
            <h1 className="text-3xl font-bold text-mauve">Password Reset</h1>
          </div>
          <p className="text-gray-600">Update your wedding app password</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Verify Your Account
              </h2>

              {message && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kishan"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? 'Verifying...' : 'Next'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Set New Password
              </h2>

              {message && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (minimum 6 characters)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login')
                  setError('')
                  setMessage('')
                }}
                className="w-full text-rose-gold hover:text-rose-gold/80 font-medium py-2"
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
