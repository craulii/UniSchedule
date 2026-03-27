import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useSubjectStore from '../stores/subjectStore'
import useCategoryStore from '../stores/categoryStore'
import useEvaluationStore from '../stores/evaluationStore'
import EvaluationList from '../components/evaluations/EvaluationList'
import EvaluationForm from '../components/evaluations/EvaluationForm'
import GradePanel from '../components/grades/GradePanel'
import CategoryForm from '../components/grades/CategoryForm'
import Button from '../components/ui/Button'

export default function SubjectDetailPage() {
  const { id } = useParams()
  const subjects = useSubjectStore(s => s.subjects)
  const fetchSubjects = useSubjectStore(s => s.fetch)
  const { categories, fetchBySubject: fetchCategories, create: createCategory, update: updateCategory, remove: removeCategory } = useCategoryStore()
  const { evaluations, fetchBySubject: fetchEvaluations, create: createEval, update: updateEval, remove: removeEval, togglePin } = useEvaluationStore()

  const [evalFormOpen, setEvalFormOpen] = useState(false)
  const [editingEval, setEditingEval] = useState(null)
  const [catFormOpen, setCatFormOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [tab, setTab] = useState('evaluations')

  const subject = subjects.find(s => s.id === id)

  useEffect(() => {
    if (subjects.length === 0) fetchSubjects()
    fetchCategories(id)
    fetchEvaluations(id)
  }, [id, subjects.length, fetchSubjects, fetchCategories, fetchEvaluations])

  const subjectEvaluations = evaluations.filter(e => e.subject_id === id)

  const handleCreateEval = async (data) => {
    await createEval(data)
  }

  const handleUpdateEval = async (data) => {
    await updateEval(editingEval.id, data)
    setEditingEval(null)
  }

  const handleDeleteEval = async (evalId) => {
    if (window.confirm('¿Eliminar esta evaluación?')) {
      await removeEval(evalId)
    }
  }

  const handleEditEval = (evaluation) => {
    setEditingEval(evaluation)
    setEvalFormOpen(true)
  }

  const handleCreateCategory = async (data) => {
    await createCategory({ ...data, subject_id: id })
  }

  const handleUpdateCategory = async (data) => {
    await updateCategory(editingCat.id, data)
    setEditingCat(null)
  }

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('¿Eliminar esta categoría? Las evaluaciones asociadas quedarán sin categoría.')) {
      await removeCategory(catId)
    }
  }

  if (!subject) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/subjects" className="text-sm text-indigo-600 hover:text-indigo-700 mb-2 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Ramos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
        <div className="flex items-center gap-3 mt-1">
          {subject.code && <span className="text-sm text-gray-500">{subject.code}</span>}
          {subject.professor && <span className="text-sm text-gray-400">Prof. {subject.professor}</span>}
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('evaluations')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'evaluations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Evaluaciones ({subjectEvaluations.length})
        </button>
        <button
          onClick={() => setTab('grades')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'grades' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Notas y Promedios
        </button>
      </div>

      {tab === 'evaluations' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setEditingEval(null); setEvalFormOpen(true) }}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Evaluación
            </Button>
          </div>
          <EvaluationList
            evaluations={subjectEvaluations}
            onEdit={handleEditEval}
            onDelete={handleDeleteEval}
            onTogglePin={togglePin}
          />
        </div>
      )}

      {tab === 'grades' && (
        <GradePanel
          subjectId={id}
          onAddCategory={() => { setEditingCat(null); setCatFormOpen(true) }}
          onEditCategory={(cat) => { setEditingCat(cat); setCatFormOpen(true) }}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      <EvaluationForm
        open={evalFormOpen}
        onClose={() => { setEvalFormOpen(false); setEditingEval(null) }}
        onSubmit={editingEval ? handleUpdateEval : handleCreateEval}
        initial={editingEval}
        categories={categories}
        subjectId={id}
      />

      <CategoryForm
        open={catFormOpen}
        onClose={() => { setCatFormOpen(false); setEditingCat(null) }}
        onSubmit={editingCat ? handleUpdateCategory : handleCreateCategory}
        initial={editingCat}
      />
    </div>
  )
}
