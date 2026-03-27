import { useEffect, useState } from 'react'
import useSubjectStore from '../stores/subjectStore'
import SubjectList from '../components/subjects/SubjectList'
import SubjectForm from '../components/subjects/SubjectForm'
import Button from '../components/ui/Button'

export default function SubjectsPage() {
  const { subjects, loading, fetch, create, update, remove } = useSubjectStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetch()
  }, [fetch])

  const handleCreate = async (data) => {
    await create(data)
  }

  const handleUpdate = async (data) => {
    await update(editing.id, data)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este ramo? Se borrarán todos sus horarios y evaluaciones.')) {
      await remove(id)
    }
  }

  const handleEdit = (subject) => {
    setEditing(subject)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditing(null)
  }

  if (loading && subjects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Ramos</h1>
          <p className="text-sm text-gray-500 mt-1">{subjects.length} ramo{subjects.length !== 1 ? 's' : ''} registrado{subjects.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Ramo
        </Button>
      </div>

      <SubjectList subjects={subjects} onEdit={handleEdit} onDelete={handleDelete} />

      <SubjectForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
      />
    </div>
  )
}
