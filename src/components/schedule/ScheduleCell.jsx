import { getSubjectColor } from '../../lib/subjectColors'
import useSubjectStore from '../../stores/subjectStore'

export default function ScheduleCell({ entry, onAssign, onRemove }) {
  const subjects = useSubjectStore(s => s.subjects)

  if (!entry) {
    return (
      <td
        className="border border-gray-200 p-1 text-center cursor-pointer hover:bg-indigo-50 transition-colors min-w-[120px] h-16"
        onClick={onAssign}
      >
        <span className="text-gray-300 text-lg">+</span>
      </td>
    )
  }

  const subjectName = entry.subject?.name || entry.subject_id
  const subjectIndex = subjects.findIndex(s => s.id === entry.subject_id)
  const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

  return (
    <td className={`border border-gray-200 p-1 min-w-[120px] h-16 ${color.light}`}>
      <div className="flex flex-col items-center justify-center h-full relative group">
        <span className={`text-xs font-semibold ${color.text} text-center leading-tight`}>
          {subjectName}
        </span>
        {entry.room && (
          <span className="text-[10px] text-gray-500 mt-0.5">Sala: {entry.room}</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(entry.id) }}
          className="absolute top-0 right-0 p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quitar"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </td>
  )
}
