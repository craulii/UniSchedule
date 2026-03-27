import { useEffect } from 'react'
import useSubjectStore from '../stores/subjectStore'
import useEvaluationStore from '../stores/evaluationStore'
import UpcomingPanel from '../components/upcoming/UpcomingPanel'
import Card from '../components/ui/Card'

export default function DashboardPage() {
  const { subjects, fetch: fetchSubjects } = useSubjectStore()
  const { evaluations, fetchAll } = useEvaluationStore()

  useEffect(() => {
    fetchSubjects()
    fetchAll()
  }, [fetchSubjects, fetchAll])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingCount = evaluations.filter(e => e.eval_date && new Date(e.eval_date + 'T00:00:00') >= today).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de tu semestre</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              <p className="text-xs text-gray-500">Ramos inscritos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
              <p className="text-xs text-gray-500">Evaluaciones totales</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
              <p className="text-xs text-gray-500">Próximas evaluaciones</p>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h2>
        <UpcomingPanel />
      </div>
    </div>
  )
}
