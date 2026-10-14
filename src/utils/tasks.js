export const PRIORITIES = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function matchesView(task, view, today) {
  switch (view) {
    case 'today':
      // Due today, plus anything overdue that still needs doing
      return !task.completed && Boolean(task.dueDate) && task.dueDate <= today
    case 'upcoming':
      return !task.completed && Boolean(task.dueDate) && task.dueDate > today
    case 'completed':
      return task.completed
    default:
      return true
  }
}

export function matchesSearch(task, search) {
  const query = search.trim().toLowerCase()
  if (!query) return true
  return (
    task.title.toLowerCase().includes(query) ||
    task.description.toLowerCase().includes(query)
  )
}

export function matchesFilters(task, { priority, status }) {
  if (priority !== 'all' && task.priority !== priority) return false
  if (status === 'active' && task.completed) return false
  if (status === 'completed' && !task.completed) return false
  return true
}

function compareDueDate(a, b) {
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
  if (a.dueDate) return -1
  if (b.dueDate) return 1
  return 0
}

export function sortTasks(tasks, sortBy) {
  return [...tasks].sort((a, b) => {
    // Unfinished tasks always come before finished ones
    if (a.completed !== b.completed) return a.completed ? 1 : -1

    if (sortBy === 'priority') {
      const diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      if (diff !== 0) return diff
      return compareDueDate(a, b)
    }
    if (sortBy === 'newest') {
      return b.createdAt - a.createdAt
    }
    // Default: by due date, then priority
    const diff = compareDueDate(a, b)
    if (diff !== 0) return diff
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  })
}

export function getStats(tasks, today) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const overdue = tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate < today,
  ).length
  return {
    total,
    completed,
    active: total - completed,
    overdue,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}
