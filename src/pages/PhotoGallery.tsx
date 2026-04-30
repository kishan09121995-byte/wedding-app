import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Download, Trash2, Image, RefreshCw, X, Share2, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

interface Photo {
  id: string
  url: string
  uploaded_at: string
  guest_tags: string[]
}

interface GuestInteraction {
  guest_name: string
  phone: string
  email: string
  visited_at: string
  photos_viewed: number
  favorites_count: number
}

export default function PhotoGallery() {
  const guests = useGuestStore((state) => state.guests)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterGuest, setFilterGuest] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'gallery' | 'dashboard'>('gallery')
  const [interactions, setInteractions] = useState<GuestInteraction[]>([])

  useEffect(() => {
    const loadPhotos = async () => {
      const { data, error } = await supabase.from('photos').select('*').order('uploaded_at', { ascending: false })

      if (error) console.error('Error loading photos:', error)
      if (data) setPhotos(data as Photo[])
      setLoading(false)
    }

    const loadInteractions = async () => {
      const { data, error } = await supabase
        .from('guest_interactions')
        .select('*')
        .order('visited_at', { ascending: false })

      if (error) console.error('Error loading interactions:', error)
      if (data) setInteractions(data as GuestInteraction[])
    }

    loadPhotos()
    loadInteractions()
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

  const totalGuestVisits = interactions.length
  const uniqueGuests = new Set(interactions.map(i => i.phone)).size
  const avgPhotosPerGuest = totalGuestVisits > 0 ? Math.round(interactions.reduce((sum, i) => sum + i.photos_viewed, 0) / uniqueGuests) : 0
  const totalFavorites = interactions.reduce((sum, i) => sum + i.favorites_count, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="w-8 h-8 text-rose-gold" />
            Photo Gallery
          </h1>
          <p className="text-gray-600 text-sm mt-2">Wedding photos with guest management & analytics</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
            activeTab === 'gallery'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Image className="w-4 h-4" />
          Gallery
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Creator Dashboard
        </button>
      </div>

      {/* Gallery View */}
      {activeTab === 'gallery' && (
        <>
          <div className="flex gap-3">
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
        </>
      )}

      {/* Dashboard View */}
      {activeTab === 'dashboard' && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Guest Visits</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalGuestVisits}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unique Guests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueGuests}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg Photos/Guest</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{avgPhotosPerGuest}</p>
                </div>
                <Image className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Favorites</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalFavorites}</p>
                </div>
                <Share2 className="w-8 h-8 text-red-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* CRM View - Guest Interactions */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guest Interactions & CRM
              </h2>
            </div>
            {interactions.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No guest interactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Photos Viewed</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Favorites</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {interactions.map((interaction, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{interaction.guest_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{interaction.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{interaction.email || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{interaction.photos_viewed}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold text-red-600">❤️ {interaction.favorites_count}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(interaction.visited_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Export Option */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-900">📊 Export Guest Data</p>
                <p className="text-sm text-green-700 mt-1">Download all guest interactions and engagement metrics for CRM or analysis</p>
              </div>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
                Export to Excel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Filter Section - Gallery View Only */}
      {activeTab === 'gallery' && (
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
      )}

      {/* Photos Grid - Gallery View Only */}
      {activeTab === 'gallery' && (
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
      )}
    </div>
  )
}
