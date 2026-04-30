import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useGuestStore } from '../store/guestStore'
import { Edit2, Save, X, MapPin, Users, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface HotelSetting {
  id: string
  name: string
  category: string
  breakfast_type: string
  default_checkin: string
  default_checkout: string
  rate_per_room_night: number
  contracted_rooms: number
  rooms_assigned?: number
  location?: string
}

export default function HotelSettings() {
  const guests = useGuestStore((state) => state.guests)
  const [hotels, setHotels] = useState<HotelSetting[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<HotelSetting>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoAssigning, setAutoAssigning] = useState(false)

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_settings')
        .select('*')
        .order('name')
      if (error) throw error
      setHotels((data as HotelSetting[]) || [])
    } catch (error) {
      console.error('Error loading hotels:', error)
      toast.error('Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  const handleAutoAssign = async () => {
    if (hotels.length === 0) {
      toast.error('No hotels configured')
      return
    }

    setAutoAssigning(true)
    try {
      const guestsNeedingRooms = guests.filter(g => g.room_needed && g.rsvp_status === 'Confirmed')

      if (guestsNeedingRooms.length === 0) {
        toast.info('No guests need room assignment')
        setAutoAssigning(false)
        return
      }

      // Round-robin assignment
      let hotelIndex = 0
      for (const guest of guestsNeedingRooms) {
        const hotel = hotels[hotelIndex % hotels.length]
        await supabase
          .from('guests')
          .update({ hotel_id: hotel.id })
          .eq('id', guest.id)
        hotelIndex++
      }

      await loadHotels()
      toast.success(`✅ Auto-assigned ${guestsNeedingRooms.length} guests to hotels`)
    } catch (error) {
      console.error('Auto-assign error:', error)
      toast.error('Failed to auto-assign guests')
    } finally {
      setAutoAssigning(false)
    }
  }

  const handleEdit = (hotel: HotelSetting) => {
    setEditingId(hotel.id)
    setEditData(hotel)
  }

  const handleSave = async () => {
    if (!editingId) return
    setSaving(true)

    const { error } = await supabase
      .from('hotel_settings')
      .update(editData)
      .eq('id', editingId)

    if (error) {
      console.error('Error saving hotel:', error)
      alert('Failed to save hotel settings')
    } else {
      setHotels((prev) =>
        prev.map((h) => (h.id === editingId ? { ...h, ...editData } : h))
      )
      setEditingId(null)
      setEditData({})
    }

    setSaving(false)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const totalContractedRooms = hotels.reduce((sum, h) => sum + h.contracted_rooms, 0)
  const totalContractValue = hotels.reduce((sum, h) => sum + h.contracted_rooms * h.rate_per_room_night * 2, 0) // 2 nights
  const guestsNeedingRooms = guests.filter(g => g.room_needed && g.rsvp_status === 'Confirmed')
  const roomsNeeded = Math.ceil(guestsNeedingRooms.reduce((sum, g) => sum + g.pax_total, 0) / 2) // 2 per room

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-rose-gold" />
            Hotel Settings
          </h1>
          <p className="text-gray-600 text-sm mt-2">Configure all hotel properties and manage room assignments</p>
        </div>
        <button
          onClick={handleAutoAssign}
          disabled={autoAssigning || hotels.length === 0}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {autoAssigning ? 'Assigning...' : 'Auto-Assign Guests'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Hotels</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{hotels.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Contracted</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{totalContractedRooms}</p>
          <p className="text-xs text-gray-500 mt-1">rooms</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Needed</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">{roomsNeeded}</p>
          <p className="text-xs text-gray-500 mt-1">{guestsNeedingRooms.length} guests</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Contract Value</p>
          <p className="text-2xl font-bold text-green-700 mt-2">₹{(totalContractValue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500 mt-1">2 nights</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Avg Rate</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">
            ₹{hotels.length > 0 ? Math.round(hotels.reduce((sum, h) => sum + h.rate_per_room_night, 0) / hotels.length).toLocaleString() : 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">per night</p>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hotels.map((hotel) => {
          const isEditing = editingId === hotel.id
          const current = isEditing ? (editData as HotelSetting) : hotel

          return (
            <div key={hotel.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{current.name || hotel.name}</h3>
                  <p className="text-sm text-gray-600">{current.category || hotel.category}</p>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Save"
                      >
                        <Save className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Cancel"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{current.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate/Night (₹)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.rate_per_room_night || 0}
                        onChange={(e) => setEditData({ ...editData, rate_per_room_night: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">₹{current.rate_per_room_night.toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contracted Rooms</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.contracted_rooms || 0}
                        onChange={(e) => setEditData({ ...editData, contracted_rooms: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{current.contracted_rooms}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Check-in</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.default_checkin || ''}
                        onChange={(e) => setEditData({ ...editData, default_checkin: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium text-sm">{current.default_checkin}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Check-out</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.default_checkout || ''}
                        onChange={(e) => setEditData({ ...editData, default_checkout: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium text-sm">{current.default_checkout}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breakfast Type</label>
                  {isEditing ? (
                    <select
                      value={editData.breakfast_type || ''}
                      onChange={(e) => setEditData({ ...editData, breakfast_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select type</option>
                      <option value="Continental">Continental</option>
                      <option value="Indian">Indian</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Full">Full</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">{current.breakfast_type}</p>
                  )}
                </div>

                {!isEditing && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      2-night stay: ₹{(current.rate_per_room_night * 2).toLocaleString()} per room
                    </p>
                    <p className="text-sm font-semibold text-green-700 mt-1">
                      Total: ₹{(current.rate_per_room_night * 2 * current.contracted_rooms).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
