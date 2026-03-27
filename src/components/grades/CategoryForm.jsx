import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function CategoryForm({ open, onClose, onSubmit, initial }) {
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setWeight(initial.weight != null ? String(initial.weight) : '')
    } else {
      setName('')
      setWeight('')
    }
  }, [initial, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ name, weight: parseFloat(weight) })
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar Categoría' : 'Nueva Categoría'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej: Certámenes"
          required
        />
        <Input
          label="Ponderación (%)"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Ej: 60"
          required
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>{initial ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </Modal>
  )
}
