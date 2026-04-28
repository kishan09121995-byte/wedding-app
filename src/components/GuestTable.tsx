import { useState } from 'react'
import { ChevronDown, Edit2, Trash2 } from 'lucide-react'
import { Guest } from '../store/guestStore'

interface GuestTableProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
  onUpdateField: (id: string, field: string, value: any) => void
}

export default function GuestTable({
  guests,
  onEdit,
  onDelete,
  onUpdateField,
}: GuestTableProps) {
  const [sortBy, setSortBy] = useState<'name' | 'side' | 'pax_total'>('name')
  const [sortDesc, setSortDesc] = useState(false)

  const sortedGuests = [...guests].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Guest]
    let bVal: any = b[sortBy as keyof Guest]

    if (sortBy === 'name') {
      return sortDesc
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal)
    }

    return sortDesc ? bVal - aVal : aVal - bVal
  })

  const totalPax = guests.reduce((sum, g) => sum + g.pax_total, 0)
  const confirmedPax = guests.reduce(
    (sum, g) => (g.rsvp_status === 'Confirmed' ? sum + g.pax_total : sum),
    0
  )
  const totalJain = guests.reduce((sum, g) => sum + g.jain_pax, 0)
  const confirmedGroups = guests.filter((g) => g.rsvp_status === 'Confirmed').length
  const roomCount = guests.filter((g) => g.room_needed === 'Yes').length

  return (
    <div className="space-y-4">
      {/* Summary Row */}
      <div className="bg-gradient-to-r from-mauve/10 to-rose-gold/10 rounded-lg p-4 border border-mauve/20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs">Total Groups</p>
            <p className="text-xl font-bold text-gray-800">{guests.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Total Pax</p>
            <p className="text-xl font-bold text-gray-800">{totalPax}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Confirmed</p>
            <p className="text-xl font-bold text-green-700">
              {confirmedGroups} / {confirmedPax}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Jain Pax</p>
            <p className="text-xl font-bold text-orange-700">{totalJain}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Rooms Needed</p>
            <p className="text-xl font-bold text-blue-700">{roomCount}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Avg Group Size</p>
            <p className="text-xl font-bold text-gray-800">
              {(totalPax / guests.length).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mauve/5 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-mauve/10"
                onClick={() => {
                  if (sortBy === 'name') setSortDesc(!sortDesc)
                  setSortBy('name')
                }}>
                <div className="flex items-center gap-1">
                  Name <ChevronDown className={`w-4 h-4 ${sortBy === 'name' && sortDesc ? 'rotate-180' : ''}`} />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">City</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-mauve/10"
                onClick={() => {
                  if (sortBy === 'pax_total') setSortDesc(!sortDesc)
                  setSortBy('pax_total')
                }}>
                <div className="flex items-center justify-center gap-1">
                  Pax <ChevronDown className={`w-4 h-4 ${sortBy === 'pax_total' && sortDesc ? 'rotate-180' : ''}`} />
                </div>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-mauve/10"
                onClick={() => {
                  if (sortBy === 'side') setSortDesc(!sortDesc)
                  setSortBy('side' as any)
                }}>
                <div className="flex items-center justify-center gap-1">
                  Side <ChevronDown className={`w-4 h-4 ${sortBy === 'side' && sortDesc ? 'rotate-180' : ''}`} />
                </div>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">RSVP</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Jain</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">F1</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">F2</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">F3</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">F4</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Room</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Hotel</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedGuests.map((guest, idx) => (
              <tr key={guest.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{guest.name}</td>
                <td className="px-4 py-3 text-gray-600 text-sm">{guest.city}</td>
                <td className="px-4 py-3 text-center font-medium text-gray-700">{guest.pax_total}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    guest.side === 'Bride' ? 'bg-rose-gold/20 text-rose-gold' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {guest.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={guest.rsvp_status}
                    onChange={(e) => onUpdateField(guest.id, 'rsvp_status', e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${
                      guest.rsvp_status === 'Confirmed'
                        ? 'status-confirmed'
                        : guest.rsvp_status === 'Declined'
                          ? 'status-declined'
                          : 'status-undecided'
                    }`}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Not Decided">Not Decided</option>
                    <option value="Declined">Declined</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    max={guest.pax_total}
                    value={guest.jain_pax}
                    onChange={(e) =>
                      onUpdateField(guest.id, 'jain_pax', parseInt(e.target.value) || 0)
                    }
                    className="w-12 px-1 py-1 text-center border border-gray-300 rounded text-sm focus:ring-1 focus:ring-rose-gold focus:border-transparent"
                  />
                </td>
                {(['f1', 'f2', 'f3', 'f4'] as const).map((fn) => (
                  <td key={fn} className="px-4 py-3 text-center">
                    <select
                      value={guest[fn]}
                      onChange={(e) => onUpdateField(guest.id, fn, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${
                        guest[fn] === 'Yes'
                          ? 'bg-green-100 text-green-800'
                          : guest[fn] === 'No'
                            ? 'bg-red-100 text-red-800'
                            : 'status-tbd'
                      }`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="TBD">TBD</option>
                    </select>
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <select
                    value={guest.room_needed}
                    onChange={(e) => onUpdateField(guest.id, 'room_needed', e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${
                      guest.room_needed === 'Yes'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center text-xs">
                  <select
                    value={guest.hotel_id || ''}
                    onChange={(e) => onUpdateField(guest.id, 'hotel_id', e.target.value || null)}
                    disabled={guest.room_needed === 'No'}
                    className={`px-1 py-1 rounded text-xs border border-gray-300 ${
                      guest.room_needed === 'No' ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                  >
                    <option value="">Not Assigned</option>
                    <option value="leo-resort">LEO Resort</option>
                    <option value="leo-medium">LEO Medium</option>
                    <option value="xyz-hotel">XYZ Hotel</option>
                    <option value="indralok">Indralok</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(guest)}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(guest.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
