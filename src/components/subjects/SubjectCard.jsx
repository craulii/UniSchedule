import { Link } from 'react-router-dom'
import { getSubjectColor } from '../../lib/subjectColors'
import Card from '../ui/Card'

export default function SubjectCard({ subject, index, onEdit, onDelete }) {
  const color = getSubjectColor(index)

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${color.bg}`} />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link
              to={`/subjects/${subject.id}`}
              className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              {subject.name}
            </Link>
            {subject.code && (
              <p className="text-sm text-gray-500 mt-0.5">{subject.code}</p>
            )}
            {subject.professor && (
              <p className="text-sm text-gray-400 mt-0.5">Prof. {subject.professor}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onEdit(subject)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(subject.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
