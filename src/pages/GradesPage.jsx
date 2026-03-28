import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useSubjectStore from '../stores/subjectStore'
import useCategoryStore from '../stores/categoryStore'
import useEvaluationStore from '../stores/evaluationStore'
import { computeCategoryAverage, computeFinalGrade } from '../lib/gradeCalculator'
import { getSubjectColor } from '../lib/subjectColors'
import EmptyState from '../components/ui/EmptyState'

function SubjectGradeCard({ subject, subjectIndex, categories, evaluations }) {
  const [expanded, setExpanded] = useState(false)
  const color = getSubjectColor(subjectIndex)

  const subjectCategories = categories.filter(c => c.subject_id === subject.id)
  const subjectEvaluations = evaluations.filter(e => e.subject_id === subject.id)

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

  const finalGrade = computeFinalGrade(subjectCategories, evaluationsByCategory)
  const gradedCount = subjectEvaluations.filter(e => e.grade != null).length
  const totalCount = subjectEvaluations.length

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-10 rounded-full flex-shrink-0 ${color.bg}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{subject.name}</p>
            <p className="text-xs text-gray-500">
              {subject.code && `${subject.code} · `}
              {gradedCount}/{totalCount} evaluaciones con nota
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {finalGrade != null ? (
              <span className={`text-2xl font-bold ${finalGrade >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                {finalGrade.toFixed(1)}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-300">--</span>
            )}
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2">
          {subjectCategories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              Sin categorías configuradas.{' '}
              <Link to={`/subjects/${subject.id}`} className="text-indigo-600 hover:underline">
                Configurar
              </Link>
            </p>
          ) : (
            subjectCategories.map(cat => {
              const avg = categoryAverages[cat.id]
              const evals = evaluationsByCategory[cat.id] || []

              return (
                <div key={cat.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{cat.weight}%</span>
                      {avg != null ? (
                        <span className={`text-sm font-bold ${avg >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                          {avg.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-gray-300">--</span>
                      )}
                    </div>
                  </div>
                  {evals.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {evals.map(ev => (
                        <div key={ev.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{ev.name}</span>
                          {ev.grade != null ? (
                            <span className={`font-semibold ${Number(ev.grade) >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Number(ev.grade).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}

          <div className="pt-2 text-center">
            <Link
              to={`/subjects/${subject.id}`}
              className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Ver detalle completo
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GradesPage() {
  const { subjects, fetch: fetchSubjects } = useSubjectStore()
  const { categories, fetchAll: fetchAllCategories } = useCategoryStore()
  const { evaluations, fetchAll: fetchAllEvaluations } = useEvaluationStore()

  useEffect(() => {
    if (subjects.length === 0) fetchSubjects()
    fetchAllCategories()
    fetchAllEvaluations()
  }, [fetchSubjects, fetchAllCategories, fetchAllEvaluations, subjects.length])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notas</h1>
        <p className="text-sm text-gray-500 mt-1">Promedios y notas de todos tus ramos</p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          title="Sin ramos"
          description="Crea tus ramos primero para ver tus notas aquí."
        />
      ) : (
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <SubjectGradeCard
              key={subject.id}
              subject={subject}
              subjectIndex={index}
              categories={categories}
              evaluations={evaluations}
            />
          ))}
        </div>
      )}
    </div>
  )
}
