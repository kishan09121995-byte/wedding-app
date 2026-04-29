import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EditableTable } from '../components/EditableTable'
import { useNotifications } from '../hooks/useNotifications'
import { toast } from 'sonner'

interface Assignment {
  id: number
  guest_id: number
  guest_name?: string
  responsibility: string
  assigned_to: string
  status: string
  notes: string
}

export default function Assignments() {
  const { sendNotification, sendToTeam } = useNotifications()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    guest_id: '',
    responsibility: '',
    assigned_to: '',
    status: 'Pending',
    notes: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [assignRes, guestRes] = await Promise.all([
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('guests').select('id, name'),
      ])

      if (assignRes.error) throw assignRes.error
      if (guestRes.error) throw guestRes.error

      const assignmentsWithNames = assignRes.data.map((a: any) => ({
        ...a,
        guest_name: guestRes.data.find((g: any) => g.id === a.guest_id)?.name || 'Unknown',
      }))

      setAssignments(assignmentsWithNames)
      setGuests(guestRes.data || [])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string | number, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      const assignment = assignments.find((a) => a.id === id)
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      )

      // Send notification if status changed
      if (field === 'status' && assignment?.assigned_to) {
        const assigneeEmail = `${assignment.assigned_to}@weddingapp.test`
        await sendNotification(
          assigneeEmail,
          '📋 Assignment Status Updated',
          `Status changed to ${value} for: ${assignment.responsibility}`,
          'assignment',
          Number(id),
          'assignment'
        )
      }

      toast.success('Updated')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id: string | number) => {
    try {
      const { error } = await supabase.from('assignments').delete().eq('id', id)
      if (error) throw error

      setAssignments((prev) => prev.filter((a) => a.id !== id))
      toast.success('Deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleAdd = async () => {
    try {
      if (!newAssignment.guest_id || !newAssignment.responsibility) {
        toast.error('Guest and responsibility required')
        return
      }

      const { data, error } = await supabase
        .from('assignments')
        .insert([newAssignment])
        .select()

      if (error) throw error

      // Send notification to assigned person
      if (newAssignment.assigned_to) {
        const assigneeEmail = `${newAssignment.assigned_to}@weddingapp.test`
        await sendNotification(
          assigneeEmail,
          '📋 New Assignment',
          `${newAssignment.responsibility} has been assigned to you`,
          'assignment',
          data?.[0]?.id,
          'assignment'
        )
      }

      loadData()
      setNewAssignment({
        guest_id: '',
        responsibility: '',
        assigned_to: '',
        status: 'Pending',
        notes: '',
      })
      setShowAddForm(false)
      toast.success('Assignment added & notification sent')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const columns = [
    { key: 'guest_name', label: 'Guest', editable: false },
    { key: 'responsibility', label: 'Responsibility', type: 'text' as const },
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
    { key: 'notes', label: 'Notes', type: 'text' as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Responsibilities & Assignments</h2>
        <p className="text-gray-600">Track who is responsible for what and monitor progress</p>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Add New Assignment</h3>
          <select
            value={newAssignment.guest_id}
            onChange={(e) => setNewAssignment({ ...newAssignment, guest_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Guest</option>
            {guests.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Responsibility"
            value={newAssignment.responsibility}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, responsibility: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={newAssignment.assigned_to}
            onChange={(e) =>
              setNewAssignment({ ...newAssignment, assigned_to: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Notes"
            value={newAssignment.notes}
            onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
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
        data={assignments}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAdd={() => setShowAddForm(true)}
        loading={loading}
      />
    </div>
  )
}
