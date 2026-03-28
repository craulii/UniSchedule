import { getSubjectColor } from '../../lib/subjectColors'
import useSubjectStore from '../../stores/subjectStore'

function EntrySlice({ entry, subjects, count }) {
  const subjectName = entry.subject?.name || entry.subject_id
  const subjectIndex = subjects.findIndex(s => s.id === entry.subject_id)
  const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

  return (
    <div
      className={`flex flex-col items-center justify-center ${color.light} ${count > 1 ? 'px-1 py-0.5' : 'px-1 py-1'}`}
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
    </div>
  )
}

export default function ScheduleCell({ entries, onClick }) {
  const subjects = useSubjectStore(s => s.subjects)
  const hasConflict = entries.length > 1

  if (entries.length === 0) {
    return (
      <td
        className="border border-gray-200 p-0 text-center cursor-pointer hover:bg-indigo-50 transition-colors min-w-[120px] h-16"
        onClick={onClick}
      >
        <span className="text-gray-300 text-lg">+</span>
      </td>
    )
  }

  return (
    <td
      className={`border p-0 min-w-[120px] h-16 cursor-pointer hover:opacity-80 transition-opacity ${hasConflict ? 'border-red-400 border-2' : 'border-gray-200'}`}
      onClick={onClick}
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
            count={entries.length}
          />
        ))}
      </div>
    </td>
  )
}
