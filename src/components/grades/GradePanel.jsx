import useGrades from '../../hooks/useGrades'
import CategorySection from './CategorySection'
import GradeSummary from './GradeSummary'
import Button from '../ui/Button'

export default function GradePanel({ subjectId, onAddCategory, onEditCategory, onDeleteCategory }) {
  const {
    categories,
    evaluationsByCategory,
    categoryAverages,
    categoryWeightStatus,
    perCategoryWeightStatus,
    finalGrade,
  } = useGrades(subjectId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notas y Promedios</h3>
        <Button size="sm" onClick={onAddCategory}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Categoría
        </Button>
      </div>

      <GradeSummary finalGrade={finalGrade} categoryWeightStatus={categoryWeightStatus} />

      {categories.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-400">
          <p>Crea categorías (Certámenes, Controles, etc.) para calcular promedios.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              evaluations={evaluationsByCategory[cat.id] || []}
              average={categoryAverages[cat.id]}
              weightStatus={perCategoryWeightStatus[cat.id]}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}
