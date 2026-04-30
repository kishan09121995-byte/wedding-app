import { useState, useRef } from 'react'
import { Search, Download, Phone, User, AlertCircle, CheckCircle2, Upload, Camera } from 'lucide-react'
import { toast } from 'sonner'

interface PhotoMatch {
  cloudinary_url: string
  ai_tags: string
}

const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app'

export default function QRPhotoRegistration() {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchedPhotos, setSearchedPhotos] = useState<PhotoMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [showRegisterMode, setShowRegisterMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async () => {
    if (!name.trim()) {
      toast.error('Enter your name')
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/photos/${encodeURIComponent(name.trim())}`)

      if (!response.ok) {
        throw new Error('Failed to fetch photos')
      }

      const data = await response.json()
      setSearchedPhotos(data.photos || [])

      if (!data.photos || data.photos.length === 0) {
        toast.info(`No photos found for "${name}". Try registering your face first!`)
      } else {
        toast.success(`Found ${data.photos.length} photos`)
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search photos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterFace = async (file: File) => {
    if (!name.trim()) {
      toast.error('Please enter your name first')
      return
    }

    setRegistering(true)

    try {
      const formData = new FormData()
      formData.append('selfie', file)
      formData.append('userId', name.trim())

      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to register face')
      }

      toast.success('✅ Face registered! You can now search for your photos.')
      setShowRegisterMode(false)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to register face. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleRegisterFace(file)
    }
  }

  const handleDownload = (photoUrl: string) => {
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = `wedding-photo-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Photo downloaded!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📷 Find Your Photos</h1>
          <p className="text-gray-600">Find and download your wedding photos from Google Drive</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowRegisterMode(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              !showRegisterMode
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Find My Photos
          </button>
          <button
            onClick={() => setShowRegisterMode(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              showRegisterMode
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Register Your Face
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {!showRegisterMode ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Search for Your Photos</h2>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Searching...' : 'Find My Photos'}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Your wedding photos are stored in Google Drive and tagged by guest name. Register your face first to enable photo matching!
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Register Your Face</h2>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>

                {/* Face Photo Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Camera className="w-4 h-4" />
                    Upload a Clear Face Photo
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={registering}
                    className="w-full px-4 py-8 border-2 border-dashed border-rose-300 rounded-lg hover:border-rose-500 transition flex flex-col items-center gap-2 text-gray-600 disabled:opacity-50"
                  >
                    <Upload className="w-8 h-8 text-rose-500" />
                    <span className="font-medium">Click to upload or drag & drop</span>
                    <span className="text-xs">PNG, JPG up to 10MB</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Register Button */}
                <button
                  disabled={!name.trim() || registering}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {registering ? 'Registering...' : 'Register Face'}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Upload a clear, front-facing photo. We'll use face recognition to match and find all your tagged photos from Google Drive!
                </p>
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-4">
            {searchedPhotos.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No photos found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Make sure you've registered your face first, then try searching again.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Your Photos ({searchedPhotos.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchedPhotos.map((photo, idx) => (
                    <div key={idx} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                      {/* Photo Preview */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                        <img
                          src={photo.cloudinary_url}
                          alt="Wedding photo"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300?text=Photo+Not+Found'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Hover to download</span>
                        </div>
                      </div>

                      {/* Photo Info */}
                      <div className="p-3 space-y-2">
                        {photo.ai_tags && (
                          <p className="text-xs text-gray-500">
                            <span className="font-semibold">Tags:</span> {photo.ai_tags}
                          </p>
                        )}
                        <button
                          onClick={() => handleDownload(photo.cloudinary_url)}
                          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
