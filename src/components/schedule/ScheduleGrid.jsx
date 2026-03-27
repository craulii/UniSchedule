import { useState } from 'react'
import { SCHEDULE_BLOCKS, DAYS } from '../../constants/blocks'
import useScheduleStore from '../../stores/scheduleStore'
import ScheduleCell from './ScheduleCell'
import LunchRow from './LunchRow'
import ScheduleAssignModal from './ScheduleAssignModal'

export default function ScheduleGrid() {
  const entries = useScheduleStore(s => s.entries)
  const assign = useScheduleStore(s => s.assign)
  const unassign = useScheduleStore(s => s.unassign)

  const [modal, setModal] = useState({ open: false, day: null, blockKey: null })

  const getEntries = (day, blockKey) => {
    return entries.filter(e => e.day === day && e.block_key === blockKey)
  }

  const handleRemove = async (id) => {
    await unassign(id)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 shadow-sm">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                Bloque
              </th>
              {DAYS.map(day => (
                <th key={day.key} className="border border-gray-200 bg-gray-50 px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE_BLOCKS.map(block => {
              if (!block.assignable) {
                return <LunchRow key={block.key} />
              }

              return (
                <tr key={block.key}>
                  <td className="border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-600 font-medium whitespace-nowrap">
                    <div>{block.label}</div>
                    <div className="text-[10px] text-gray-400">{block.start} - {block.end}</div>
                  </td>
                  {DAYS.map(day => (
                    <ScheduleCell
                      key={`${day.key}-${block.key}`}
                      entries={getEntries(day.key, block.key)}
                      onAssign={() => setModal({ open: true, day: day.key, blockKey: block.key })}
                      onRemove={handleRemove}
                    />
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ScheduleAssignModal
        open={modal.open}
        onClose={() => setModal({ open: false, day: null, blockKey: null })}
        day={modal.day}
        blockKey={modal.blockKey}
        onSubmit={assign}
      />
    </>
  )
}
