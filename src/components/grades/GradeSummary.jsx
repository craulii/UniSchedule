export default function GradeSummary({ finalGrade, categoryWeightStatus }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Promedio Final</h3>
        {finalGrade != null ? (
          <span className={`text-3xl font-bold ${finalGrade >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
            {finalGrade.toFixed(1)}
          </span>
        ) : (
          <span className="text-3xl font-bold text-gray-300">—</span>
        )}
      </div>

      {categoryWeightStatus && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Ponderación total categorías</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  categoryWeightStatus.valid ? 'bg-green-500' : categoryWeightStatus.total > 100 ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(categoryWeightStatus.total, 100)}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${
              categoryWeightStatus.valid ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {categoryWeightStatus.total}%
            </span>
          </div>
          {!categoryWeightStatus.valid && (
            <p className="text-xs text-yellow-600 mt-1">
              Las ponderaciones deben sumar 100%
            </p>
          )}
        </div>
      )}
    </div>
  )
}
