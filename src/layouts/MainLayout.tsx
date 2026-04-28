import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
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

type Page = 'dashboard' | 'rsvp' | 'plate-count' | 'hotel-settings' | 'room-booking' | 'hotel-billing' | 'budget' | 'timeline' | 'photos' | 'social' | 'vendors'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rsvp', label: 'Master RSVP', icon: Users },
  { id: 'plate-count', label: 'Plate Count', icon: UtensilsCrossed },
  { id: 'hotel-settings', label: 'Hotel Settings', icon: Building2 },
  { id: 'room-booking', label: 'Room Booking', icon: Hotel },
  { id: 'hotel-billing', label: 'Hotel Billing', icon: DollarSign },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'photos', label: 'Photos', icon: Image },
  { id: 'social', label: 'Social Hub', icon: Share2 },
  { id: 'vendors', label: 'Vendors', icon: Store },
]

export default function MainLayout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, setUser } = useAuthStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'rsvp':
        return <MasterRSVP />
      case 'plate-count':
        return <PlateCount />
      case 'hotel-settings':
        return <HotelSettings />
      case 'room-booking':
        return <RoomBooking />
      case 'hotel-billing':
        return <HotelBilling />
      case 'budget':
        return <Budget />
      case 'timeline':
        return <Timeline />
      case 'photos':
        return <PhotoGallery />
      case 'social':
        return <SocialHub />
      case 'vendors':
        return <VendorTracker />
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
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page)
                  if (window.innerWidth < 768) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition text-sm ${
                  isActive
                    ? 'bg-rose-gold text-white'
                    : 'hover:bg-mauve/50 text-mauve/90'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
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
    </div>
  )
}
