import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Printer, Clock, CheckCircle2, AlertCircle, Pause } from 'lucide-react'
import { toast } from 'sonner'

interface TimelineEvent {
  id: string
  function_id: string
  time: string
  event: string
  venue: string
  coordinator: string
  catering_action: string
  status: string
  notes: string
}

const SEED_EVENTS = [
  // Day 1 - 21 Jun
  { time: '09:00', event: 'Mandap Ceremony', venue: 'Kiara Ballroom', coordinator: 'Kishan', catering_action: 'Setup', status: 'Planned' },
  { time: '11:00', event: 'Reception & Lunch', venue: 'Main Dining', coordinator: 'Megha', catering_action: 'Serve', status: 'Planned' },
  { time: '13:30', event: 'Guest Rest Period', venue: 'Rooms', coordinator: 'Manager', catering_action: 'Prepare', status: 'Planned' },
  { time: '16:00', event: 'Haldi Ceremony', venue: 'Terrace', coordinator: 'Mother', catering_action: 'HiTea', status: 'Planned' },
  { time: '18:00', event: 'Carnival & Games', venue: 'Lawn', coordinator: 'Entertainers', catering_action: 'Snacks', status: 'Planned' },
  { time: '20:00', event: 'Sangeet Night', venue: 'Grand Ballroom', coordinator: 'DJ', catering_action: 'Dinner', status: 'Planned' },
  { time: '22:00', event: 'Late Night Snacks', venue: 'Terrace Bar', coordinator: 'Staff', catering_action: 'Serve', status: 'Planned' },
  { time: '23:30', event: 'Guests Retire', venue: 'Rooms', coordinator: 'Manager', catering_action: 'Cleanup', status: 'Planned' },

  // Day 2 - 22 Jun
  { time: '07:00', event: 'Breakfast Service', venue: 'Dining', coordinator: 'Catering', catering_action: 'Breakfast', status: 'Planned' },
  { time: '09:00', event: 'Bridal Preparations', venue: 'Bridal Suite', coordinator: 'Makeup Artist', catering_action: 'Tea', status: 'Planned' },
  { time: '10:30', event: 'Groom Preparations', venue: 'Groom Suite', coordinator: 'Groom', catering_action: 'Tea', status: 'Planned' },
  { time: '12:00', event: 'Baraat Arrival', venue: 'Lawn Gate', coordinator: 'Groom Family', catering_action: 'Welcome', status: 'Planned' },
  { time: '13:00', event: 'Wedding Ceremony', venue: 'Mandap', coordinator: 'Priest', catering_action: 'Standby', status: 'Planned' },
  { time: '15:00', event: 'Wedding Lunch', venue: 'Main Dining', coordinator: 'Catering Head', catering_action: 'Lunch Service', status: 'Planned' },
  { time: '17:00', event: 'Photo Session', venue: 'Lawn & Gardens', coordinator: 'Photographer', catering_action: 'Tea', status: 'Planned' },
  { time: '19:00', event: 'Reception Drinks', venue: 'Lounge', coordinator: 'Bar Manager', catering_action: 'Cocktails', status: 'Planned' },
  { time: '20:00', event: 'Reception Dinner', venue: 'Banquet Hall', coordinator: 'Catering Head', catering_action: 'Dinner', status: 'Planned' },
  { time: '22:30', event: 'Cake Cutting & Dancing', venue: 'Dance Floor', coordinator: 'DJ', catering_action: 'Cake & Drinks', status: 'Planned' },
]

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [day, setDay] = useState('21')

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('time')

      if (error) {
        console.error('Error loading events:', error)
        return
      }

      if (data && data.length === 0) {
        await seedEvents()
      } else if (data) {
        setEvents(data as TimelineEvent[])
      }

      setLoading(false)
    }

    const seedEvents = async () => {
      const toInsert = SEED_EVENTS.map((e, i) => ({
        function_id: i < 8 ? 'f2' : 'f4',
        time: e.time,
        event: e.event,
        venue: e.venue,
        coordinator: e.coordinator,
        catering_action: e.catering_action,
        status: e.status,
        notes: '',
      }))

      const { data } = await supabase.from('timeline_events').insert(toInsert).select()

      if (data) setEvents(data as TimelineEvent[])
      setLoading(false)
    }

    loadEvents()
  }, [])

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    setSaving(true)

    const { error } = await supabase
      .from('timeline_events')
      .update({ status: newStatus })
      .eq('id', eventId)

    if (error) {
      toast.error('Failed to update status')
      console.error(error)
    } else {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
      )
      toast.success('Status updated')
    }

    setSaving(false)
  }

  const handleNotesChange = async (eventId: string, newNotes: string) => {
    const { error } = await supabase
      .from('timeline_events')
      .update({ notes: newNotes })
      .eq('id', eventId)

    if (error) console.error('Error updating notes:', error)
  }

  if (loading) return <div className="p-6">Loading...</div>

  const day1Events = events.filter((e) => {
    const hour = parseInt(e.time.split(':')[0], 10)
    return hour >= 9 && hour < 24
  })

  const day2Events = events.filter((e) => {
    const hour = parseInt(e.time.split(':')[0], 10)
    return hour >= 0 && hour < 24
  }).slice(day1Events.length)

  const displayEvents = day === '21' ? day1Events : day2Events

  const statusColors = {
    Planned: 'bg-gray-100 text-gray-800 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Done: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  }

  const statusIcons = {
    Planned: <Clock className="w-4 h-4" />,
    'In Progress': <Pause className="w-4 h-4" />,
    Done: <CheckCircle2 className="w-4 h-4" />,
    Cancelled: <AlertCircle className="w-4 h-4" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wedding Timeline</h1>
          <p className="text-gray-600 text-sm mt-1">Event schedule, status tracking, and coordination</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setDay('21')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            day === '21'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Day 1 — 21 Jun 2026
        </button>
        <button
          onClick={() => setDay('22')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            day === '22'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Day 2 — 22 Jun 2026
        </button>
      </div>

      {/* Timeline Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Time</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Event</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Venue</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Coordinator</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Catering Action</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {displayEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">{event.time}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{event.event}</td>
                  <td className="px-6 py-4 text-gray-700">{event.venue}</td>
                  <td className="px-6 py-4 text-gray-700">{event.coordinator}</td>
                  <td className="px-6 py-4 text-gray-700">{event.catering_action}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={event.status}
                      onChange={(e) => handleStatusChange(event.id, e.target.value)}
                      disabled={saving}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                        statusColors[event.status as keyof typeof statusColors] || statusColors.Planned
                      } cursor-pointer disabled:opacity-50`}
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={event.notes || ''}
                      onChange={(e) => handleNotesChange(event.id, e.target.value)}
                      placeholder="Add notes..."
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, colors]) => (
          <div key={status} className={`p-3 rounded-lg border ${colors}`}>
            <div className="flex items-center gap-2">
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="text-sm font-medium">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
