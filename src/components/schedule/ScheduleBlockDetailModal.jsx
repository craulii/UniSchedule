import { useState } from 'react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import useSubjectStore from '../../stores/subjectStore'
import useScheduleStore from '../../stores/scheduleStore'
import { SCHEDULE_BLOCKS, DAYS } from '../../constants/blocks'
import { getSubjectColor } from '../../lib/subjectColors'

function EntryRow({ entry, subjects, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [room, setRoom] = useState(entry.room || '')
  const [saving, setSaving] = useState(false)

  const subjectName = entry.subject?.name || entry.subject_id
  const subjectIndex = subjects.findIndex(s => s.id === entry.subject_id)
  const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(entry.id, { room: room || null })
    setSaving(false)
    setEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm(`¿Quitar ${subjectName} de este bloque?`)) {
      onRemove(entry.id)
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${color.bg}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${color.text}`}>{subjectName}</p>
        {editing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="Sala (opcional)"
              className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1 disabled:opacity-50"
            >
              {saving ? '...' : 'Guardar'}
            </button>
            <button
              onClick={() => { setEditing(false); setRoom(entry.room || '') }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        ) : (
          entry.room && <p className="text-xs text-gray-500">Sala: {entry.room}</p>
        )}
      </div>
      {!editing && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
            title="Editar sala"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            title="Quitar del bloque"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default function ScheduleBlockDetailModal({ open, onClose, day, blockKey, onAssign, onUpdate, onRemove }) {
  const subjects = useSubjectStore(s => s.subjects)
  const entries = useScheduleStore(s => s.entries)
  const [subjectId, setSubjectId] = useState('')
  const [room, setRoom] = useState('')
  const [loading, setLoading] = useState(false)

  const block = SCHEDULE_BLOCKS.find(b => b.key === blockKey)
  const dayLabel = DAYS.find(d => d.key === day)?.label

  const blockEntries = entries.filter(e => e.day === day && e.block_key === blockKey)
  const hasConflict = blockEntries.length > 1

  const isDuplicate = subjectId && blockEntries.some(e => e.subject_id === subjectId)
  const willConflict = subjectId && blockEntries.length > 0 && !isDuplicate

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!subjectId || isDuplicate) return
    setLoading(true)
    await onAssign({ subject_id: subjectId, day, block_key: blockKey, room: room || null })
    setLoading(false)
    setSubjectId('')
    setRoom('')
  }

  const handleClose = () => {
    setSubjectId('')
    setRoom('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Detalle del Bloque" size="md">
      <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm font-medium text-indigo-700">
          {dayLabel} — {block?.label}
        </p>
        <p className="text-xs text-indigo-500">{block?.start} - {block?.end}</p>
      </div>

      {blockEntries.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Clases en este bloque ({blockEntries.length})
            </h4>
            {hasConflict && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                TOPE
              </span>
            )}
          </div>
          <div className="space-y-2">
            {blockEntries.map(entry => (
              <EntryRow
                key={entry.id}
                entry={entry}
                subjects={subjects}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      )}

      {blockEntries.length > 0 && <hr className="my-4 border-gray-200" />}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Agregar ramo</h4>
        <form onSubmit={handleAssign} className="space-y-3">
          <Select
            label="Ramo"
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
            options={subjects.map(s => ({ key: s.id, label: s.name + (s.code ? ` (${s.code})` : '') }))}
            placeholder="Selecciona un ramo"
            required
            error={isDuplicate ? 'Este ramo ya está en este bloque' : undefined}
          />
          <Input
            label="Sala (opcional)"
            value={room}
            onChange={e => setRoom(e.target.value)}
            placeholder="Ej: A-201"
          />

          {willConflict && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-700">
                Se creará un <strong>tope horario</strong>.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={handleClose}>Cerrar</Button>
            <Button type="submit" loading={loading} disabled={!subjectId || isDuplicate}>
              {willConflict ? 'Asignar con tope' : 'Asignar'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
