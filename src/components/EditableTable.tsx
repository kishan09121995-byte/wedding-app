import { EditableCell } from './EditableCell'
import { Trash2, Plus } from 'lucide-react'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  options?: { label: string; value: string }[]
  editable?: boolean
  width?: string
}

interface EditableTableProps {
  columns: Column[]
  data: any[]
  onUpdate: (id: string | number, field: string, value: any) => void
  onDelete?: (id: string | number) => void
  onAdd?: () => void
  loading?: boolean
  title?: string
}

export function EditableTable({
  columns,
  data,
  onUpdate,
  onDelete,
  onAdd,
  loading = false,
  title,
}: EditableTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-rose-gold hover:bg-rose-gold/90 text-white rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {(onDelete || onAdd) && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onDelete ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={`${row.id}-${col.key}`}
                      className="px-4 py-3 text-sm text-gray-700"
                      style={{ width: col.width }}
                    >
                      {col.editable !== false ? (
                        <EditableCell
                          value={row[col.key]}
                          onSave={(value) =>
                            onUpdate(row.id, col.key, value)
                          }
                          type={col.type}
                          options={col.options}
                        />
                      ) : (
                        <div className="px-3 py-2">
                          {col.type === 'date'
                            ? new Date(row[col.key]).toLocaleDateString()
                            : String(row[col.key] || '')}
                        </div>
                      )}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
