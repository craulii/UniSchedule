import { useEffect } from 'react'
import useSubjectStore from '../stores/subjectStore'
import useEvaluationStore from '../stores/evaluationStore'
import CalendarView from '../components/calendar/CalendarView'

export default function CalendarPage() {
  const { subjects, fetch: fetchSubjects } = useSubjectStore()
  const { evaluations, fetchAll } = useEvaluationStore()

  useEffect(() => {
    if (subjects.length === 0) fetchSubjects()
    fetchAll()
  }, [fetchSubjects, fetchAll, subjects.length])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
        <p className="text-sm text-gray-500 mt-1">Todas tus evaluaciones en vista mensual</p>
      </div>

      <CalendarView evaluations={evaluations} subjects={subjects} />
    </div>
  )
}
