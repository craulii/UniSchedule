import Badge from '../ui/Badge'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'
import { PRIORITIES } from '../../constants/priorities'

const typeColorMap = {
  certamen: 'purple',
  control: 'blue',
  tarea: 'green',
  proyecto: 'orange',
  otro: 'gray',
}

export default function UpcomingEventCard({ event }) {
  const type = EVALUATION_TYPES.find(t => t.key === event.type)
  const priority = PRIORITIES.find(p => p.key === event.priority)

  const daysLabel = event.daysUntil === 0
    ? 'Hoy'
    : event.daysUntil === 1
    ? 'Mañana'
    : `En ${event.daysUntil} días`

  const urgencyColor = event.daysUntil <= 1
    ? 'text-red-600 bg-red-50'
    : event.daysUntil <= 3
    ? 'text-orange-600 bg-orange-50'
    : event.daysUntil <= 7
    ? 'text-yellow-600 bg-yellow-50'
    : 'text-gray-600 bg-gray-50'

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${urgencyColor}`}>
        {daysLabel}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {event.pinned && (
            <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
          <span className="text-sm font-medium text-gray-900 truncate">{event.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{event.subjectName}</span>
          {event.subjectCode && <span>({event.subjectCode})</span>}
          <span>{new Date(event.eval_date + 'T00:00:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          {event.eval_time && <span>{event.eval_time.slice(0, 5)}</span>}
          {event.room && <span>Sala: {event.room}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge color={typeColorMap[event.type] || 'gray'}>{type?.label}</Badge>
        <Badge color={priority?.color || 'gray'}>{priority?.label}</Badge>
      </div>
    </div>
  )
}
