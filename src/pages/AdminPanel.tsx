import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle, Users, Key } from 'lucide-react'

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleCreateAllAccounts = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const allAccounts = [
      { email: 'kishan@weddingapp.test', username: 'kishan', role: 'admin' },
      { email: 'megha@weddingapp.test', username: 'megha', role: 'admin' },
      { email: 'palak@weddingapp.test', username: 'palak', role: 'editor' },
      { email: 'payal@weddingapp.test', username: 'payal', role: 'editor' },
      { email: 'darsh@weddingapp.test', username: 'darsh', role: 'editor' },
      { email: 'sahil@weddingapp.test', username: 'sahil', role: 'editor' },
      { email: 'kruti@weddingapp.test', username: 'kruti', role: 'editor' },
      { email: 'dharmesh@weddingapp.test', username: 'dharmesh', role: 'editor' },
      { email: 'nilesh@weddingapp.test', username: 'nilesh', role: 'editor' },
      { email: 'alka@weddingapp.test', username: 'alka', role: 'editor' },
      { email: 'nalita@weddingapp.test', username: 'nalita', role: 'editor' },
      { email: 'photographer@weddingapp.test', username: 'photographer', role: 'vendor' },
      { email: 'decorator@weddingapp.test', username: 'decorator', role: 'vendor' },
      { email: 'caterer@weddingapp.test', username: 'caterer', role: 'vendor' },
      { email: 'eventmanager1@weddingapp.test', username: 'eventmanager1', role: 'event_manager' },
      { email: 'eventmanager2@weddingapp.test', username: 'eventmanager2', role: 'event_manager' },
    ]

    let created = 0
    let skipped = 0

    try {
      for (const account of allAccounts) {
        try {
          const { error: signUpError } = await supabase.auth.signUp({
            email: account.email,
            password: 'test123@',
            options: {
              data: {
                username: account.username,
                role: account.role
              }
            }
          })

          if (signUpError) {
            if (signUpError.message.includes('already registered')) {
              skipped++
            } else {
              console.log(`${account.username}: ${signUpError.message}`)
            }
          } else {
            created++
          }
        } catch (err: any) {
          console.log(`Error creating ${account.username}:`, err.message)
        }
      }

      setSuccess(true)
      setMessage(`Created ${created} accounts, ${skipped} already exist. All users: username / test123@`)
    } catch (err: any) {
      setError(err.message || 'Failed to create accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleResetOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      setSuccess(true)
      setMessage('Your password updated successfully! Please log in again.')
      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        supabase.auth.signOut()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-rose-gold" />
            <h1 className="text-3xl font-bold text-mauve">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage accounts and passwords</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Card 1: Change Your Own Password */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-6 h-6 text-rose-gold" />
            <h2 className="text-2xl font-bold text-gray-800">Change Your Password</h2>
          </div>

          <form onSubmit={handleResetOwnPassword} className="space-y-4">
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
              disabled={loading}
              className="w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Updating...' : 'Update My Password'}
            </button>
          </form>
        </div>

        {/* Card 2: Create All Accounts */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-rose-gold" />
            <h2 className="text-2xl font-bold text-gray-800">Setup All 16 User Accounts</h2>
          </div>

          <p className="text-gray-600 mb-4">
            Create all wedding app user accounts with password: <strong>test123@</strong>
          </p>

          <form onSubmit={handleCreateAllAccounts} className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">All 16 accounts with password: test123@</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                <div>
                  <p className="font-semibold">Admins:</p>
                  <p>kishan, megha</p>
                </div>
                <div>
                  <p className="font-semibold">Editors (9):</p>
                  <p>palak, payal, darsh, sahil, kruti, dharmesh, nilesh, alka, nalita</p>
                </div>
                <div>
                  <p className="font-semibold">Vendors (3):</p>
                  <p>photographer, decorator, caterer</p>
                </div>
                <div>
                  <p className="font-semibold">Event Mgrs (2):</p>
                  <p>eventmanager1, eventmanager2</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Creating All Accounts...' : 'Create All 16 Accounts'}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-amber-900 mb-2">For Other Users:</h3>
          <p className="text-sm text-amber-800 mb-3">
            Each user can reset their own password by:
          </p>
          <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
            <li>Go to login page</li>
            <li>Click "Reset Password"</li>
            <li>Enter their username and current password</li>
            <li>Set a new password (6+ characters)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
