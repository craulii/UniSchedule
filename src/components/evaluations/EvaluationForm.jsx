import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'
import { PRIORITIES } from '../../constants/priorities'

export default function EvaluationForm({ open, onClose, onSubmit, initial, categories, subjectId }) {
  const [form, setForm] = useState({
    name: '', type: 'certamen', eval_date: '', eval_time: '',
    room: '', grade: '', weight: '', priority: 'media', pinned: false, category_id: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        type: initial.type || 'certamen',
        eval_date: initial.eval_date || '',
        eval_time: initial.eval_time?.slice(0, 5) || '',
        room: initial.room || '',
        grade: initial.grade != null ? String(initial.grade) : '',
        weight: initial.weight != null ? String(initial.weight) : '',
        priority: initial.priority || 'media',
        pinned: initial.pinned || false,
        category_id: initial.category_id || '',
      })
    } else {
      setForm({
        name: '', type: 'certamen', eval_date: '', eval_time: '',
        room: '', grade: '', weight: '', priority: 'media', pinned: false, category_id: '',
      })
    }
  }, [initial, open])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      subject_id: subjectId,
      name: form.name,
      type: form.type,
      eval_date: form.eval_date || null,
      eval_time: form.eval_time || null,
      room: form.room || null,
      grade: form.grade !== '' ? parseFloat(form.grade) : null,
      weight: form.weight !== '' ? parseFloat(form.weight) : null,
      priority: form.priority,
      pinned: form.pinned,
      category_id: form.category_id || null,
    }

    await onSubmit(payload)
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar Evaluación' : 'Nueva Evaluación'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Ej: Certamen 1"
            required
          />
          <Select
            label="Tipo"
            value={form.type}
            onChange={e => set('type', e.target.value)}
            options={EVALUATION_TYPES}
            required
          />
          <Select
            label="Categoría"
            value={form.category_id}
            onChange={e => set('category_id', e.target.value)}
            options={(categories || []).map(c => ({ key: c.id, label: `${c.name} (${c.weight}%)` }))}
            placeholder="Sin categoría"
          />
          <Select
            label="Prioridad"
            value={form.priority}
            onChange={e => set('priority', e.target.value)}
            options={PRIORITIES}
          />
          <Input
            label="Fecha"
            type="date"
            value={form.eval_date}
            onChange={e => set('eval_date', e.target.value)}
          />
          <Input
            label="Hora"
            type="time"
            value={form.eval_time}
            onChange={e => set('eval_time', e.target.value)}
          />
          <Input
            label="Sala"
            value={form.room}
            onChange={e => set('room', e.target.value)}
            placeholder="Ej: A-201"
          />
          <Input
            label="Nota (1.0 - 7.0)"
            type="number"
            step="0.1"
            min="1.0"
            max="7.0"
            value={form.grade}
            onChange={e => set('grade', e.target.value)}
            placeholder="Opcional"
          />
          <Input
            label="Peso en categoría (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={form.weight}
            onChange={e => set('weight', e.target.value)}
            placeholder="Dejar vacío = peso igual"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={e => set('pinned', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          Fijar evaluación (destacar)
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>{initial ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  )
}
