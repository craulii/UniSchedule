import { useState } from 'react'
import { getSubjectColor } from '../../lib/subjectColors'
import { EVALUATION_TYPES } from '../../constants/evaluationTypes'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const TYPE_COLOR_MAP = {
  certamen: 'purple',
  control: 'blue',
  tarea: 'green',
  proyecto: 'orange',
  entrega: 'cyan',
  laboratorio: 'red',
  otro: 'gray',
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  // Monday = 0, Sunday = 6
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  // Previous month trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true })
  }

  // Next month leading days
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false })
  }

  return days
}

function DayEventsModal({ open, onClose, date, events, subjects }) {
  if (!date) return null

  const dateStr = new Date(date + 'T00:00:00').toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <Modal open={open} onClose={onClose} title={dateStr} size="md">
      {events.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Sin eventos este día</p>
      ) : (
        <div className="space-y-2">
          {events.map(ev => {
            const subject = subjects.find(s => s.id === ev.subject_id)
            const subjectIndex = subjects.findIndex(s => s.id === ev.subject_id)
            const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)
            const type = EVALUATION_TYPES.find(t => t.key === ev.type)

            return (
              <div key={ev.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${color.bg}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{ev.name}</span>
                    <Badge color={TYPE_COLOR_MAP[ev.type] || 'gray'}>
                      {type?.label || ev.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {subject?.name || 'Ramo'}
                    {ev.eval_time && ` · ${ev.eval_time.slice(0, 5)}`}
                    {ev.room && ` · Sala: ${ev.room}`}
                  </p>
                </div>
                {ev.grade != null && (
                  <span className={`text-lg font-bold flex-shrink-0 ${Number(ev.grade) >= 4.0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(ev.grade).toFixed(1)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export default function CalendarView({ evaluations, subjects }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const days = getCalendarDays(year, month)

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const getDateStr = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getEventsForDay = (day) => {
    const dateStr = getDateStr(day)
    return evaluations.filter(e => e.eval_date === dateStr)
  }

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  const goToday = () => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  const handleDayClick = (day, isCurrent) => {
    if (!isCurrent) return
    const dateStr = getDateStr(day)
    setSelectedDate(dateStr)
    setModalOpen(true)
  }

  const selectedEvents = selectedDate
    ? evaluations.filter(e => e.eval_date === selectedDate)
    : []

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={goToday}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              Hoy
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {WEEKDAYS.map(day => (
            <div key={day} className="px-2 py-2 text-center text-xs font-semibold text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const events = d.current ? getEventsForDay(d.day) : []
            const isToday = d.current && getDateStr(d.day) === todayStr
            const hasEvents = events.length > 0

            return (
              <div
                key={i}
                onClick={() => handleDayClick(d.day, d.current)}
                className={`min-h-[80px] sm:min-h-[100px] border-b border-r border-gray-100 p-1.5 transition-colors ${
                  d.current
                    ? 'bg-white cursor-pointer hover:bg-gray-50'
                    : 'bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : d.current
                          ? 'text-gray-700'
                          : 'text-gray-300'
                    }`}
                  >
                    {d.day}
                  </span>
                  {hasEvents && (
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                      {events.length}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  {events.slice(0, 3).map(ev => {
                    const subjectIndex = subjects.findIndex(s => s.id === ev.subject_id)
                    const color = getSubjectColor(subjectIndex >= 0 ? subjectIndex : 0)

                    return (
                      <div
                        key={ev.id}
                        className={`${color.light} rounded px-1 py-0.5 truncate`}
                      >
                        <span className={`text-[10px] font-medium ${color.text} leading-tight`}>
                          {ev.name}
                        </span>
                      </div>
                    )
                  })}
                  {events.length > 3 && (
                    <span className="text-[10px] text-gray-400 pl-1">
                      +{events.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DayEventsModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDate(null) }}
        date={selectedDate}
        events={selectedEvents}
        subjects={subjects}
      />
    </>
  )
}
