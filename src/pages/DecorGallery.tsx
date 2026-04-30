import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Palette, Search, Download, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface DecorItem {
  id: string
  title: string
  category: string
  image_url: string
  location: string
  estimated_cost: number
  notes: string
  created_at: string
}

export default function DecorGallery() {
  const [decor, setDecor] = useState<DecorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Floral',
    image_url: '',
    location: '',
    estimated_cost: 0,
    notes: ''
  })

  const categories = ['Floral', 'Lighting', 'Seating', 'Entry/Exit', 'Stage', 'Miscellaneous']

  useEffect(() => {
    loadDecor()
  }, [])

  const loadDecor = async () => {
    try {
      const { data, error } = await supabase
        .from('decor_gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDecor(data || [])
    } catch (error) {
      console.error('Error loading decor:', error)
      toast.error('Failed to load decor gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDecor = async () => {
    if (!formData.title.trim() || !formData.image_url.trim()) {
      toast.error('Fill required fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('decor_gallery')
        .insert([formData])
        .select()

      if (error) throw error

      setDecor([...(data || []), ...decor])
      setFormData({ title: '', category: 'Floral', image_url: '', location: '', estimated_cost: 0, notes: '' })
      setShowForm(false)
      toast.success('✅ Decor item added')
    } catch (error) {
      console.error('Error adding decor:', error)
      toast.error('Failed to add decor')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this decor item?')) return

    try {
      const { error } = await supabase
        .from('decor_gallery')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDecor(decor.filter(d => d.id !== id))
      toast.success('Decor deleted')
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error('Failed to delete')
    }
  }

  const filteredDecor = decor.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || d.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalCost = filteredDecor.reduce((sum, d) => sum + d.estimated_cost, 0)

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p>Loading decor gallery...</p></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Palette className="w-8 h-8 text-rose-gold" />
              Décor Reference Gallery
            </h1>
            <p className="text-gray-600 mt-2">Showcase decor options and ideas</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-rose-gold hover:bg-rose-gold/90 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Decor
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Add Décor Item</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Crystal Chandelier"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Main Hall"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost (₹)</label>
              <input
                type="number"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddDecor}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search decor..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
            />
          </div>
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredDecor.length} items • Total estimated cost: ₹{totalCost.toLocaleString()}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecor.map(item => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition">
            <div className="relative aspect-video bg-gray-100 overflow-hidden group">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Not+Found'
                }}
              />
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">{item.category}</span>
                  {item.location && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.location}</span>
                  )}
                </div>
              </div>

              {item.estimated_cost > 0 && (
                <p className="text-lg font-bold text-green-700">₹{item.estimated_cost.toLocaleString()}</p>
              )}

              {item.notes && (
                <p className="text-sm text-gray-600">{item.notes}</p>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <a
                  href={item.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm transition"
                >
                  <Download className="w-4 h-4" />
                  View
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
