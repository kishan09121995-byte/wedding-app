import { useState, useRef, useEffect } from 'react'

interface EditableCellProps {
  value: any
  onSave: (value: any) => void
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  options?: { label: string; value: string }[]
  disabled?: boolean
}

export function EditableCell({
  value,
  onSave,
  type = 'text',
  options = [],
  disabled = false,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | null>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    if (localValue !== value) {
      onSave(localValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  if (!isEditing) {
    return (
      <div
        onClick={() => !disabled && setIsEditing(true)}
        className={`px-3 py-2 rounded cursor-pointer hover:bg-gray-100 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => {
              onSave(e.target.checked)
            }}
            disabled={disabled}
            className="w-4 h-4 cursor-pointer"
          />
        ) : type === 'date' ? (
          new Date(value).toLocaleDateString()
        ) : (
          String(value || '')
        )}
      </div>
    )
  }

  return (
    <div className="px-2 py-1">
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          ref={inputRef as any}
          checked={Boolean(localValue)}
          onChange={(e) => setLocalValue(e.target.checked)}
          className="w-4 h-4"
        />
      ) : type === 'select' ? (
        <select
          ref={inputRef as any}
          value={localValue || ''}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-rose-gold rounded text-sm"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'date' ? (
        <input
          ref={inputRef as any}
          type="date"
          value={localValue || ''}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-rose-gold rounded text-sm"
        />
      ) : type === 'number' ? (
        <input
          ref={inputRef as any}
          type="number"
          value={localValue || ''}
          onChange={(e) => setLocalValue(Number(e.target.value))}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-rose-gold rounded text-sm"
        />
      ) : (
        <input
          ref={inputRef as any}
          type="text"
          value={localValue || ''}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-rose-gold rounded text-sm"
        />
      )}
    </div>
  )
}
