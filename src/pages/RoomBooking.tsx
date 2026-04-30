import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Save, Bed, MapPin, Users, Download } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface HotelSetting {
  id: string
  name: string
  rate_per_room_night: number
  contracted_rooms: number
  default_checkin: string
  default_checkout: string
}

interface GuestRoom {
  id: string
  name: string
  city: string
  pax_total: number
  side: string
  hotel_id: string | null
  room_category: string
  check_in: string
  check_out: string
  room_number: string
  f4: string
}

export default function RoomBooking() {
  const guests = useGuestStore((state) => state.guests)
  const [hotels, setHotels] = useState<HotelSetting[]>([])
  const [guestRooms, setGuestRooms] = useState<GuestRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filterHotel, setFilterHotel] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const [hotelsRes, guestsRes] = await Promise.all([
        supabase.from('hotel_settings').select('*'),
        supabase.from('guests').select('id,name,city,pax_total,side,hotel_id,room_category,check_in,check_out,room_number,f4').eq('room_needed', true),
      ])

      if (hotelsRes.data) setHotels(hotelsRes.data as HotelSetting[])
      if (guestsRes.data) setGuestRooms(guestsRes.data as GuestRoom[])
      setLoading(false)
    }

    loadData()
  }, [])

  const handleFieldChange = (guestId: string, field: keyof GuestRoom, value: any) => {
    setGuestRooms((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, [field]: value } : g))
    )
  }

  const handleSaveAll = async () => {
    setSaving(true)
    let errors = 0

    for (const guest of guestRooms) {
      const { error } = await supabase
        .from('guests')
        .update({
          hotel_id: guest.hotel_id,
          room_category: guest.room_category,
          check_in: guest.check_in,
          check_out: guest.check_out,
          room_number: guest.room_number,
        })
        .eq('id', guest.id)

      if (error) {
        console.error(`Error updating ${guest.name}:`, error)
        errors++
      }
    }

    setSaving(false)
    if (errors === 0) {
      toast.success('All room assignments saved!')
    } else {
      toast.error(`Failed to save ${errors} guests`)
    }
  }

  const handleReset = async () => {
    const [guestsRes] = await Promise.all([
      supabase.from('guests').select('id,name,city,pax_total,side,hotel_id,room_category,check_in,check_out,room_number,f4').eq('room_needed', true),
    ])

    if (guestsRes.data) setGuestRooms(guestsRes.data as GuestRoom[])
  }

  const handleExportPDF = async () => {
    const element = document.getElementById('room-booking-table')
    if (!element) {
      toast.error('Nothing to export')
      return
    }

    try {
      const canvas = await html2canvas(element)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 297 - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
      pdf.save('room-booking.pdf')
      toast.success('PDF exported!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  const hotelGrouped = new Map<string, GuestRoom[]>()
  guestRooms.forEach((guest) => {
    const hotelId = guest.hotel_id || 'unassigned'
    if (!hotelGrouped.has(hotelId)) hotelGrouped.set(hotelId, [])
    hotelGrouped.get(hotelId)!.push(guest)
  })

  const filteredHotels = filterHotel ? [filterHotel] : Array.from(hotelGrouped.keys())

  const roomsNeeded = (hotelId: string) => {
    const groupGuests = hotelGrouped.get(hotelId) || []
    return Math.ceil(groupGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0))
  }

  const breakfastCount = (hotelId: string) => {
    const groupGuests = hotelGrouped.get(hotelId) || []
    const leoHotels = ['LEO Resort', 'LEO Medium']
    const hotelName = hotels.find((h) => h.id === hotelId)?.name || ''
    return groupGuests.filter((g) => leoHotels.includes(hotelName) && g.f4 === 'Yes').length
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bed className="w-8 h-8 text-rose-gold" />
              Room Booking & Assignments
            </h1>
            <p className="text-gray-600 text-sm mt-2">Manage guest room assignments and check-in/out dates</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save All'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterHotel(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterHotel === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Hotels
        </button>
        {hotels.map((hotel) => (
          <button
            key={hotel.id}
            onClick={() => setFilterHotel(hotel.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterHotel === hotel.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {hotel.name}
          </button>
        ))}
      </div>

      {/* Hotels Sections */}
      <div className="space-y-8">
        {filteredHotels.map((hotelId) => {
          const hotel = hotels.find((h) => h.id === hotelId)
          const isUnassigned = hotelId === 'unassigned'
          const guests = hotelGrouped.get(hotelId) || []
          const rooms = roomsNeeded(hotelId)
          const breakfast = breakfastCount(hotelId)

          return (
            <div key={hotelId} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {isUnassigned ? 'Unassigned Guests' : hotel?.name}
                </h2>
                {!isUnassigned && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="text-lg font-semibold text-gray-800">{guests.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rooms Needed</p>
                      <p className="text-lg font-semibold text-blue-700">{rooms}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contracted</p>
                      <p className="text-lg font-semibold text-gray-800">{hotel?.contracted_rooms}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Breakfast Count</p>
                      <p className="text-lg font-semibold text-green-700">{breakfast}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Pax</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Hotel</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Check-in</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Check-out</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Room #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((guest) => (
                      <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{guest.name}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{guest.pax_total}</td>
                        <td className="px-4 py-3">
                          <select
                            value={guest.hotel_id || ''}
                            onChange={(e) => handleFieldChange(guest.id, 'hotel_id', e.target.value || null)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select Hotel</option>
                            {hotels.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={guest.room_category || 'Standard'}
                            onChange={(e) => handleFieldChange(guest.id, 'room_category', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={guest.check_in || ''}
                            onChange={(e) => handleFieldChange(guest.id, 'check_in', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={guest.check_out || ''}
                            onChange={(e) => handleFieldChange(guest.id, 'check_out', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={guest.room_number || ''}
                            onChange={(e) => handleFieldChange(guest.id, 'room_number', e.target.value)}
                            placeholder="e.g. 101"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
