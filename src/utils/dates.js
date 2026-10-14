// Dates are stored as "YYYY-MM-DD" strings (local time), which makes
// comparing them as simple as comparing strings.

export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function addDays(key, days) {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

// Friendly label: "Today", "Tomorrow", "Yesterday" or "Oct 20, 2026"
export function formatDueDate(key, today = todayKey()) {
  if (!key) return ''
  if (key === today) return 'Today'
  if (key === addDays(today, 1)) return 'Tomorrow'
  if (key === addDays(today, -1)) return 'Yesterday'
  return fromDateKey(key).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// Returns 'overdue' | 'today' | 'upcoming' | 'none'
export function getDueStatus(task, today = todayKey()) {
  if (!task.dueDate) return 'none'
  if (task.completed) return task.dueDate === today ? 'today' : 'upcoming'
  if (task.dueDate < today) return 'overdue'
  if (task.dueDate === today) return 'today'
  return 'upcoming'
}
