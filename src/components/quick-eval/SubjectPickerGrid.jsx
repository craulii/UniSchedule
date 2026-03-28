import { getSubjectColor } from '../../lib/subjectColors'
import EmptyState from '../ui/EmptyState'

export default function SubjectPickerGrid({ subjects, evaluations, onSelect }) {
  if (subjects.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        }
        title="Sin ramos"
        description="Crea tus ramos primero en la sección Mis Ramos."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {subjects.map((subject, index) => {
        const color = getSubjectColor(index)
        const evalCount = evaluations.filter(e => e.subject_id === subject.id).length

        return (
          <button
            key={subject.id}
            onClick={() => onSelect(subject)}
            className="text-left p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all bg-white group"
          >
            <div className={`w-full h-2 rounded-full ${color.bg} mb-3`} />
            <p className={`text-sm font-semibold ${color.text} group-hover:underline truncate`}>
              {subject.name}
            </p>
            {subject.code && (
              <p className="text-xs text-gray-400 mt-0.5">{subject.code}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {evalCount} {evalCount === 1 ? 'evaluación' : 'evaluaciones'}
            </p>
          </button>
        )
      })}
    </div>
  )
}
