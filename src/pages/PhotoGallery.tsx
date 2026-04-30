import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Download, Trash2, Image, RefreshCw, X, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface Photo {
  id: string
  url: string
  uploaded_at: string
  guest_tags: string[]
}

export default function PhotoGallery() {
  const guests = useGuestStore((state) => state.guests)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterGuest, setFilterGuest] = useState<string | null>(null)

  useEffect(() => {
    const loadPhotos = async () => {
      const { data, error } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false })

      if (error) console.error('Error loading photos:', error)
      if (data) setPhotos(data as Photo[])
      setLoading(false)
    }

    loadPhotos()
  }, [])

  const handleScanGoogleDrive = async () => {
    setScanning(true)
    try {
      const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app'
      const res = await fetch(`${BACKEND_URL}/api/scan-drive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error('Failed to scan Google Drive')

      const data = await res.json()
      toast.success(`✅ Scanned and indexed ${data.processed || 0} photos from Google Drive`)

      // Reload photos after scan
      const { data: photoData } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false })
      if (photoData) setPhotos(photoData as Photo[])
    } catch (error) {
      console.error('Scan error:', error)
      toast.error('Failed to scan Google Drive. Make sure backend is deployed.')
    } finally {
      setScanning(false)
    }
  }

  const handleTagPhoto = async (photoId: string, guestId: string | null) => {
    if (!guestId) return

    const currentTags = photos.find((p) => p.id === photoId)?.guest_tags || []
    const newTags = currentTags.includes(guestId)
      ? currentTags.filter((t) => t !== guestId)
      : [...currentTags, guestId]

    const { error } = await supabase
      .from('photos')
      .update({ guest_tags: newTags })
      .eq('id', photoId)

    if (error) {
      toast.error('Failed to tag photo')
    } else {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, guest_tags: newTags } : p))
      )
      toast.success('Guest tagged')
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return

    const { error } = await supabase.from('photos').delete().eq('id', photoId)

    if (error) {
      toast.error('Failed to delete photo')
    } else {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
      toast.success('Photo deleted')
    }
  }

  const displayPhotos = filterGuest
    ? photos.filter((p) => p.guest_tags.includes(filterGuest))
    : photos

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-8 h-8 text-rose-gold" />
            Photo Gallery
          </h1>
          <p className="text-gray-600 text-sm mt-2">Wedding photos from Google Drive with guest tagging</p>
        </div>
        <button
          onClick={handleScanGoogleDrive}
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning Google Drive...' : 'Sync Google Drive Photos'}
        </button>
      </div>

      {/* Photos Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📸 <strong>Total Photos:</strong> {photos.length} photos indexed from Google Drive
        </p>
        <p className="text-xs text-blue-600 mt-2">
          Click "Sync Google Drive Photos" to scan and index wedding photos from your Google Drive folder.
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Guest</label>
        <select
          value={filterGuest || ''}
          onChange={(e) => setFilterGuest(e.target.value || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Photos ({photos.length})</option>
          {guests.map((g) => {
            const count = photos.filter((p) => p.guest_tags.includes(g.id)).length
            return (
              <option key={g.id} value={g.id}>
                {g.name} ({count})
              </option>
            )
          })}
        </select>
      </div>

      {/* Photos Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {filterGuest ? `${guests.find((g) => g.id === filterGuest)?.name}'s Photos` : 'All Photos'}
        </h2>
        {displayPhotos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No photos yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPhotos.map((photo) => (
              <div key={photo.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Photo */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                  <img
                    src={photo.url}
                    alt="Wedding photo"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />

                  {/* Date Badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {new Date(photo.uploaded_at).toLocaleDateString()}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 left-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Guest Tags & Actions */}
                <div className="p-4 space-y-3">
                  {/* Current Tags */}
                  {photo.guest_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {photo.guest_tags.map((tagId) => {
                        const guest = guests.find((g) => g.id === tagId)
                        return guest ? (
                          <span
                            key={tagId}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {guest.name}
                            <button
                              onClick={() => handleTagPhoto(photo.id, tagId)}
                              className="hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null
                      })}
                    </div>
                  )}

                  {/* Tag Guest Dropdown */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const guestId = e.target.value
                      if (guestId) {
                        handleTagPhoto(photo.id, guestId)
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tag a guest...</option>
                    {guests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>

                  {/* Download & Share */}
                  <div className="flex gap-2">
                    <a
                      href={photo.url}
                      download
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <a
                      href={`https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 rounded text-green-700 text-sm transition-colors"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
