import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useRole } from '../hooks/useRole'
import GlobalChat from '../components/GlobalChat'
import '../styles/sidebar.css'
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Building2,
  Hotel,
  DollarSign,
  Calendar,
  Image,
  Share2,
  Menu,
  X,
  LogOut,
  Heart,
  Store,
  Shield,
  UserCog,
  FileText,
  CheckSquare,
  MapPin,
  Palette,
  MessageSquare,
  Bell,
} from 'lucide-react'
import Dashboard from '../pages/Dashboard'
import MasterRSVP from '../pages/MasterRSVP'
import PlateCount from '../pages/PlateCount'
import HotelSettings from '../pages/HotelSettings'
import RoomBooking from '../pages/RoomBooking'
import HotelBilling from '../pages/HotelBilling'
import Budget from '../pages/Budget'
import Timeline from '../pages/Timeline'
import PhotoGallery from '../pages/PhotoGallery'
import SocialHub from '../pages/SocialHub'
import VendorTracker from '../pages/VendorTracker'
import MenuManagement from '../pages/MenuManagement'
import AdminPanel from '../pages/AdminPanel'
import UserManagement from '../pages/UserManagement'
import Assignments from '../pages/Assignments'
import GuestArrivals from '../pages/GuestArrivals'
import EventDetails from '../pages/EventDetails'
import InternalChat from '../pages/InternalChat'
import Notifications from '../pages/Notifications'
import TeamChat from '../pages/TeamChat'
import ArrivalsSheet from '../pages/ArrivalsSheet'
import DecorGallery from '../pages/DecorGallery'

type Page = 'dashboard' | 'rsvp' | 'plate-count' | 'hotel-settings' | 'room-booking' | 'hotel-billing' | 'budget' | 'timeline' | 'photos' | 'social' | 'vendors' | 'menu' | 'admin' | 'users' | 'assignments' | 'arrivals' | 'event-details' | 'chat' | 'notifications' | 'team-chat' | 'arrivals-sheet' | 'decor-gallery'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vendors', label: 'Vendors', icon: Store, section: 'main' },
  { id: 'rsvp', label: 'Master RSVP', icon: Users },
  { id: 'plate-count', label: 'Plate Count', icon: UtensilsCrossed },
  { id: 'menu', label: 'Menu Management', icon: FileText },
  { id: 'hotel-settings', label: 'Hotel Settings', icon: Building2 },
  { id: 'room-booking', label: 'Room Booking', icon: Hotel },
  { id: 'hotel-billing', label: 'Hotel Billing', icon: DollarSign, restricted: true },
  { id: 'budget', label: 'Budget', icon: DollarSign, restricted: true },
  { id: 'assignments', label: 'Task Assignments', icon: CheckSquare },
  { id: 'team-chat', label: 'Team Chat', icon: MessageSquare },
  { id: 'arrivals-sheet', label: 'Guest Arrivals', icon: MapPin },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'decor-gallery', label: 'Décor Gallery', icon: Palette },
  { id: 'photos', label: 'Photo Gallery', icon: Image },
  { id: 'social', label: 'Social Hub', icon: Share2 },
  { id: 'users', label: 'Users', icon: UserCog },
  { id: 'admin', label: 'Admin', icon: Shield },
]

export default function MainLayout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, setUser } = useAuthStore()
  const { role } = useRole()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const canViewBilling = ['admin', 'bride_admin', 'groom_admin', 'vendor_admin', 'coordinator'].includes(role || '')

  const renderPage = () => {
    // Check access for restricted pages
    if ((currentPage === 'hotel-billing' || currentPage === 'budget') && !canViewBilling) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 mb-2">Access Denied</p>
            <p className="text-gray-600">Only admins and coordinators can view billing information</p>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'rsvp':
        return <MasterRSVP />
      case 'plate-count':
        return <PlateCount />
      case 'menu':
        return <MenuManagement />
      case 'hotel-settings':
        return <HotelSettings />
      case 'room-booking':
        return <RoomBooking />
      case 'hotel-billing':
        return <HotelBilling />
      case 'budget':
        return <Budget />
      case 'assignments':
        return <Assignments />
      case 'arrivals':
        return <GuestArrivals />
      case 'arrivals-sheet':
        return <ArrivalsSheet />
      case 'event-details':
        return <EventDetails />
      case 'chat':
        return <InternalChat />
      case 'team-chat':
        return <TeamChat />
      case 'notifications':
        return <Notifications />
      case 'timeline':
        return <Timeline />
      case 'photos':
        return <PhotoGallery />
      case 'decor-gallery':
        return <DecorGallery />
      case 'social':
        return <SocialHub />
      case 'vendors':
        return <VendorTracker />
      case 'users':
        return <UserManagement />
      case 'admin':
        return <AdminPanel />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-mauve text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-mauve/50">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-6 h-6 fill-rose-gold text-rose-gold" />
            <h1 className="text-xl font-bold">Kishan & Megha</h1>
          </div>
          <p className="text-xs text-mauve/70">June 21–22, 2026</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems
            .filter(item => {
              if (!item.restricted) return true
              return canViewBilling
            })
            .map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as Page)
                    if (window.innerWidth < 768) setSidebarOpen(false)
                  }}
                  className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="menu-icon" />
                  <span className="menu-label">{item.label}</span>
                </button>
              )
            })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-mauve/50 space-y-2">
          <p className="text-xs text-mauve/70 px-4">Logged in as:</p>
          <p className="text-xs text-mauve/90 px-4 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-mauve/50 text-sm transition text-mauve/90"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <h2 className="text-2xl font-bold text-gray-800">
            {navItems.find((item) => item.id === currentPage)?.label}
          </h2>

          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderPage()}</div>
        </div>
      </div>

      {/* Global Chat */}
      <GlobalChat />
    </div>
  )
}
