import { useState } from 'react'
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { generateAllRSVPTokens } from '../lib/generateRSVPTokens'

export default function SetupRSVP() {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [count, setCount] = useState(0)

  const handleGenerateTokens = async () => {
    setLoading(true)
    try {
      const result = await generateAllRSVPTokens()
      if (result.success) {
        setCount(result.count || 0)
        setCompleted(true)
        toast.success(`✅ Generated ${result.count || 0} RSVP tokens`)
      } else {
        toast.error('Failed to generate tokens')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error generating tokens')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">RSVP System Setup</h1>
            <p className="text-gray-600 mt-2">Generate secure RSVP tokens for all guests</p>
          </div>

          {!completed ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold text-blue-900 mb-2">What This Does:</h2>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✅ Generates unique RSVP tokens for all 294 guests</li>
                  <li>✅ Stores tokens in the guests table</li>
                  <li>✅ Enables secure `/rsvp/:token` URLs</li>
                  <li>✅ Allows guests to RSVP without login</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateTokens}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all text-lg flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {loading ? 'Generating Tokens...' : 'Generate RSVP Tokens for All Guests'}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> This one-time setup generates unique tokens for each guest. After this, guests can scan QR codes from Social Hub to RSVP.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-green-800 mb-2">Setup Complete! ✅</h2>
                <p className="text-green-700 mb-4">
                  Generated <strong>{count}</strong> RSVP tokens
                </p>
                <p className="text-sm text-green-600">
                  Guests can now scan QR codes from <strong>Social Hub</strong> to RSVP
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-purple-900">Next Steps:</h3>
                <ol className="text-sm text-purple-800 space-y-1">
                  <li>1. Go to <strong>Social Hub</strong> from sidebar</li>
                  <li>2. Select a guest from dropdown</li>
                  <li>3. Click <strong>"Show QR Code"</strong></li>
                  <li>4. Download or share QR code → guests scan to RSVP</li>
                </ol>
              </div>

              <a
                href="/"
                className="block text-center bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition"
              >
                ← Back to Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
