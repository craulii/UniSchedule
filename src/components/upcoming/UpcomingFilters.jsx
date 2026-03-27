import Select from '../ui/Select'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'

export default function UpcomingFilters({ subjects, filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.subjectId || ''}
        onChange={e => onChange({ ...filters, subjectId: e.target.value || null })}
        options={subjects.map(s => ({ key: s.id, label: s.name }))}
        placeholder="Todos los ramos"
        className="w-48"
      />
      <Select
        value={filters.type || ''}
        onChange={e => onChange({ ...filters, type: e.target.value || null })}
        options={EVALUATION_TYPES}
        placeholder="Todos los tipos"
        className="w-40"
      />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={filters.pinnedOnly || false}
          onChange={e => onChange({ ...filters, pinnedOnly: e.target.checked })}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Solo fijados
      </label>
    </div>
  )
}
