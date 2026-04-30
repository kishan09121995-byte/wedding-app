import { useState } from 'react'
import { Phone, Lock, CheckCircle2, AlertCircle, Loader } from 'lucide-react'
import { toast } from 'sonner'

const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app'

export default function RegisterBride() {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestData, setGuestData] = useState<any>(null)
  const [sessionToken, setSessionToken] = useState('')

  const handleGenerateOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      toast.error('Please enter phone number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate OTP')

      toast.success('OTP sent to your phone!')
      setStep('otp')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim()) {
      toast.error('Please enter OTP')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp_code: otpCode,
          affiliation: 'Bride',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'OTP verification failed')

      setSessionToken(data.session_token)
      setGuestData(data.guest)
      setStep('success')
      toast.success('Registration successful! 🎉')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">💍 Bride's Side Registration</h1>
          <p className="text-pink-100">Verify your phone number to access wedding updates</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Step 1: Phone Number */}
        {step === 'phone' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Enter Phone Number</h2>
            </div>

            <form onSubmit={handleGenerateOTP} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the phone number registered with us
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Make sure you have access to this phone number to receive the OTP.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Enter OTP</h2>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  One-Time Password
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-center text-2xl letter-spacing tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Check your phone for the 6-digit code
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-pink-600 font-semibold py-2 hover:text-pink-700"
              >
                ← Back to Phone Number
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && guestData && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful! 🎉</h2>

              <div className="bg-pink-50 rounded-lg p-6 mb-6 text-left space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Guest Name</p>
                  <p className="text-lg font-bold text-gray-900">{guestData.guest_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room Number</p>
                  <p className="text-lg font-bold text-gray-900">{guestData.room_number || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotel</p>
                  <p className="text-lg font-bold text-gray-900">{guestData.hotel_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Party Size</p>
                  <p className="text-lg font-bold text-gray-900">{guestData.pax_total} guests</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  ✅ You're all set! Your information has been synced from our master guest list.
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('wedding_session_token', sessionToken)
                  window.location.href = '/'
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all"
              >
                Continue to Wedding Portal →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
