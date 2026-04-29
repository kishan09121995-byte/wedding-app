import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Upload, Download, Trash2, Share2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode.react'

interface Photo {
  id: string
  url: string
  uploaded_at: string
  guest_tags: string[]
}

export default function PhotoGallery() {
  const guests = useGuestStore((state) => state.guests)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedGuests, setSelectedGuests] = useState<{ [key: string]: string | null }>({})
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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return
    setUploading(true)

    const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app'

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('photo', file)

      try {
        const res = await fetch(`${BACKEND_URL}/api/upload-photo`, {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (data.downloadUrl) {
          const { data: photoData, error } = await supabase
            .from('photos')
            .insert([{ url: data.downloadUrl, guest_tags: [] }])
            .select()

          if (error) {
            toast.error(`Failed to save ${file.name}`)
          } else if (photoData) {
            setPhotos((prev) => [photoData[0] as Photo, ...prev])
            toast.success(`${file.name} uploaded`)
          }
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
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

    setSelectedGuests((prev) => ({
      ...prev,
      [photoId]: null,
    }))
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-gray-600 text-sm mt-1">Upload and tag wedding photos with guests</p>
        </div>
      </div>

      {/* QR Code Registration Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Photos</h2>
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-700 font-medium text-sm">{uploading ? 'Uploading...' : 'Click or drag photos'}</p>
              <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 10MB</p>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-4">Total photos: {photos.length}</p>
        </div>

        {/* QR Code Registration Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Guest Registration</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-xs text-gray-600 mb-3">Scan to tag yourself in photos</p>
            <div className="flex justify-center">
              <QRCode
                value={`${window.location.origin}/gallery`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4">Guests can scan to be tagged in photos</p>
          </div>
        </div>
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
                    value={selectedGuests[photo.id] || ''}
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
