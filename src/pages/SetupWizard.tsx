import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AlertCircle, CheckCircle, Settings } from 'lucide-react'

export default function SetupWizard() {
  const [password, setPassword] = useState('test123@')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState('')

  const allUsers = [
    { username: 'kishan', role: 'admin' },
    { username: 'megha', role: 'admin' },
    { username: 'palak', role: 'editor' },
    { username: 'payal', role: 'editor' },
    { username: 'darsh', role: 'editor' },
    { username: 'sahil', role: 'editor' },
    { username: 'kruti', role: 'editor' },
    { username: 'dharmesh', role: 'editor' },
    { username: 'nilesh', role: 'editor' },
    { username: 'alka', role: 'editor' },
    { username: 'nalita', role: 'editor' },
    { username: 'photographer', role: 'vendor' },
    { username: 'decorator', role: 'vendor' },
    { username: 'caterer', role: 'vendor' },
    { username: 'eventmanager1', role: 'event_manager' },
    { username: 'eventmanager2', role: 'event_manager' },
  ]

  const handleCreateAllAccounts = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    setProgress('')

    let created = 0
    let failed = 0

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i]
      const email = `${user.username}@weddingapp.test`

      try {
        setProgress(`Creating ${user.username}... (${i + 1}/${allUsers.length})`)

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: user.username,
              role: user.role
            }
          }
        })

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setProgress(`Skipping ${user.username} (already exists) (${i + 1}/${allUsers.length})`)
          } else {
            console.log(`Failed ${user.username}:`, signUpError.message)
            failed++
          }
        } else {
          created++
        }

        // Wait 1 second between signups to avoid rate limits
        if (i < allUsers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (err) {
        console.log(`Error ${user.username}:`, err)
        failed++
      }
    }

    setProgress('')
    setSuccess(true)
    setError(`Created ${created} accounts. Password for all: ${password}`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-gold/10 to-mauve/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings className="w-8 h-8 text-rose-gold" />
            <h1 className="text-3xl font-bold text-mauve">Wedding App Setup</h1>
          </div>
          <p className="text-gray-600">Create all 16 user accounts at once</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
              success
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {success ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{error}</p>
            </div>
          )}

          {progress && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <p className="text-sm font-medium">{progress}</p>
            </div>
          )}

          <form onSubmit={handleCreateAllAccounts} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password for All Accounts
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="test123@"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* User List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Users to Create (16 total)
              </label>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
                {allUsers.map((user) => (
                  <div key={user.username} className="text-sm text-gray-700">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-gray-500 ml-2">
                      ({user.role === 'event_manager' ? 'EVENT MGR' : user.role.toUpperCase()})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Format Info */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-2">How it works:</p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Creates accounts with format: username@weddingapp.test</li>
                <li>• All accounts get the same password</li>
                <li>• Takes ~15 seconds to create all 16 accounts</li>
                <li>• Example: kishan@weddingapp.test / test123@</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || password.length < 6}
              className="w-full bg-rose-gold hover:bg-rose-gold/90 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? `Creating Accounts...` : 'Create All 16 Accounts'}
            </button>

            {/* Login Info */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">After setup, login with:</p>
              <p className="text-sm text-green-600">Username: kishan (or any username)</p>
              <p className="text-sm text-green-600">Password: {password}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
