export default function WeightIndicator({ total, target = 100 }) {
  const percentage = Math.min((total / target) * 100, 100)
  const isValid = Math.abs(total - target) < 0.01
  const isOver = total > target

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={isValid ? 'text-green-600 font-medium' : isOver ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'}>
          {total.toFixed(1)}% / {target}%
        </span>
        {!isValid && (
          <span className={isOver ? 'text-red-500' : 'text-yellow-500'}>
            {isOver ? `+${(total - target).toFixed(1)}%` : `Faltan ${(target - total).toFixed(1)}%`}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${isValid ? 'bg-green-500' : isOver ? 'bg-red-500' : 'bg-yellow-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
