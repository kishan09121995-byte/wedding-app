import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Guest {
  id: string
  name: string
  city: string
  pax_total: number
  side: string
  rsvp_status: string
}

export default function RSVPPortal() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [guest, setGuest] = useState<Guest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const loadGuest = async () => {
      if (!token) {
        toast.error('Invalid RSVP link')
        return
      }

      const { data, error } = await supabase
        .from('guests')
        .select('id,name,city,pax_total,side,rsvp_status')
        .eq('qr_token', token)
        .single()

      if (error || !data) {
        toast.error('Guest not found')
        console.error(error)
      } else {
        setGuest(data as Guest)
      }

      setLoading(false)
    }

    loadGuest()
  }, [token])

  const handleRSVP = async (status: string) => {
    if (!guest) return
    setSubmitting(true)

    const { error } = await supabase
      .from('guests')
      .update({ rsvp_status: status })
      .eq('id', guest.id)

    if (error) {
      toast.error('Failed to submit RSVP')
      console.error(error)
    } else {
      setGuest({ ...guest, rsvp_status: status })
      setSubmitted(true)
      toast.success('RSVP submitted successfully!')

      setTimeout(() => {
        navigate('/')
      }, 3000)
    }

    setSubmitting(false)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-mauve mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    )

  if (!guest)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid RSVP Link</h1>
          <p className="text-gray-600">This RSVP link is not valid. Please check the link or contact the couple.</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-gold/10 via-mauve/10 to-gold/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-mauve to-rose-gold p-8 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">💍 Wedding Invitation 💍</h1>
          <p className="text-sm opacity-90">Kishan & Megha</p>
          <p className="text-xs opacity-75">June 21-22, 2026 | Leo Resorts, Junagadh</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {!submitted ? (
            <>
              {/* Guest Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Welcome,</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{guest.name}</h2>
                <p className="text-xs text-gray-600">
                  {guest.side} Side • {guest.city}
                </p>
                <p className="text-lg font-semibold text-mauve mt-2">{guest.pax_total} person(s)</p>
              </div>

              {/* RSVP Message */}
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-2">Please confirm your attendance:</p>
                <p className="text-sm text-gray-600">Your response helps us plan better for our big day!</p>
              </div>

              {/* RSVP Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleRSVP('Confirmed')}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>✅ Yes, I'll be there!</span>
                </button>

                <button
                  onClick={() => handleRSVP('Not Decided')}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HelpCircle className="w-6 h-6" />
                  <span>🤔 Still thinking...</span>
                </button>

                <button
                  onClick={() => handleRSVP('Declined')}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-6 h-6" />
                  <span>❌ Can't make it</span>
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 text-center">
                <p className="font-medium">Current Status:</p>
                <p className="text-sm font-semibold mt-1">{guest.rsvp_status}</p>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h2>
                <p className="text-gray-700 mb-4">
                  We've received your RSVP as <strong>{guest.rsvp_status}</strong>
                </p>
                <p className="text-sm text-gray-600">We look forward to celebrating with you! 🎉</p>
              </div>

              {/* Redirect Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-xs text-blue-800">
                Redirecting in a moment...
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
          If you have any questions, please contact the couple directly.
        </div>
      </div>
    </div>
  )
}
