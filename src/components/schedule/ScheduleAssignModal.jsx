import { useState } from 'react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import useSubjectStore from '../../stores/subjectStore'
import useScheduleStore from '../../stores/scheduleStore'
import { SCHEDULE_BLOCKS, DAYS } from '../../constants/blocks'

export default function ScheduleAssignModal({ open, onClose, day, blockKey, onSubmit }) {
  const subjects = useSubjectStore(s => s.subjects)
  const entries = useScheduleStore(s => s.entries)
  const [subjectId, setSubjectId] = useState('')
  const [room, setRoom] = useState('')
  const [loading, setLoading] = useState(false)

  const block = SCHEDULE_BLOCKS.find(b => b.key === blockKey)
  const dayLabel = DAYS.find(d => d.key === day)?.label

  const existingInBlock = entries.filter(e => e.day === day && e.block_key === blockKey)
  const existingNames = existingInBlock.map(e => {
    const s = subjects.find(sub => sub.id === e.subject_id)
    return s?.name || 'Ramo'
  })

  const isDuplicate = subjectId && existingInBlock.some(e => e.subject_id === subjectId)
  const willConflict = subjectId && existingInBlock.length > 0 && !isDuplicate

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subjectId || isDuplicate) return
    setLoading(true)
    await onSubmit({ subject_id: subjectId, day, block_key: blockKey, room: room || null })
    setLoading(false)
    setSubjectId('')
    setRoom('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Asignar Bloque" size="sm">
      <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm font-medium text-indigo-700">
          {dayLabel} — {block?.label}
        </p>
        <p className="text-xs text-indigo-500">{block?.start} - {block?.end}</p>
      </div>

      {existingInBlock.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-700">
            Bloque ya ocupado por:
          </p>
          <ul className="mt-1">
            {existingNames.map((name, i) => (
              <li key={i} className="text-xs text-amber-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                {name}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-500 mt-2">
            Puedes asignar otro ramo y se mostrará como tope horario.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              Se creará un <strong>tope horario</strong> con {existingNames.join(' y ')}.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading} disabled={!subjectId || isDuplicate}>
            {willConflict ? 'Asignar con tope' : 'Asignar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
