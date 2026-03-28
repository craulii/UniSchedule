import Badge from '../ui/Badge'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'
import { PRIORITIES } from '../../constants/priorities'

export default function EvaluationCard({ evaluation, onEdit, onDelete, onTogglePin }) {
  const type = EVALUATION_TYPES.find(t => t.key === evaluation.type)
  const priority = PRIORITIES.find(p => p.key === evaluation.priority)

  const typeColorMap = {
    certamen: 'purple',
    control: 'blue',
    tarea: 'green',
    proyecto: 'orange',
    entrega: 'cyan',
    laboratorio: 'red',
    otro: 'gray',
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <button
        onClick={() => onTogglePin(evaluation.id)}
        className={`flex-shrink-0 p-1 rounded transition-colors ${
          evaluation.pinned ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'
        }`}
        title={evaluation.pinned ? 'Desfijar' : 'Fijar'}
      >
        <svg className="w-4 h-4" fill={evaluation.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 truncate">{evaluation.name}</span>
          <Badge color={typeColorMap[evaluation.type] || 'gray'}>{type?.label || evaluation.type}</Badge>
          <Badge color={priority?.color || 'gray'}>{priority?.label}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {evaluation.eval_date && (
            <span>{new Date(evaluation.eval_date + 'T00:00:00').toLocaleDateString('es-CL')}</span>
          )}
          {evaluation.eval_time && <span>{evaluation.eval_time.slice(0, 5)}</span>}
          {evaluation.room && <span>Sala: {evaluation.room}</span>}
        </div>
      </div>

      {evaluation.grade != null && (
        <div className={`flex-shrink-0 text-lg font-bold px-2 py-1 rounded ${
          evaluation.grade >= 4.0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {Number(evaluation.grade).toFixed(1)}
        </div>
      )}

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(evaluation)}
          className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(evaluation.id)}
          className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
