import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FileText, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface HotelSetting {
  id: string
  name: string
  rate_per_room_night: number
  contracted_rooms: number
}

interface Guest {
  id: string
  name: string
  pax_total: number
  hotel_id: string | null
  check_in: string
  check_out: string
}

interface CateringItem {
  id: string
  function_id: string
  meal_name: string
  rate_per_plate: number
  min_guarantee_pax: number
}

export default function HotelBilling() {
  const [hotels, setHotels] = useState<HotelSetting[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [catering, setCatering] = useState<CateringItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [hotelsRes, guestsRes, cateringRes] = await Promise.all([
        supabase.from('hotel_settings').select('*'),
        supabase.from('guests').select('id,name,pax_total,hotel_id,check_in,check_out').eq('room_needed', true),
        supabase.from('catering_items').select('*'),
      ])

      if (hotelsRes.data) setHotels(hotelsRes.data as HotelSetting[])
      if (guestsRes.data) setGuests(guestsRes.data as Guest[])
      if (cateringRes.data) setCatering(cateringRes.data as CateringItem[])
      setLoading(false)
    }

    loadData()
  }, [])

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 2
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    return Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateRoomCost = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId)
    if (!hotel) return 0

    const hotelGuests = guests.filter((g) => g.hotel_id === hotelId)
    const roomsNeeded = Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0))
    const billingRooms = Math.max(hotel.contracted_rooms, roomsNeeded)
    const avgNights = hotelGuests.length > 0
      ? Math.ceil(hotelGuests.reduce((sum, g) => sum + calculateNights(g.check_in, g.check_out), 0) / hotelGuests.length)
      : 2

    return billingRooms * hotel.rate_per_room_night * avgNights
  }

  const calculateMealCost = (hotelId: string) => {
    const hotelGuests = guests.filter((g) => g.hotel_id === hotelId)
    const totalPax = hotelGuests.reduce((sum, g) => sum + g.pax_total, 0)

    return catering.reduce((sum, item) => {
      const billingPax = Math.max(item.min_guarantee_pax, totalPax)
      return sum + billingPax * item.rate_per_plate
    }, 0)
  }

  const exportPDF = async () => {
    const element = document.getElementById('billing-report')
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let y = 10

    pdf.text('Wedding Hotel Billing Report', 10, y)
    y += 10

    let pageHeight = pdf.internal.pageSize.getHeight()
    let remainingHeight = imgHeight

    while (remainingHeight > 0) {
      const heightToPrint = Math.min(pageHeight - y - 10, remainingHeight)
      const sourceY = imgHeight - remainingHeight

      pdf.addImage(
        imgData,
        'PNG',
        10,
        y,
        imgWidth - 20,
        (heightToPrint * (imgWidth - 20)) / imgWidth
      )

      remainingHeight -= heightToPrint
      if (remainingHeight > 0) {
        pdf.addPage()
        y = 10
        pageHeight = pdf.internal.pageSize.getHeight()
      }
    }

    pdf.save('hotel-billing-report.pdf')
  }

  if (loading) return <div className="p-6">Loading...</div>

  const grandTotal = hotels.reduce((sum, h) => sum + calculateRoomCost(h.id) + calculateMealCost(h.id), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hotel Billing</h1>
          <p className="text-gray-600 text-sm mt-1">Room and meal costs per hotel</p>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Grand Total Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-200">
        <p className="text-green-700 text-sm font-medium">GRAND TOTAL (All Hotels)</p>
        <p className="text-4xl font-bold text-green-900 mt-2">₹{grandTotal.toLocaleString()}</p>
        <p className="text-green-700 text-xs mt-2">Rooms + Meals + Catering</p>
      </div>

      {/* Billing Report (for PDF export) */}
      <div id="billing-report" className="space-y-6">
        {hotels.map((hotel) => {
          const hotelGuests = guests.filter((g) => g.hotel_id === hotel.id)
          const roomCost = calculateRoomCost(hotel.id)
          const mealCost = calculateMealCost(hotel.id)
          const subtotal = roomCost + mealCost

          return (
            <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800">{hotel.name}</h2>
                <p className="text-sm text-gray-600">Rate: ₹{hotel.rate_per_room_night}/night | Contracted: {hotel.contracted_rooms} rooms</p>
              </div>

              <div className="p-6">
                {/* Guests Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Guest Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-700 font-medium">Guests</p>
                      <p className="text-2xl font-bold text-blue-900">{hotelGuests.length}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-purple-700 font-medium">Total Pax</p>
                      <p className="text-2xl font-bold text-purple-900">{hotelGuests.reduce((sum, g) => sum + g.pax_total, 0)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-green-700 font-medium">Rooms Needed</p>
                      <p className="text-2xl font-bold text-green-900">
                        {Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Room Billing */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Room Billing</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Rate per night:</span>
                      <span className="font-medium">₹{hotel.rate_per_room_night.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Billing rooms:</span>
                      <span className="font-medium">
                        {Math.max(hotel.contracted_rooms, Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0)))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Nights:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-700 pt-2 border-t border-gray-200">
                      <span>Room Cost:</span>
                      <span>₹{roomCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Meal Billing */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Meal Billing</h3>
                  <div className="space-y-2 text-sm">
                    {catering.map((item) => {
                      const totalPax = hotelGuests.reduce((sum, g) => sum + g.pax_total, 0)
                      const billingPax = Math.max(item.min_guarantee_pax, totalPax)
                      const mealTotal = billingPax * item.rate_per_plate

                      return (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{item.meal_name}</p>
                            <p className="text-xs text-gray-600">MG: {item.min_guarantee_pax} | Rate: ₹{item.rate_per_plate}/plate</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{billingPax} pax</p>
                            <p className="text-lg font-bold text-purple-700">₹{mealTotal.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">{hotel.name} SUBTOTAL</span>
                    <span className="text-2xl font-bold text-green-700">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
