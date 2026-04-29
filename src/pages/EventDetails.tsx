import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EditableTable } from '../components/EditableTable'
import { toast } from 'sonner'

interface EventDetail {
  id: number
  function_id: number
  function_name?: string
  detail_type: string
  description: string
  assigned_to: string
  status: string
  photo_url: string
  notes: string
}

export default function EventDetails() {
  const [details, setDetails] = useState<EventDetail[]>([])
  const [functions, setFunctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDetail, setNewDetail] = useState({
    function_id: '',
    detail_type: 'Décor',
    description: '',
    assigned_to: '',
    status: 'Pending',
    photo_url: '',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [detailRes, funcRes] = await Promise.all([
        supabase.from('event_details').select('*').order('function_id', { ascending: true }),
        supabase.from('functions').select('id, name'),
      ])

      if (detailRes.error) throw detailRes.error
      if (funcRes.error) throw funcRes.error

      const detailsWithNames = detailRes.data.map((d: any) => ({
        ...d,
        function_name: funcRes.data.find((f: any) => f.id === d.function_id)?.name || 'Unknown',
      }))

      setDetails(detailsWithNames)
      setFunctions(funcRes.data || [])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string | number, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('event_details')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setDetails((prev) =>
        prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
      )
      toast.success('Updated')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id: string | number) => {
    try {
      const { error } = await supabase.from('event_details').delete().eq('id', id)
      if (error) throw error

      setDetails((prev) => prev.filter((d) => d.id !== id))
      toast.success('Deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleAdd = async () => {
    try {
      if (!newDetail.function_id) {
        toast.error('Function is required')
        return
      }

      const { error } = await supabase
        .from('event_details')
        .insert([newDetail])

      if (error) throw error

      loadData()
      setNewDetail({
        function_id: '',
        detail_type: 'Décor',
        description: '',
        assigned_to: '',
        status: 'Pending',
        photo_url: '',
        notes: '',
      })
      setShowAddForm(false)
      toast.success('Event detail added')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const columns = [
    { key: 'function_name', label: 'Function', editable: false },
    {
      key: 'detail_type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { label: 'Décor', value: 'Décor' },
        { label: 'Photography', value: 'Photography' },
        { label: 'Videography', value: 'Videography' },
        { label: 'Lighting', value: 'Lighting' },
        { label: 'Flowers', value: 'Flowers' },
      ],
    },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'assigned_to', label: 'Assigned To', type: 'text' as const },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    { key: 'photo_url', label: 'Photo URL', type: 'text' as const },
    { key: 'notes', label: 'Notes', type: 'text' as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Décor & Photography</h2>
        <p className="text-gray-600">Track décor setup, photography, and videography for each function</p>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Add Event Detail</h3>
          <select
            value={newDetail.function_id}
            onChange={(e) => setNewDetail({ ...newDetail, function_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Function</option>
            {functions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <select
            value={newDetail.detail_type}
            onChange={(e) => setNewDetail({ ...newDetail, detail_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Décor">Décor</option>
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Lighting">Lighting</option>
            <option value="Flowers">Flowers</option>
          </select>
          <textarea
            placeholder="Description"
            value={newDetail.description}
            onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={newDetail.assigned_to}
            onChange={(e) => setNewDetail({ ...newDetail, assigned_to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="url"
            placeholder="Photo URL"
            value={newDetail.photo_url}
            onChange={(e) => setNewDetail({ ...newDetail, photo_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Notes"
            value={newDetail.notes}
            onChange={(e) => setNewDetail({ ...newDetail, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <EditableTable
        columns={columns}
        data={details}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={() => setShowAddForm(true)}
        loading={loading}
      />
    </div>
  )
}
