import { useEffect, useState } from 'react'
import useSubjectStore from '../stores/subjectStore'
import useEvaluationStore from '../stores/evaluationStore'
import SubjectPickerGrid from '../components/quick-eval/SubjectPickerGrid'
import QuickEvalModal from '../components/quick-eval/QuickEvalModal'

export default function EvaluationsPage() {
  const { subjects, fetch: fetchSubjects } = useSubjectStore()
  const { evaluations, fetchAll, create } = useEvaluationStore()

  const [selectedSubject, setSelectedSubject] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (subjects.length === 0) fetchSubjects()
    fetchAll()
  }, [fetchSubjects, fetchAll, subjects.length])

  const handleSelect = (subject) => {
    setSelectedSubject(subject)
    setModalOpen(true)
  }

  const handleCreate = async (data) => {
    await create(data)
    await fetchAll()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Selecciona un ramo para agregar una evaluación rápida</p>
      </div>

      <SubjectPickerGrid
        subjects={subjects}
        evaluations={evaluations}
        onSelect={handleSelect}
      />

      <QuickEvalModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedSubject(null) }}
        subject={selectedSubject}
        subjectIndex={subjects.findIndex(s => s.id === selectedSubject?.id)}
        evaluations={evaluations}
        onCreate={handleCreate}
      />
    </div>
  )
}
