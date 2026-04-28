import { useState } from 'react'
import { X } from 'lucide-react'
import { Guest } from '../store/guestStore'

interface GuestModalProps {
  guest?: Guest
  isOpen: boolean
  onClose: () => void
  onSave: (guest: Partial<Guest>) => void
}

export default function GuestModal({ guest, isOpen, onClose, onSave }: GuestModalProps) {
  const [formData, setFormData] = useState<Partial<Guest>>(
    guest || {
      name: '',
      city: '',
      pax_total: 1,
      side: 'Groom',
      rsvp_status: 'Not Decided',
      jain_pax: 0,
      f1: 'Yes',
      f2: 'Yes',
      f3: 'Yes',
      f4: 'Yes',
      room_needed: 'No',
      hotel_id: undefined,
      notes: '',
    }
  )

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.city || !formData.pax_total) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            {guest ? 'Edit Guest' : 'Add New Guest'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Guest name or group name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
          </div>

          {/* City & Pax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Ahmedabad"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Pax *
              </label>
              <input
                type="number"
                min="1"
                value={formData.pax_total || 1}
                onChange={(e) => handleChange('pax_total', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              />
            </div>
          </div>

          {/* Side & RSVP */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Side
              </label>
              <select
                value={formData.side || 'Groom'}
                onChange={(e) => handleChange('side', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="Groom">Groom</option>
                <option value="Bride">Bride</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RSVP Status
              </label>
              <select
                value={formData.rsvp_status || 'Not Decided'}
                onChange={(e) => handleChange('rsvp_status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Not Decided">Not Decided</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
          </div>

          {/* Jain Pax */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jain Pax (0-{formData.pax_total})
            </label>
            <input
              type="number"
              min="0"
              max={formData.pax_total}
              value={formData.jain_pax || 0}
              onChange={(e) => handleChange('jain_pax', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
          </div>

          {/* Functions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Attendance
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['f1', 'f2', 'f3', 'f4'] as const).map((fn) => (
                <div key={fn} className="flex items-center gap-2">
                  <select
                    value={formData[fn] || 'Yes'}
                    onChange={(e) => handleChange(fn, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-gold focus:border-transparent"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="TBD">TBD</option>
                  </select>
                  <label className="text-sm text-gray-600">
                    {fn === 'f1' && 'Mandap'}
                    {fn === 'f2' && 'Haldi'}
                    {fn === 'f3' && 'Sangeet'}
                    {fn === 'f4' && 'Wedding'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Room & Hotel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Needed
              </label>
              <select
                value={formData.room_needed || 'No'}
                onChange={(e) => handleChange('room_needed', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hotel
              </label>
              <select
                value={formData.hotel_id || ''}
                onChange={(e) => handleChange('hotel_id', e.target.value || undefined)}
                disabled={formData.room_needed === 'No'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Not Assigned</option>
                <option value="leo-resort">LEO Resort</option>
                <option value="leo-medium">LEO Medium</option>
                <option value="xyz-hotel">XYZ Hotel</option>
                <option value="indralok">Indralok</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="VIP, Allergies, Special requests..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-lg transition font-medium"
          >
            {guest ? 'Update' : 'Add'} Guest
          </button>
        </div>
      </div>
    </div>
  )
}
