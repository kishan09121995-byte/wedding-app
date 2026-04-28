import { useEffect, useState } from 'react'
import { useGuestStore } from '../store/guestStore'
import { supabase } from '../lib/supabase'
import { Download, Printer } from 'lucide-react'
import * as XLSX from 'xlsx'

interface CateringItem {
  id: string
  function_id: string
  meal_name: string
  rate_per_plate: number
  min_guarantee_pax: number
  is_manual: boolean
  manual_pax: number | null
  venue: string
}

interface Function {
  id: string
  name: string
  date: string
  description: string
}

export default function PlateCount() {
  const getConfirmedByFunction = useGuestStore((state) => state.getConfirmedByFunction)
  const getJainPaxByFunction = useGuestStore((state) => state.getJainPaxByFunction)

  const [cateringItems, setCateringItems] = useState<CateringItem[]>([])
  const [functions, setFunctions] = useState<Function[]>([])
  const [loading, setLoading] = useState(true)
  const [manualOverrides, setManualOverrides] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const loadData = async () => {
      const [cateringRes, functionsRes] = await Promise.all([
        supabase.from('catering_items').select('*'),
        supabase.from('functions').select('*'),
      ])

      if (cateringRes.data) setCateringItems(cateringRes.data as CateringItem[])
      if (functionsRes.data) setFunctions(functionsRes.data as Function[])
      setLoading(false)
    }

    loadData()
  }, [])

  const functionMap = new Map(functions.map((f) => [f.id, f.name]))

  const plateData = cateringItems.map((item) => {
    const fnKey = item.function_id.replace('-', '') as 'f1' | 'f2' | 'f3' | 'f4'
    const actualPax = getConfirmedByFunction(fnKey)
    const actualJain = getJainPaxByFunction(fnKey)
    const regularPax = actualPax - actualJain
    const billingPax = Math.max(item.min_guarantee_pax, actualPax)
    const bufferPax = Math.ceil(billingPax * 1.1)
    const totalCost = billingPax * item.rate_per_plate
    const manualPax = manualOverrides[item.id] ?? 0

    return {
      id: item.id,
      meal: item.meal_name,
      function: functionMap.get(item.function_id) || item.function_id,
      venue: item.venue,
      regular: regularPax,
      jain: actualJain,
      actual: actualPax,
      mg: item.min_guarantee_pax,
      billingPax,
      buffer: bufferPax,
      rate: item.rate_per_plate,
      totalCost,
      manualPax,
    }
  })

  const handleManualOverride = (itemId: string, value: number) => {
    setManualOverrides((prev) => ({ ...prev, [itemId]: value }))
  }

  const exportToExcel = () => {
    const exportData = plateData.map((row) => ({
      'Meal': row.meal,
      'Function': row.function,
      'Venue': row.venue,
      'Regular': row.regular,
      'Jain': row.jain,
      'Total Actual': row.actual,
      'MG': row.mg,
      'Billing Pax': row.billingPax,
      'Buffer (+10%)': row.buffer,
      'Rate (₹)': row.rate,
      'Total Cost (₹)': row.totalCost,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Plate Count')
    XLSX.writeFile(wb, 'plate-count.xlsx')
  }

  if (loading) return <div className="p-6">Loading...</div>

  const totalBillingPax = plateData.reduce((sum, row) => sum + row.billingPax, 0)
  const totalCost = plateData.reduce((sum, row) => sum + row.totalCost, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plate Count Analysis</h1>
          <p className="text-gray-600 text-sm mt-1">Confirmed plates by meal with Jain split and billing calculations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Items</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{plateData.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Actual Pax</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{plateData.reduce((sum, r) => sum + r.actual, 0)}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Billing Pax</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{totalBillingPax}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Cost</p>
          <p className="text-3xl font-bold text-green-700 mt-2">₹{totalCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Plate Count Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Meal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Function</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Venue</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Regular</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Jain</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Total Actual</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">MG</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Billing Pax</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Buffer (+10%)</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Rate (₹)</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {plateData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.meal}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.function}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.venue}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">{row.regular}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">{row.jain}</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">{row.actual}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">{row.mg}</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-purple-600">{row.billingPax}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">{row.buffer}</td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">₹{row.rate}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">₹{row.totalCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
              <td colSpan={7} className="px-6 py-4 text-right text-gray-800">TOTAL:</td>
              <td className="px-6 py-4 text-center text-purple-700">{totalBillingPax}</td>
              <td colSpan={2}></td>
              <td className="px-6 py-4 text-right text-green-700">₹{totalCost.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Manual Overrides Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Manual Overrides</h3>
        <p className="text-gray-600 text-sm mb-4">Override pax count for specific meals (late night snacks, extra breakfast, etc.)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plateData.map((row) => (
            <div key={row.id} className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 flex-1">{row.meal} ({row.function})</label>
              <input
                type="number"
                min="0"
                value={manualOverrides[row.id] ?? 0}
                onChange={(e) => handleManualOverride(row.id, parseInt(e.target.value, 10) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="0"
              />
              <span className="text-xs text-gray-500">pax</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
