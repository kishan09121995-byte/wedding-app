import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useGuestStore } from '../store/guestStore'
import { CheckCircle2, LogIn, LogOut, Printer, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import '../styles/roomTags.css'

interface Arrival {
  id: string
  guest_id: string
  guest_name: string
  check_in_time?: string
  check_out_time?: string
  status: 'Not Arrived' | 'Checked In' | 'Checked Out'
  notes: string
}

export default function ArrivalsSheet() {
  const guests = useGuestStore((state) => state.guests)
  const [arrivals, setArrivals] = useState<Arrival[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterSide, setFilterSide] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'tags'>('list')

  useEffect(() => {
    loadArrivals()
  }, [])

  const loadArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from('arrivals')
        .select('*')
        .order('guest_name')

      if (error) throw error
      setArrivals(data || [])
    } catch (error) {
      console.error('Error loading arrivals:', error)
      toast.error('Failed to load arrivals')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (guestId: string, guestName: string) => {
    try {
      const { error } = await supabase
        .from('arrivals')
        .upsert(
          {
            guest_id: guestId,
            guest_name: guestName,
            check_in_time: new Date().toISOString(),
            status: 'Checked In'
          },
          { onConflict: 'guest_id' }
        )

      if (error) throw error
      loadArrivals()
      toast.success(`✅ ${guestName} checked in`)
    } catch (error) {
      console.error('Error checking in:', error)
      toast.error('Failed to check in')
    }
  }

  const handleCheckOut = async (guestId: string, guestName: string) => {
    try {
      const { error } = await supabase
        .from('arrivals')
        .upsert(
          {
            guest_id: guestId,
            guest_name: guestName,
            check_out_time: new Date().toISOString(),
            status: 'Checked Out'
          },
          { onConflict: 'guest_id' }
        )

      if (error) throw error
      loadArrivals()
      toast.success(`✅ ${guestName} checked out`)
    } catch (error) {
      console.error('Error checking out:', error)
      toast.error('Failed to check out')
    }
  }

  const filteredGuests = guests
    .filter(g => {
      const arrival = arrivals.find(a => a.guest_id === g.id)
      const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !filterStatus || arrival?.status === filterStatus
      const matchesSide = !filterSide || g.side === filterSide
      return matchesSearch && matchesStatus && matchesSide
    })
    .sort((a, b) => {
      if (a.hotel_id !== b.hotel_id) return (a.hotel_id || '').localeCompare(b.hotel_id || '')
      return a.name.localeCompare(b.name)
    })

  const groupedByHotelAndSide = filteredGuests.reduce((acc, guest) => {
    const hotelId = guest.hotel_id || 'No Hotel'
    const side = guest.side || 'Unknown'
    const key = `${hotelId}|${side}`
    if (!acc[key]) acc[key] = { hotel: hotelId, side, guests: [] }
    acc[key].guests.push(guest)
    return acc
  }, {} as Record<string, { hotel: string; side: string; guests: typeof filteredGuests }>)

  const stats = {
    total: guests.length,
    checkedIn: arrivals.filter(a => a.status === 'Checked In').length,
    checkedOut: arrivals.filter(a => a.status === 'Checked Out').length,
    notArrived: guests.length - arrivals.filter(a => a.status !== 'Not Arrived').length
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><p>Loading arrivals...</p></div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <LogIn className="w-8 h-8 text-rose-gold" />
              Guest Arrivals & Check-in
            </h1>
            <p className="text-gray-600 mt-2">Organized by Hotel & Side with Room Tags</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Printer className="w-4 h-4" />
            Print Tags
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Guests</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
          <p className="text-green-700 text-sm font-medium">Checked In</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{stats.checkedIn}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-blue-200">
          <p className="text-blue-700 text-sm font-medium">Checked Out</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{stats.checkedOut}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 shadow-sm border border-yellow-200">
          <p className="text-yellow-700 text-sm font-medium">Not Arrived</p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.notArrived}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guest name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
            />
          </div>
          <select
            value={filterSide || ''}
            onChange={(e) => setFilterSide(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
          >
            <option value="">All Sides</option>
            <option value="Bride">Bride Side</option>
            <option value="Groom">Groom Side</option>
          </select>
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
          >
            <option value="">All Status</option>
            <option value="Not Arrived">Not Arrived</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('tags')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'tags'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Room Tags
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {Object.entries(groupedByHotelAndSide).map(([key, { hotel, side, guests: sideGuests }]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {hotel} • {side} Side ({sideGuests.length} guests)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Room #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Pax</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-in Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sideGuests.map(guest => {
                      const arrival = arrivals.find(a => a.guest_id === guest.id)
                      const statusColor = {
                        'Checked In': 'bg-green-100 text-green-800',
                        'Checked Out': 'bg-blue-100 text-blue-800',
                        'Not Arrived': 'bg-yellow-100 text-yellow-800'
                      }
                      return (
                        <tr key={guest.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{guest.name}</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">{guest.room_number || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{guest.pax_total}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[arrival?.status as keyof typeof statusColor] || 'bg-gray-100 text-gray-800'}`}>
                              {arrival?.status || 'Not Arrived'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {arrival?.check_in_time ? new Date(arrival.check_in_time).toLocaleTimeString() : '-'}
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button
                              onClick={() => handleCheckIn(guest.id, guest.name)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                            >
                              In
                            </button>
                            <button
                              onClick={() => handleCheckOut(guest.id, guest.name)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                            >
                              Out
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Tags View (Print-friendly A6 Cards on A4) */}
      {viewMode === 'tags' && (
        <div className="room-tags-outer-container">
          {Object.entries(groupedByHotelAndSide).map(([key, { hotel, side, guests: sideGuests }]) => (
            <div key={key}>
              <h3 className="room-tags-section-header">
                {hotel} • {side} Side ({sideGuests.length} guests)
              </h3>
              <div className="room-tags-container">
                {sideGuests.map(guest => {
                  const arrival = arrivals.find(a => a.guest_id === guest.id)
                  const sideClass = side === 'Bride' ? 'bride-side' : 'groom-side'
                  const sideBadgeClass = side === 'Bride' ? 'bride' : 'groom'
                  const roomNumberValue = guest.room_number

                  return (
                    <div key={guest.id} className="room-tag-wrapper">
                      <div className={`room-tag ${sideClass}`}>
                        {/* Header */}
                        <div className="room-tag-header">
                          Welcome to Kishan & Megha's Wedding
                        </div>

                        {/* Guest Name */}
                        <div className="room-tag-name">
                          {guest.name}
                        </div>

                        {/* Divider */}
                        <div className="room-tag-divider" />

                        {/* Room Number - Large and Prominent */}
                        {roomNumberValue ? (
                          <div className="room-tag-number">
                            #{roomNumberValue}
                          </div>
                        ) : (
                          <div className="room-tag-number empty">
                            ______
                          </div>
                        )}

                        {/* Side Badge */}
                        <div className={`room-tag-side ${sideBadgeClass}`}>
                          {side === 'Bride' ? "Bride's Side" : "Groom's Side"}
                        </div>

                        {/* Details: Pax and Status */}
                        <div className="room-tag-details">
                          <div className="room-tag-pax">
                            {guest.pax_total} {guest.pax_total === 1 ? 'Guest' : 'Guests'}
                          </div>
                          {arrival && (
                            <div className="room-tag-status">
                              {arrival.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Print Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg print:hidden">
            <p className="text-sm text-blue-800 font-semibold">🖨️ Print Instructions:</p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>Ensure printer is set to <strong>A4 paper</strong></li>
              <li>Set margins to <strong>10mm</strong> on all sides</li>
              <li>Enable <strong>"Background graphics"</strong> to print color tints</li>
              <li>Use a guillotine cutter or sharp scissors along the 2mm double borders</li>
              <li>Each card is exactly 105mm × 148mm (A6 size) — 4 cards per A4 sheet</li>
              <li>Handwrite missing room numbers on the ______ line if needed</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
