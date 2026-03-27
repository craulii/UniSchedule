import WeightIndicator from '../ui/WeightIndicator'

export default function CategorySection({ category, evaluations, average, weightStatus, onEditCategory, onDeleteCategory }) {
  const gradedEvals = evaluations.filter(e => e.grade != null)

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{category.name}</h4>
          <span className="text-xs text-gray-500">Ponderación: {category.weight}%</span>
        </div>
        <div className="flex items-center gap-3">
          {average != null && (
            <span className={`text-lg font-bold ${average >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
              {average.toFixed(1)}
            </span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditCategory(category)}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {evaluations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-2">Sin evaluaciones en esta categoría</p>
        ) : (
          <div className="space-y-2">
            {evaluations.map(eval_ => (
              <div key={eval_.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{eval_.name}</span>
                <div className="flex items-center gap-3">
                  {eval_.weight != null && (
                    <span className="text-xs text-gray-400">{eval_.weight}%</span>
                  )}
                  {eval_.grade != null ? (
                    <span className={`font-semibold ${Number(eval_.grade) >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(eval_.grade).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {weightStatus && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <WeightIndicator total={weightStatus.total} />
          </div>
        )}
      </div>
    </div>
  )
}
