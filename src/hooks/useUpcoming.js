import { useMemo } from 'react'
import useEvaluationStore from '../stores/evaluationStore'
import useSubjectStore from '../stores/subjectStore'

export default function useUpcoming({ subjectId, type, pinnedOnly } = {}) {
  const evaluations = useEvaluationStore(s => s.evaluations)
  const subjects = useSubjectStore(s => s.subjects)

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let filtered = evaluations.filter(e => {
      if (!e.eval_date) return false
      const evalDate = new Date(e.eval_date + 'T00:00:00')
      return evalDate >= today
    })

    if (subjectId) {
      filtered = filtered.filter(e => e.subject_id === subjectId)
    }
    if (type) {
      filtered = filtered.filter(e => e.type === type)
    }
    if (pinnedOnly) {
      filtered = filtered.filter(e => e.pinned)
    }

    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(a.eval_date) - new Date(b.eval_date)
    })

    return filtered.map(e => {
      const subject = subjects.find(s => s.id === e.subject_id) || e.subject
      const evalDate = new Date(e.eval_date + 'T00:00:00')
      const diffTime = evalDate - today
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      return {
        ...e,
        subjectName: subject?.name || 'Sin ramo',
        subjectCode: subject?.code || '',
        daysUntil,
      }
    })
  }, [evaluations, subjects, subjectId, type, pinnedOnly])
}
