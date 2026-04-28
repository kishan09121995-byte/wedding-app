import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Vendor {
  id: string
  name: string
  category: string
  contact: string
  budgeted: number
  paid: number
  notes: string
}

const CATEGORIES = ['Photographer', 'Decorator', 'DJ', 'Catering', 'Transport', 'Other']

export default function VendorTracker() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'Photographer',
    contact: '',
    budgeted: 0,
    notes: '',
  })
  const [editData, setEditData] = useState<Partial<Vendor>>({})

  useEffect(() => {
    const loadVendors = async () => {
      const { data, error } = await supabase.from('vendors').select('*').order('category')

      if (error) console.error('Error loading vendors:', error)
      if (data) setVendors(data as Vendor[])
      setLoading(false)
    }

    loadVendors()
  }, [])

  const handleAddVendor = async () => {
    if (!newVendor.name.trim()) {
      toast.error('Please enter vendor name')
      return
    }

    setSaving(true)

    const { data, error } = await supabase
      .from('vendors')
      .insert([{ ...newVendor, paid: 0 }])
      .select()

    if (error) {
      toast.error('Failed to add vendor')
      console.error(error)
    } else if (data) {
      setVendors([...vendors, data[0] as Vendor])
      setNewVendor({
        name: '',
        category: 'Photographer',
        contact: '',
        budgeted: 0,
        notes: '',
      })
      toast.success('Vendor added')
    }

    setSaving(false)
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingId(vendor.id)
    setEditData(vendor)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setSaving(true)

    const { error } = await supabase
      .from('vendors')
      .update(editData)
      .eq('id', editingId)

    if (error) {
      toast.error('Failed to update vendor')
      console.error(error)
    } else {
      setVendors((prev) =>
        prev.map((v) => (v.id === editingId ? { ...v, ...editData } : v))
      )
      setEditingId(null)
      setEditData({})
      toast.success('Vendor updated')
    }

    setSaving(false)
  }

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm('Delete this vendor?')) return

    setSaving(true)

    const { error } = await supabase.from('vendors').delete().eq('id', vendorId)

    if (error) {
      toast.error('Failed to delete vendor')
      console.error(error)
    } else {
      setVendors((prev) => prev.filter((v) => v.id !== vendorId))
      toast.success('Vendor deleted')
    }

    setSaving(false)
  }

  const displayVendors = filterCategory
    ? vendors.filter((v) => v.category === filterCategory)
    : vendors

  const totalBudgeted = displayVendors.reduce((sum, v) => sum + v.budgeted, 0)
  const totalPaid = displayVendors.reduce((sum, v) => sum + v.paid, 0)
  const totalBalance = totalBudgeted - totalPaid

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Tracker</h1>
        <p className="text-gray-600 text-sm mt-1">Manage vendors, contracts, and payment status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Vendors</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{vendors.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Budgeted</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">₹{totalBudgeted.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Paid</p>
          <p className="text-3xl font-bold text-green-700 mt-2">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Balance Due</p>
          <p className={`text-3xl font-bold mt-2 ${totalBalance > 0 ? 'text-red-700' : 'text-green-700'}`}>
            ₹{totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Vendor Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Vendor</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Vendor name"
            value={newVendor.name}
            onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            value={newVendor.category}
            onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Contact"
            value={newVendor.contact}
            onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Budgeted (₹)"
            value={newVendor.budgeted || ''}
            onChange={(e) => setNewVendor({ ...newVendor, budgeted: parseInt(e.target.value, 10) || 0 })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="text"
            placeholder="Notes"
            value={newVendor.notes}
            onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={handleAddVendor}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Vendors
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Budgeted (₹)</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Paid (₹)</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Balance (₹)</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Notes</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayVendors.map((vendor) => {
                const isEditing = editingId === vendor.id
                const current = isEditing ? (editData as Vendor) : vendor
                const balance = current.budgeted - current.paid

                return (
                  <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {isEditing ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={current.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={current.category}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={current.contact}
                            onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input
                            type="number"
                            value={current.budgeted}
                            onChange={(e) => setEditData({ ...editData, budgeted: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input
                            type="number"
                            value={current.paid}
                            onChange={(e) => setEditData({ ...editData, paid: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-800">₹{balance.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={current.notes}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-center flex gap-2 justify-center">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditData({})
                            }}
                            disabled={saving}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-gray-900 font-medium">{vendor.name}</td>
                        <td className="px-6 py-4 text-gray-700">{vendor.category}</td>
                        <td className="px-6 py-4 text-gray-700">{vendor.contact}</td>
                        <td className="px-6 py-4 text-right text-gray-900">₹{vendor.budgeted.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-gray-900">₹{vendor.paid.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{balance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-xs">{vendor.notes}</td>
                        <td className="px-6 py-4 text-center flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(vendor)}
                            disabled={saving}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor.id)}
                            disabled={saving}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
