import Button from './Button'

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
