import { useState } from 'react'
import useSubjectStore from '../../stores/subjectStore'
import useUpcoming from '../../hooks/useUpcoming'
import UpcomingFilters from './UpcomingFilters'
import UpcomingEventCard from './UpcomingEventCard'
import EmptyState from '../ui/EmptyState'

export default function UpcomingPanel() {
  const subjects = useSubjectStore(s => s.subjects)
  const [filters, setFilters] = useState({ subjectId: null, type: null, pinnedOnly: false })
  const events = useUpcoming(filters)

  return (
    <div className="space-y-4">
      <UpcomingFilters subjects={subjects} filters={filters} onChange={setFilters} />

      {events.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          title="Sin eventos próximos"
          description="No hay evaluaciones programadas para los próximos días."
        />
      ) : (
        <div className="space-y-2">
          {events.map(event => (
            <UpcomingEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
