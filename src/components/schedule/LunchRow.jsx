export default function LunchRow() {
  return (
    <tr>
      <td className="border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-500 font-medium whitespace-nowrap">
        <div>Almuerzo</div>
        <div className="text-[10px] text-gray-400">13:40 - 14:40</div>
      </td>
      <td
        colSpan={5}
        className="border border-gray-200 bg-gray-50 text-center text-sm text-gray-400 italic h-12"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Horario de almuerzo
        </div>
      </td>
    </tr>
  )
}
