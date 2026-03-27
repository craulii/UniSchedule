import { useMemo } from 'react'
import useCategoryStore from '../stores/categoryStore'
import useEvaluationStore from '../stores/evaluationStore'
import { computeCategoryAverage, computeFinalGrade, validateWeightSum } from '../lib/gradeCalculator'

export default function useGrades(subjectId) {
  const categories = useCategoryStore(s => s.categories)
  const evaluations = useEvaluationStore(s => s.evaluations)

  return useMemo(() => {
    const subjectCategories = categories.filter(c => c.subject_id === subjectId)
    const subjectEvaluations = evaluations.filter(e => e.subject_id === subjectId)

    const evaluationsByCategory = {}
    for (const eval_ of subjectEvaluations) {
      const catId = eval_.category_id || 'uncategorized'
      if (!evaluationsByCategory[catId]) evaluationsByCategory[catId] = []
      evaluationsByCategory[catId].push(eval_)
    }

    const categoryAverages = {}
    for (const cat of subjectCategories) {
      categoryAverages[cat.id] = computeCategoryAverage(evaluationsByCategory[cat.id] || [])
    }

    const categoryWeightStatus = validateWeightSum(subjectCategories.map(c => Number(c.weight)))

    const perCategoryWeightStatus = {}
    for (const cat of subjectCategories) {
      const evals = (evaluationsByCategory[cat.id] || []).filter(e => e.weight != null)
      if (evals.length > 0) {
        perCategoryWeightStatus[cat.id] = validateWeightSum(evals.map(e => Number(e.weight)))
      }
    }

    const finalGrade = computeFinalGrade(subjectCategories, evaluationsByCategory)

    return {
      categories: subjectCategories,
      evaluationsByCategory,
      categoryAverages,
      categoryWeightStatus,
      perCategoryWeightStatus,
      finalGrade,
      uncategorized: evaluationsByCategory['uncategorized'] || [],
    }
  }, [categories, evaluations, subjectId])
}
