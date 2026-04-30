import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import { useGuestStore } from './store/guestStore'
import Auth from './pages/Auth'
import MainLayout from './layouts/MainLayout'
import RSVPPortal from './pages/RSVPPortal'
import PhotoPortal from './pages/PhotoPortal'
import RegisterBride from './pages/RegisterBride'
import RegisterGroom from './pages/RegisterGroom'
import QRPhotoRegistration from './pages/QRPhotoRegistration'
import PasswordReset from './pages/PasswordReset'
import AdminPanel from './pages/AdminPanel'
import SetupWizard from './pages/SetupWizard'
import SetupRSVP from './pages/SetupRSVP'
import { Loader } from 'lucide-react'

function AppContent() {
  const { user, loading, setUser, setLoading } = useAuthStore()
  const { setGuests } = useGuestStore()
  const [appReady, setAppReady] = useState(false)
  const location = useLocation()
  const isRsvpPage = location.pathname.startsWith('/rsvp/')

  useEffect(() => {
    // Check session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [setUser, setLoading])

  useEffect(() => {
    // Load guests when user is authenticated or if on RSVP page
    if ((user || isRsvpPage) && !loading) {
      loadGuests()
    } else if (!user && !loading && !isRsvpPage) {
      setAppReady(true)
    }
  }, [user, loading, isRsvpPage])

  const loadGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name')
      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error loading guests:', error)
    } finally {
      setAppReady(true)
    }
  }

  // Allow RSVP page even without authentication
  if (isRsvpPage) {
    return <RSVPPortal />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="text-center">
          <Loader className="w-8 h-8 text-rose-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading wedding app...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  if (!appReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="text-center">
          <Loader className="w-8 h-8 text-rose-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Setting up your wedding app...</p>
        </div>
      </div>
    )
  }

  return <MainLayout />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rsvp/:token" element={<RSVPPortal />} />
        <Route path="/photo-portal" element={<PhotoPortal />} />
        <Route path="/register/bride" element={<RegisterBride />} />
        <Route path="/register/groom" element={<RegisterGroom />} />
        <Route path="/qr-photos" element={<QRPhotoRegistration />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/setup" element={<SetupWizard />} />
        <Route path="/setup-rsvp" element={<SetupRSVP />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
