import { useState } from 'react'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import useSubjectStore from '../../stores/subjectStore'
import { SCHEDULE_BLOCKS, DAYS } from '../../constants/blocks'

export default function ScheduleAssignModal({ open, onClose, day, blockKey, onSubmit }) {
  const subjects = useSubjectStore(s => s.subjects)
  const [subjectId, setSubjectId] = useState('')
  const [room, setRoom] = useState('')
  const [loading, setLoading] = useState(false)

  const block = SCHEDULE_BLOCKS.find(b => b.key === blockKey)
  const dayLabel = DAYS.find(d => d.key === day)?.label

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!subjectId) return
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Ramo"
          value={subjectId}
          onChange={e => setSubjectId(e.target.value)}
          options={subjects.map(s => ({ key: s.id, label: s.name + (s.code ? ` (${s.code})` : '') }))}
          placeholder="Selecciona un ramo"
          required
        />
        <Input
          label="Sala (opcional)"
          value={room}
          onChange={e => setRoom(e.target.value)}
          placeholder="Ej: A-201"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading} disabled={!subjectId}>Asignar</Button>
        </div>
      </form>
    </Modal>
  )
}
