import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'
import { getSubjectColor } from '../../lib/subjectColors'

const TYPE_ICONS = {
  certamen: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  control: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  tarea: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  proyecto: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  entrega: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
  laboratorio: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  otro: 'M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const TYPE_COLORS = {
  certamen: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
  control: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
  tarea: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
  proyecto: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
  entrega: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200',
  laboratorio: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
  otro: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200',
}

export default function QuickEvalModal({ open, onClose, subject, subjectIndex, evaluations, onCreate }) {
  const [selectedType, setSelectedType] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [customName, setCustomName] = useState('')
  const [loading, setLoading] = useState(false)

  const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

  const getAutoName = (type) => {
    const typeLabel = EVALUATION_TYPES.find(t => t.key === type)?.label || type
    const count = evaluations.filter(
      e => e.subject_id === subject?.id && e.type === type
    ).length
    return `${typeLabel} ${count + 1}`
  }

  const handleCreate = async () => {
    if (!selectedType || !subject) return
    setLoading(true)

    const name = customName.trim() || getAutoName(selectedType)

    await onCreate({
      subject_id: subject.id,
      name,
      type: selectedType,
      eval_date: date || null,
      eval_time: null,
      room: null,
      grade: null,
      weight: null,
      priority: 'media',
      pinned: false,
      category_id: null,
    })

    setLoading(false)
    setSelectedType(null)
    setCustomName('')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  const handleClose = () => {
    setSelectedType(null)
    setCustomName('')
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Nueva Evaluación Rápida" size="md">
      {subject && (
        <div className={`mb-4 p-3 rounded-lg ${color.light}`}>
          <p className={`text-sm font-semibold ${color.text}`}>{subject.name}</p>
          {subject.code && <p className="text-xs text-gray-500">{subject.code}</p>}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de evaluación</label>
        <div className="grid grid-cols-2 gap-2">
          {EVALUATION_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                selectedType === type.key
                  ? `${TYPE_COLORS[type.key]} border-current ring-2 ring-offset-1 ring-current/20`
                  : `${TYPE_COLORS[type.key]} border-transparent`
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={TYPE_ICONS[type.key]} />
              </svg>
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nombre <span className="text-gray-400">(opcional, se genera automáticamente)</span>
            </label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder={getAutoName(selectedType)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleCreate}
          loading={loading}
          disabled={!selectedType}
        >
          Crear
        </Button>
      </div>
    </Modal>
  )
}
