import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Upload, Download, Trash2, Share2, Filter } from 'lucide-react'
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
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterGuest, setFilterGuest] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])

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

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'wedding_app')
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo')

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload`, {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (data.secure_url) {
          const { data: photoData, error } = await supabase
            .from('photos')
            .insert([{ url: data.secure_url, guest_tags: [] }])
            .select()

          if (error) {
            console.error('Error saving photo:', error)
          } else if (photoData) {
            setPhotos((prev) => [photoData[0] as Photo, ...prev])
            toast.success(`${file.name} uploaded successfully`)
          }
        }
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
  }

  const handleTagPhoto = async () => {
    if (!selectedPhoto || selectedGuests.length === 0) return

    const { error } = await supabase
      .from('photos')
      .update({ guest_tags: selectedGuests })
      .eq('id', selectedPhoto)

    if (error) {
      toast.error('Failed to tag photo')
      console.error(error)
    } else {
      setPhotos((prev) =>
        prev.map((p) => (p.id === selectedPhoto ? { ...p, guest_tags: selectedGuests } : p))
      )
      setSelectedPhoto(null)
      setSelectedGuests([])
      toast.success('Photo tagged successfully')
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return

    const { error } = await supabase.from('photos').delete().eq('id', photoId)

    if (error) {
      toast.error('Failed to delete photo')
      console.error(error)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Photo Gallery</h1>
        <p className="text-gray-600 text-sm mt-1">Upload, tag, and share wedding photos</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-800 font-semibold">{uploading ? 'Uploading...' : 'Drag photos here or click to upload'}</p>
            <p className="text-gray-600 text-sm mt-1">JPG, PNG up to 10MB each</p>
          </div>
        </label>
      </div>

      {/* Filter & Tag Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Guest</label>
          <select
            value={filterGuest || ''}
            onChange={(e) => setFilterGuest(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">All Photos</option>
            {guests.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {selectedPhoto && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tag Guests</label>
            <div className="space-y-2">
              <select
                multiple
                value={selectedGuests}
                onChange={(e) => setSelectedGuests(Array.from(e.target.selectedOptions, (o) => o.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                size={5}
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-600">Hold Ctrl/Cmd to select multiple guests</p>
              <button
                onClick={handleTagPhoto}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Tags
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">{filterGuest ? `Photos of ${guests.find((g) => g.id === filterGuest)?.name}` : 'All Photos'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayPhotos.map((photo) => (
            <div key={photo.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img
                src={photo.url}
                alt="Wedding photo"
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              />

              {/* Guest Tags Overlay */}
              {photo.guest_tags.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="flex flex-wrap gap-1">
                    {photo.guest_tags.slice(0, 2).map((tagId) => {
                      const guest = guests.find((g) => g.id === tagId)
                      return guest ? (
                        <span
                          key={tagId}
                          className="text-xs bg-white text-gray-800 px-2 py-1 rounded-full font-medium"
                        >
                          {guest.name}
                        </span>
                      ) : null
                    })}
                    {photo.guest_tags.length > 2 && (
                      <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full font-medium">
                        +{photo.guest_tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    setSelectedPhoto(photo.id)
                    setSelectedGuests(photo.guest_tags)
                  }}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Tag photo"
                >
                  <Filter className="w-5 h-5 text-gray-800" />
                </button>
                <a
                  href={photo.url}
                  download
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-800" />
                </a>
                <a
                  href={`https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(photo.url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-5 h-5 text-gray-800" />
                </a>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Upload Date */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {new Date(photo.uploaded_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {displayPhotos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No photos found</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">📸 Photo Management Tips</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Upload photos in bulk by selecting multiple files</li>
          <li>Click a photo to tag guests — they'll appear in filtered view</li>
          <li>Share photos instantly on WhatsApp with the share button</li>
          <li>Download original quality photos anytime</li>
        </ul>
      </div>
    </div>
  )
}
