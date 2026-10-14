import { CalendarIcon, CheckCircleIcon, ListIcon, SearchIcon, SunIcon } from './Icons.jsx'

const VIEW_MESSAGES = {
  all: {
    icon: ListIcon,
    title: 'No tasks yet',
    text: 'Start by adding your first task. It will be saved automatically.',
  },
  today: {
    icon: SunIcon,
    title: 'Nothing due today',
    text: 'You are all caught up! Enjoy your day or plan something new.',
  },
  upcoming: {
    icon: CalendarIcon,
    title: 'No upcoming tasks',
    text: 'Tasks with a future due date will show up here.',
  },
  completed: {
    icon: CheckCircleIcon,
    title: 'No completed tasks yet',
    text: 'Tick off a task and it will appear here.',
  },
}

export default function EmptyState({ view, isFiltered, onAddTask, onClearFilters }) {
  if (isFiltered) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <SearchIcon size={32} />
        </div>
        <h3>No matching tasks</h3>
        <p>Try a different search term or clear your filters.</p>
        <button type="button" className="button button-ghost" onClick={onClearFilters}>
          Clear search &amp; filters
        </button>
      </div>
    )
  }

  const { icon: ViewIcon, title, text } = VIEW_MESSAGES[view]
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ViewIcon size={32} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {view !== 'completed' && (
        <button type="button" className="button button-primary" onClick={onAddTask}>
          Add a task
        </button>
      )}
    </div>
  )
}
