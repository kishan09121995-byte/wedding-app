import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useGuestStore, Guest } from '../store/guestStore'
import { useRole } from '../hooks/useRole'
import GuestTable from '../components/GuestTable'
import GuestModal from '../components/GuestModal'
import { Plus, Download, Upload, Search, Filter, Lock } from 'lucide-react'
import { Toaster, toast } from 'sonner'

export default function MasterRSVP() {
  const {
    guests,
    filters,
    setGuests,
    updateGuest,
    deleteGuest,
    setFilters,
    getFilteredGuests,
  } = useGuestStore()
  const { role } = useRole()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>()
  const [loading, setLoading] = useState(false)

  const canAddGuest = role === 'bride_admin' || role === 'vendor_admin'
  const canEditGuest = (guest: Guest) => {
    if (role === 'vendor_admin') return true
    if (role === 'bride_admin') return guest.side === 'Bride'
    if (role === 'groom_admin') return guest.side === 'Groom'
    return false
  }
  const canDeleteGuest = (guest: Guest) => {
    if (role === 'vendor_admin') return true
    if (role === 'bride_admin') return guest.side === 'Bride'
    if (role === 'groom_admin') return guest.side === 'Groom'
    return false
  }

  // Load guests from Supabase
  useEffect(() => {
    loadGuests()
  }, [])

  const loadGuests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('name')

      if (error) throw error

      if (data && data.length === 0) {
        // If no guests, seed with sample data
        toast.info('Loading sample data for 294 guests...')
        await seedSampleGuests()
      } else {
        setGuests(data || [])
        toast.success(`Loaded ${data?.length || 0} guests`)
      }
    } catch (error) {
      console.error('Error loading guests:', error)
      toast.error('Failed to load guests')
    } finally {
      setLoading(false)
    }
  }

  const seedSampleGuests = async () => {
    try {
      const { generateSampleGuests } = await import('../lib/seedGuests')
      const sampleGuests = generateSampleGuests()

      // Insert in batches
      const batchSize = 50
      for (let i = 0; i < sampleGuests.length; i += batchSize) {
        const batch = sampleGuests.slice(i, i + batchSize).map((g) => ({
          name: g.name,
          city: g.city,
          pax_total: g.pax_total,
          side: g.side,
          rsvp_status: g.rsvp_status,
          jain_pax: g.jain_pax,
          f1: g.f1,
          f2: g.f2,
          f3: g.f3,
          f4: g.f4,
          room_needed: g.room_needed,
          hotel_id: g.hotel_id,
          room_category: g.room_category,
          check_in: g.check_in,
          check_out: g.check_out,
          notes: g.notes,
          qr_token: Math.random().toString(36).substring(2, 15),
        }))

        const { data, error } = await supabase
          .from('guests')
          .insert(batch)
          .select()

        if (error) throw error
        if (i === 0) setGuests(data || [])
      }

      const { data } = await supabase.from('guests').select('*').order('name')
      setGuests(data || [])
      toast.success(`✅ Seeded ${sampleGuests.length} sample guests`)
    } catch (error) {
      console.error('Error seeding guests:', error)
      toast.error('Failed to seed sample guests')
    }
  }

  const handleAddGuest = () => {
    if (!canAddGuest) {
      toast.error('Only Bride admin or Vendor admin can add guests')
      return
    }
    setEditingGuest(undefined)
    setIsModalOpen(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleSaveGuest = async (formData: Partial<Guest>) => {
    try {
      if (editingGuest) {
        // Update existing
        const { error } = await supabase
          .from('guests')
          .update(formData)
          .eq('id', editingGuest.id)

        if (error) throw error
        updateGuest(editingGuest.id, formData)
        toast.success('Guest updated')
      } else {
        // Add new
        const { data, error } = await supabase
          .from('guests')
          .insert({
            ...formData,
            qr_token: Math.random().toString(36).substring(2, 15),
          })
          .select()

        if (error) throw error
        if (data) {
          setGuests([...guests, ...data])
          toast.success('Guest added')
        }
      }
    } catch (error) {
      console.error('Error saving guest:', error)
      toast.error('Failed to save guest')
    }
  }

  const handleDeleteGuest = async (id: string) => {
    const guest = guests.find((g) => g.id === id)
    if (!guest || !canDeleteGuest(guest)) {
      toast.error('You do not have permission to delete this guest')
      return
    }

    if (!window.confirm('Are you sure you want to delete this guest?')) return

    try {
      const { error } = await supabase.from('guests').delete().eq('id', id)
      if (error) throw error

      deleteGuest(id)
      toast.success('Guest deleted')
    } catch (error) {
      console.error('Error deleting guest:', error)
      toast.error('Failed to delete guest')
    }
  }

  const handleUpdateField = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error
      updateGuest(id, { [field]: value })
    } catch (error) {
      console.error('Error updating field:', error)
      toast.error('Failed to update field')
    }
  }

  const filteredGuests = getFilteredGuests()

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Toolbar */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Master RSVP</h3>
            <p className="text-sm text-gray-600">294 guests total (161 Groom + 133 Bride)</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAddGuest}
              disabled={!canAddGuest}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                canAddGuest
                  ? 'bg-rose-gold hover:bg-rose-gold/90 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              title={canAddGuest ? 'Add a new guest' : 'Only Bride or Vendor admin can add guests'}
            >
              {canAddGuest ? (
                <>
                  <Plus className="w-4 h-4" />
                  Add Guest
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Add Guest (Restricted)
                </>
              )}
            </button>
            <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium">
              <Upload className="w-4 h-4" />
              Import Excel
            </button>
            <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition font-medium">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search by Name or City
            </label>
            <input
              type="text"
              placeholder="Deepak Mota, Ahmedabad..."
              value={filters.searchTerm || ''}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
          </div>

          {/* Side Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Side
            </label>
            <select
              value={filters.side || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  side: e.target.value as any,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            >
              <option value="">All Sides</option>
              <option value="Groom">Groom</option>
              <option value="Bride">Bride</option>
            </select>
          </div>

          {/* RSVP Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RSVP Status
            </label>
            <select
              value={filters.rsvp_status || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rsvp_status: e.target.value as any,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Not Decided">Not Decided</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          {/* Hotel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel
            </label>
            <select
              value={filters.hotel_id || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  hotel_id: e.target.value,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            >
              <option value="">All Hotels</option>
              <option value="leo-resort">LEO Resort</option>
              <option value="leo-medium">LEO Medium</option>
              <option value="xyz-hotel">XYZ Hotel</option>
              <option value="indralok">Indralok</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.side || filters.rsvp_status || filters.searchTerm || filters.hotel_id) && (
            <div className="flex items-end">
              <button
                onClick={() => setFilters({})}
                className="px-4 py-2 text-rose-gold hover:text-rose-gold/80 font-medium transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Showing {filteredGuests.length} of {guests.length} guests
        </p>
      </div>

      {/* Guest Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading guests...</p>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-4">No guests found</p>
          <button
            onClick={handleAddGuest}
            className="text-rose-gold hover:text-rose-gold/80 font-medium"
          >
            Add the first guest →
          </button>
        </div>
      ) : (
        <GuestTable
          guests={filteredGuests}
          onEdit={handleEditGuest}
          onDelete={handleDeleteGuest}
          onUpdateField={handleUpdateField}
          canEdit={canEditGuest}
          canDelete={canDeleteGuest}
        />
      )}

      {/* Guest Modal */}
      <GuestModal
        guest={editingGuest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingGuest(undefined)
        }}
        onSave={handleSaveGuest}
      />
    </div>
  )
}
