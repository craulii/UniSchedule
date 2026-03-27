import { getSubjectColor } from '../../lib/subjectColors'
import useSubjectStore from '../../stores/subjectStore'

function EntrySlice({ entry, subjects, onRemove, count }) {
  const subjectName = entry.subject?.name || entry.subject_id
  const subjectIndex = subjects.findIndex(s => s.id === entry.subject_id)
  const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

  return (
    <div
      className={`flex flex-col items-center justify-center relative group ${color.light} ${count > 1 ? 'px-1 py-0.5' : 'px-1 py-1'}`}
      style={{ flex: 1, minHeight: 0 }}
    >
      <span className={`text-[10px] font-semibold ${color.text} text-center leading-tight truncate w-full`}>
        {subjectName}
      </span>
      {entry.room && (
        <span className="text-[9px] text-gray-500 truncate w-full text-center">
          {entry.room}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(entry.id) }}
        className="absolute top-0 right-0 p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Quitar"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ScheduleCell({ entries, onAssign, onRemove }) {
  const subjects = useSubjectStore(s => s.subjects)
  const hasConflict = entries.length > 1

  if (entries.length === 0) {
    return (
      <td
        className="border border-gray-200 p-0 text-center cursor-pointer hover:bg-indigo-50 transition-colors min-w-[120px] h-16"
        onClick={onAssign}
      >
        <span className="text-gray-300 text-lg">+</span>
      </td>
    )
  }

  return (
    <td
      className={`border p-0 min-w-[120px] h-16 cursor-pointer ${hasConflict ? 'border-red-400 border-2' : 'border-gray-200'}`}
      onClick={onAssign}
    >
      {hasConflict && (
        <div className="bg-red-500 text-white text-[9px] font-bold text-center leading-none py-0.5">
          TOPE
        </div>
      )}
      <div className={`flex ${hasConflict ? 'flex-row divide-x divide-red-300' : ''} h-full`}
        style={hasConflict ? { height: 'calc(100% - 16px)' } : {}}
      >
        {entries.map(entry => (
          <EntrySlice
            key={entry.id}
            entry={entry}
            subjects={subjects}
            onRemove={onRemove}
            count={entries.length}
          />
        ))}
      </div>
    </td>
  )
}
