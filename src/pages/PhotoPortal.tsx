import { useState, useRef, useEffect } from 'react'
import { Camera, Download, Heart, Share2, Phone, User, AlertCircle, CheckCircle2, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'

const BACKEND_URL = 'https://wedding-gallery-backend-with-ai-photo-matching-production.up.railway.app'

interface GuestInfo {
  name: string
  phone: string
  email: string
}

interface MatchedPhoto {
  id: string
  url: string
  similarity_score: number
  uploaded_at: string
}

export default function PhotoPortal() {
  const [step, setStep] = useState<'info' | 'selfie' | 'results'>('info')
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ name: '', phone: '', email: '' })
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [matchedPhotos, setMatchedPhotos] = useState<MatchedPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useCamera, setUseCamera] = useState(false)

  useEffect(() => {
    if (useCamera && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch(err => toast.error('Camera access denied: ' + err.message))
    }
  }, [useCamera])

  const handleGuestInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestInfo.name.trim() || !guestInfo.phone.trim()) {
      toast.error('Please fill in name and phone number')
      return
    }
    setStep('selfie')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelfieFile(file)
      setSelfiePreview(URL.createObjectURL(file))
      setUseCamera(false)
    }
  }

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        canvasRef.current.toBlob(blob => {
          if (blob) {
            setSelfieFile(new File([blob], 'selfie.jpg', { type: 'image/jpeg' }))
            setSelfiePreview(canvasRef.current!.toDataURL())
            setUseCamera(false)
          }
        }, 'image/jpeg')
      }
    }
  }

  const logGuestInteraction = async (photosViewedCount: number = 0) => {
    try {
      const { error } = await supabase.from('guest_interactions').insert({
        guest_name: guestInfo.name,
        phone: guestInfo.phone,
        email: guestInfo.email,
        visited_at: new Date().toISOString(),
        photos_viewed: photosViewedCount,
        favorites_count: favorites.size
      })
      if (error) console.error('Error logging interaction:', error)
    } catch (err) {
      console.error('Failed to log guest interaction:', err)
    }
  }

  const handleFindPhotos = async () => {
    if (!selfieFile) {
      toast.error('Please select or capture a selfie')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('selfie', selfieFile)
      formData.append('name', guestInfo.name)
      formData.append('phone', guestInfo.phone)
      formData.append('email', guestInfo.email)

      const response = await fetch(`${BACKEND_URL}/api/find-my-photos`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to find photos')
      }

      const data = await response.json()
      const photoCount = data.photos?.length || 0
      setMatchedPhotos(data.photos || [])
      setStep('results')

      // Log the guest interaction
      await logGuestInteraction(photoCount)

      if (!data.photos || data.photos.length === 0) {
        toast.info('No matching photos found. Try adjusting lighting or angle.')
      } else {
        toast.success(`Found ${data.photos.length} photos of you! 🎉`)
      }
    } catch (error) {
      console.error('Error finding photos:', error)
      toast.error('Failed to process your selfie. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (photoId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId)
    } else {
      newFavorites.add(photoId)
    }
    setFavorites(newFavorites)

    // Update interaction record with new favorites count
    try {
      await supabase
        .from('guest_interactions')
        .update({ favorites_count: newFavorites.size })
        .eq('phone', guestInfo.phone)
        .order('visited_at', { ascending: false })
        .limit(1)
    } catch (err) {
      console.error('Failed to update favorites count:', err)
    }
  }

  const downloadPhoto = (url: string, photoId: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `wedding-photo-${photoId}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Photo downloaded! 📸')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">💍 Find Your Photos</h1>
          <p className="text-pink-100">Upload your face to discover all your wedding photos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step 1: Guest Info */}
        {step === 'info' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tell Us About You</h2>
            </div>

            <form onSubmit={handleGuestInfoSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all mt-6"
              >
                Continue to Photo Matching →
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Your information helps us send you your photos and create your guest profile.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Selfie Capture */}
        {step === 'selfie' && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Your Selfie</h2>
            </div>

            {!selfiePreview ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setUseCamera(!useCamera)}
                    className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                      useCamera
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                    {useCamera ? 'Camera Active' : 'Use Camera'}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center justify-center gap-2"
                  >
                    📁 Upload File
                  </button>
                </div>

                {useCamera ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black aspect-square object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" width={640} height={640} />
                    <button
                      onClick={captureSelfie}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                    >
                      📸 Capture Selfie
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition"
                  >
                    <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-500 mt-1">JPG or PNG, up to 10MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <img src={selfiePreview} alt="Your selfie" className="w-full rounded-lg" />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelfiePreview(null)
                      setSelfieFile(null)
                    }}
                    className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    ↺ Retake
                  </button>
                  <button
                    onClick={handleFindPhotos}
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Finding photos...
                      </>
                    ) : (
                      '✨ Find My Photos'
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Use a clear, front-facing photo in good lighting for best results.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Your Photos</h2>
              </div>

              {matchedPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No matching photos found</p>
                  <p className="text-sm text-gray-500 mt-1">Try a different photo with better lighting</p>
                  <button
                    onClick={() => {
                      setStep('selfie')
                      setSelfiePreview(null)
                      setSelfieFile(null)
                    }}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    Found <strong>{matchedPhotos.length} photos</strong> matching you!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {matchedPhotos.map(photo => (
                      <div
                        key={photo.id}
                        className="bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition"
                      >
                        <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                          <img
                            src={photo.url}
                            alt="Matched photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />

                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {Math.round(photo.similarity_score * 100)}% match
                          </div>

                          <button
                            onClick={() => toggleFavorite(photo.id)}
                            className={`absolute top-2 left-2 p-2 rounded-full transition ${
                              favorites.has(photo.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-red-100'
                            }`}
                          >
                            <Heart className="w-5 h-5" fill={favorites.has(photo.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <div className="p-4 space-y-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadPhoto(photo.url, photo.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <a
                              href={`https://wa.me/?text=Check%20out%20this%20wedding%20photo%20${encodeURIComponent(
                                photo.url
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 transition text-sm font-medium"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </a>
                          </div>

                          <p className="text-xs text-gray-500 text-center">
                            {new Date(photo.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setStep('selfie')
                        setSelfiePreview(null)
                        setSelfieFile(null)
                      }}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                      Find More Photos
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
