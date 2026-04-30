import { useGuestStore } from '../store/guestStore'
import { TrendingUp, Users, Heart, CheckCircle2, AlertCircle } from 'lucide-react'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

export default function Dashboard() {
  const guests = useGuestStore((state) => state.guests)
  const getTotalPax = useGuestStore((state) => state.getTotalPax)
  const getConfirmedPax = useGuestStore((state) => state.getConfirmedPax)
  const getRoomCount = useGuestStore((state) => state.getRoomCount)
  const getConfirmedByFunction = useGuestStore((state) => state.getConfirmedByFunction)
  const getJainPaxByFunction = useGuestStore((state) => state.getJainPaxByFunction)

  const functions = [
    { id: 'f1', label: 'F1 - Mandap Ceremony', color: 'bg-f1-brown', date: '21 Jun, 9:00 AM' },
    { id: 'f2', label: 'F2 - Haldi / Carnival', color: 'bg-f2-blue', date: '21 Jun, 4:00 PM' },
    { id: 'f3', label: 'F3 - Sangeet', color: 'bg-f3-purple', date: '21 Jun, 8:00 PM' },
    { id: 'f4', label: 'F4 - Wedding Day', color: 'bg-f4-green', date: '22 Jun, 7:00 AM' },
  ]

  const confirmedCount = guests.filter((g) => g.rsvp_status === 'Confirmed').length
  const pendingCount = guests.filter((g) => g.rsvp_status === 'Not Decided').length
  const declinedCount = guests.filter((g) => g.rsvp_status === 'Declined').length

  // RSVP pie chart data
  const rsvpData = [
    { name: 'Confirmed', value: confirmedCount, fill: '#10b981' },
    { name: 'Not Decided', value: pendingCount, fill: '#f59e0b' },
    { name: 'Declined', value: declinedCount, fill: '#ef4444' },
  ]

  // Bride vs Groom bar chart data
  const brideCount = guests.filter((g) => g.side === 'Bride').length
  const groomCount = guests.filter((g) => g.side === 'Groom').length
  const sideData = [
    { name: 'Groom Side', groups: groomCount, pax: guests.filter((g) => g.side === 'Groom').reduce((sum, g) => sum + g.pax_total, 0) },
    { name: 'Bride Side', groups: brideCount, pax: guests.filter((g) => g.side === 'Bride').reduce((sum, g) => sum + g.pax_total, 0) },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Groups</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{guests.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pax</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{getTotalPax()}</p>
            </div>
            <Heart className="w-12 h-12 text-rose-gold/30" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Confirmed Pax</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{getConfirmedPax()}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rooms Needed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{getRoomCount()}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-gray-100" />
          </div>
        </div>
      </div>

      {/* RSVP Status - Cards + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">RSVP Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-semibold text-lg">{confirmedCount}</p>
              <p className="text-green-600 text-sm">Confirmed</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-700 font-semibold text-lg">{pendingCount}</p>
              <p className="text-yellow-600 text-sm">Not Decided</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-semibold text-lg">{declinedCount}</p>
              <p className="text-red-600 text-sm">Declined</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">RSVP Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={rsvpData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {rsvpData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bride vs Groom Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Bride vs Groom Split</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sideData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" label={{ value: 'Groups', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Pax', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="groups" fill="#8b3a62" name="Groups" />
            <Bar yAxisId="right" dataKey="pax" fill="#b76e79" name="Total Pax" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Function Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmed Plates by Function</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {functions.map((fn) => {
            const fnKey = fn.id as 'f1' | 'f2' | 'f3' | 'f4'
            const confirmed = getConfirmedByFunction(fnKey)
            const jain = getJainPaxByFunction(fnKey)
            const regular = confirmed - jain

            return (
              <div
                key={fn.id}
                className={`${fn.color} text-white rounded-lg p-6 shadow-sm`}
              >
                <p className="font-bold text-lg mb-1">{fn.label}</p>
                <p className="text-xs opacity-90 mb-4">{fn.date}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Plates:</span>
                    <span className="text-2xl font-bold">{confirmed}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Jain:</span>
                    <span className="font-semibold">{jain}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Regular:</span>
                    <span className="font-semibold">{regular}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Status Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-red-900 mb-1">Pending Payment</h4>
          <p className="text-red-800 text-sm">
            ₹10,00,000 due for hotel contract. Inst2: 19 Apr 2026 | Inst3: 19 May 2026
          </p>
        </div>
      </div>
    </div>
  )
}
