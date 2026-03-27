export function computeCategoryAverage(evaluations) {
  const graded = evaluations.filter(e => e.grade != null && e.grade !== '')
  if (graded.length === 0) return null

  const hasExplicitWeights = graded.some(e => e.weight != null && e.weight > 0)

  if (hasExplicitWeights) {
    const totalWeight = graded.reduce((sum, e) => sum + (Number(e.weight) || 0), 0)
    if (totalWeight === 0) return null
    const weightedSum = graded.reduce((sum, e) => sum + (Number(e.grade) * (Number(e.weight) || 0)), 0)
    return weightedSum / totalWeight
  }

  const sum = graded.reduce((s, e) => s + Number(e.grade), 0)
  return sum / graded.length
}

export function computeFinalGrade(categories, evaluationsByCategory) {
  let totalWeight = 0
  let weightedSum = 0

  for (const cat of categories) {
    const evals = evaluationsByCategory[cat.id] || []
    const avg = computeCategoryAverage(evals)
    if (avg != null) {
      weightedSum += avg * Number(cat.weight)
      totalWeight += Number(cat.weight)
    }
  }

  if (totalWeight === 0) return null
  return weightedSum / totalWeight
}

export function validateWeightSum(weights, target = 100) {
  const sum = weights.reduce((s, w) => s + Number(w), 0)
  return {
    valid: Math.abs(sum - target) < 0.01,
    total: Math.round(sum * 100) / 100,
    difference: Math.round((target - sum) * 100) / 100,
  }
}

export function distributeEqualWeights(count) {
  if (count === 0) return []
  const base = Math.floor((10000 / count)) / 100
  const weights = Array(count).fill(base)
  const remainder = Math.round((100 - base * count) * 100) / 100
  weights[weights.length - 1] = Math.round((weights[weights.length - 1] + remainder) * 100) / 100
  return weights
}
