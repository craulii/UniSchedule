import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function SubjectForm({ open, onClose, onSubmit, initial }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [professor, setProfessor] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setCode(initial.code || '')
      setProfessor(initial.professor || '')
    } else {
      setName('')
      setCode('')
      setProfessor('')
    }
  }, [initial, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ name, code: code || null, professor: professor || null })
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Editar Ramo' : 'Nuevo Ramo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del ramo"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej: Cálculo I"
          required
        />
        <Input
          label="Código"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Ej: MAT101 (opcional)"
        />
        <Input
          label="Profesor"
          value={professor}
          onChange={e => setProfessor(e.target.value)}
          placeholder="Ej: Dr. García (opcional)"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {initial ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
