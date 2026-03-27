import { useEffect } from 'react'
import useScheduleStore from '../stores/scheduleStore'
import useSubjectStore from '../stores/subjectStore'
import ScheduleGrid from '../components/schedule/ScheduleGrid'

export default function SchedulePage() {
  const fetchSchedule = useScheduleStore(s => s.fetch)
  const fetchSubjects = useSubjectStore(s => s.fetch)
  const loading = useScheduleStore(s => s.loading)
  const subjects = useSubjectStore(s => s.subjects)

  useEffect(() => {
    fetchSchedule()
    if (subjects.length === 0) fetchSubjects()
  }, [fetchSchedule, fetchSubjects, subjects.length])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Horario Semanal</h1>
        <p className="text-sm text-gray-500 mt-1">Haz clic en un bloque vacío para asignar un ramo</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <ScheduleGrid />
      )}
    </div>
  )
}
