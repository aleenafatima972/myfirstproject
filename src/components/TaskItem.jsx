import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from './Icons.jsx'
import { formatDueDate, getDueStatus } from '../utils/dates.js'

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' }

export default function TaskItem({ task, today, onToggle, onEdit, onDelete }) {
  const dueStatus = getDueStatus(task, today)
  const isOverdue = dueStatus === 'overdue'

  return (
    <li
      className={`task-item priority-border-${task.priority} ${
        task.completed ? 'is-completed' : ''
      } ${isOverdue ? 'is-overdue' : ''}`}
    >
      <button
        type="button"
        className="task-check"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={
          task.completed
            ? `Mark "${task.title}" as incomplete`
            : `Mark "${task.title}" as complete`
        }
      >
        {task.completed && <CheckIcon size={14} strokeWidth="3" />}
      </button>

      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>
            <span className="dot" />
            {PRIORITY_LABELS[task.priority]}
          </span>

          {task.dueDate && (
            <span className={`due-chip due-${dueStatus}`}>
              <CalendarIcon size={14} />
              {isOverdue && 'Overdue · '}
              {formatDueDate(task.dueDate, today)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(task)}
          aria-label={`Edit "${task.title}"`}
          title="Edit"
        >
          <EditIcon size={18} />
        </button>
        <button
          type="button"
          className="icon-button icon-button-danger"
          onClick={() => onDelete(task)}
          aria-label={`Delete "${task.title}"`}
          title="Delete"
        >
          <TrashIcon size={18} />
        </button>
      </div>
    </li>
  )
}
