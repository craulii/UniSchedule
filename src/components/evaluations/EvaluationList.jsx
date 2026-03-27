import EvaluationCard from './EvaluationCard'
import EmptyState from '../ui/EmptyState'

export default function EvaluationList({ evaluations, onEdit, onDelete, onTogglePin }) {
  if (evaluations.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        title="Sin evaluaciones"
        description="Agrega tu primera evaluación para este ramo."
      />
    )
  }

  return (
    <div className="space-y-2">
      {evaluations.map(evaluation => (
        <EvaluationCard
          key={evaluation.id}
          evaluation={evaluation}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  )
}
