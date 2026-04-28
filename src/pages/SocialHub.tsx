import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Copy, Share2, QrCode } from 'lucide-react'
import QRCode from 'qrcode.react'
import { toast } from 'sonner'

interface SocialHandle {
  id: string
  platform: string
  handle: string
  url: string
}

const PLATFORMS = ['Instagram', 'WhatsApp', 'YouTube', 'Facebook', 'TikTok']

export default function SocialHub() {
  const guests = useGuestStore((state) => state.guests)
  const [handles, setHandles] = useState<SocialHandle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newHandle, setNewHandle] = useState({ platform: 'Instagram', handle: '', url: '' })
  const [selectedGuest, setSelectedGuest] = useState<string>(guests[0]?.id || '')
  const [qrGuest, setQrGuest] = useState<string | null>(null)

  useEffect(() => {
    const loadHandles = async () => {
      const { data, error } = await supabase.from('social_handles').select('*')

      if (error) console.error('Error loading handles:', error)
      if (data) setHandles(data as SocialHandle[])
      setLoading(false)
    }

    loadHandles()
  }, [])

  const handleAddHandle = async () => {
    if (!newHandle.handle.trim()) {
      toast.error('Please enter a handle')
      return
    }

    setSaving(true)

    const { data, error } = await supabase
      .from('social_handles')
      .insert([newHandle])
      .select()

    if (error) {
      toast.error('Failed to add handle')
      console.error(error)
    } else if (data) {
      setHandles([...handles, data[0] as SocialHandle])
      setNewHandle({ platform: 'Instagram', handle: '', url: '' })
      toast.success('Handle added')
    }

    setSaving(false)
  }

  const handleDeleteHandle = async (handleId: string) => {
    setSaving(true)

    const { error } = await supabase.from('social_handles').delete().eq('id', handleId)

    if (error) {
      toast.error('Failed to delete handle')
      console.error(error)
    } else {
      setHandles((prev) => prev.filter((h) => h.id !== handleId))
      toast.success('Handle deleted')
    }

    setSaving(false)
  }

  const currentGuest = guests.find((g) => g.id === selectedGuest)
  const rsvpUrl = `${window.location.origin}/rsvp/${currentGuest?.id}`

  const generateWhatsAppMessage = () => {
    if (!currentGuest) return ''

    return `Hi ${currentGuest.name}! 👋\n\nWe'd love to have you at our wedding! 💍\n\nPlease confirm your attendance here:\n${rsvpUrl}\n\nJoin us for an unforgettable celebration! 🎉`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Social Hub</h1>
        <p className="text-gray-600 text-sm mt-1">Manage social handles and generate guest RSVP links & QR codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social Handles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Couple's Social Handles</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Add Handle */}
            <div className="space-y-3">
              <select
                value={newHandle.platform}
                onChange={(e) => setNewHandle({ ...newHandle, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Handle (e.g., @kishan_megha)"
                value={newHandle.handle}
                onChange={(e) => setNewHandle({ ...newHandle, handle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="url"
                placeholder="URL (e.g., https://instagram.com/...)"
                value={newHandle.url}
                onChange={(e) => setNewHandle({ ...newHandle, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={handleAddHandle}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Handle
              </button>
            </div>

            {/* Existing Handles */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
              {handles.length === 0 ? (
                <p className="text-gray-600 text-sm">No social handles yet</p>
              ) : (
                handles.map((handle) => (
                  <div key={handle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{handle.platform}</p>
                      <p className="text-xs text-gray-600">{handle.handle}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={handle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="Visit"
                      >
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </a>
                      <button
                        onClick={() => handleDeleteHandle(handle.id)}
                        disabled={saving}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RSVP & QR Generator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Guest RSVP & QR</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Guest Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Guest</label>
              <select
                value={selectedGuest}
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.city})
                  </option>
                ))}
              </select>
            </div>

            {currentGuest && (
              <>
                {/* RSVP Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Portal Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rsvpUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                    />
                    <button
                      onClick={() => copyToClipboard(rsvpUrl)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* WhatsApp Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message</label>
                  <textarea
                    value={generateWhatsAppMessage()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 h-24"
                  />
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Open WhatsApp
                  </a>
                </div>

                {/* QR Code */}
                <div>
                  <button
                    onClick={() => setQrGuest(qrGuest === currentGuest.id ? null : currentGuest.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    <QrCode className="w-4 h-4" />
                    {qrGuest === currentGuest.id ? 'Hide QR' : 'Show QR Code'}
                  </button>

                  {qrGuest === currentGuest.id && (
                    <div className="mt-4 flex flex-col items-center bg-gray-50 p-4 rounded-lg">
                      <QRCode value={rsvpUrl} size={200} level="H" includeMargin={true} />
                      <p className="text-xs text-gray-600 mt-3 text-center">
                        Scan to RSVP: {currentGuest.name}
                      </p>
                      <button
                        onClick={() => {
                          const qrCanvas = document.querySelector('canvas')
                          if (qrCanvas) {
                            const link = document.createElement('a')
                            link.href = qrCanvas.toDataURL()
                            link.download = `qr-${currentGuest.name}.png`
                            link.click()
                          }
                        }}
                        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        Download QR
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
