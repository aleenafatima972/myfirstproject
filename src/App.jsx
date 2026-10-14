import { useCallback, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import Toolbar from './components/Toolbar.jsx'
import TaskItem from './components/TaskItem.jsx'
import TaskForm from './components/TaskForm.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import EmptyState from './components/EmptyState.jsx'
import { CalendarIcon, CheckCircleIcon, ListIcon, MenuIcon, PlusIcon, SunIcon } from './components/Icons.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { formatLongDate, todayKey } from './utils/dates.js'
import {
  createId,
  getStats,
  matchesFilters,
  matchesSearch,
  matchesView,
  sortTasks,
} from './utils/tasks.js'

const VIEWS = [
  { id: 'all', label: 'All Tasks', icon: ListIcon, subtitle: 'Everything on your list' },
  { id: 'today', label: 'Today', icon: SunIcon, subtitle: 'Due today and overdue tasks' },
  { id: 'upcoming', label: 'Upcoming', icon: CalendarIcon, subtitle: 'Tasks planned for later' },
  { id: 'completed', label: 'Completed', icon: CheckCircleIcon, subtitle: 'Tasks you have finished' },
]

const DEFAULT_FILTERS = { priority: 'all', status: 'all', sortBy: 'dueDate' }

export default function App() {
  const [storedTasks, setTasks] = useLocalStorage('taskflow.tasks', [])
  const [view, setView] = useState('all')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [formState, setFormState] = useState(null) // null | { task: Task | null }
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Guard against broken data in localStorage
  const tasks = Array.isArray(storedTasks) ? storedTasks : []
  const today = todayKey()

  const stats = useMemo(() => getStats(tasks, today), [tasks, today])

  const counts = useMemo(
    () =>
      Object.fromEntries(
        VIEWS.map(({ id }) => [id, tasks.filter((t) => matchesView(t, id, today)).length]),
      ),
    [tasks, today],
  )

  // The status filter only applies to the "All Tasks" view
  const effectiveFilters = useMemo(
    () => (view === 'all' ? filters : { ...filters, status: 'all' }),
    [view, filters],
  )

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) =>
        matchesView(task, view, today) &&
        matchesSearch(task, search) &&
        matchesFilters(task, effectiveFilters),
    )
    return sortTasks(filtered, effectiveFilters.sortBy)
  }, [tasks, view, today, search, effectiveFilters])

  const viewTasksCount = counts[view]
  const isFiltered =
    viewTasksCount > 0 &&
    (search.trim() !== '' ||
      effectiveFilters.priority !== 'all' ||
      effectiveFilters.status !== 'all')

  const currentView = VIEWS.find((v) => v.id === view)

  // ----- Task actions -----

  function addTask(data) {
    const newTask = {
      id: createId(),
      ...data,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
    }
    setTasks((current) => [newTask, ...(Array.isArray(current) ? current : [])])
  }

  function updateTask(id, data) {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, ...data } : t)))
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: t.completed ? null : Date.now() }
          : t,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((t) => t.id !== id))
  }

  // ----- UI handlers -----

  const openAddForm = () => {
    setFormState({ task: null })
    setSidebarOpen(false)
  }
  const openEditForm = (task) => setFormState({ task })
  const closeForm = useCallback(() => setFormState(null), [])
  const closeDeleteDialog = useCallback(() => setTaskToDelete(null), [])

  function handleFormSubmit(data) {
    if (formState?.task) {
      updateTask(formState.task.id, data)
    } else {
      addTask(data)
    }
    setFormState(null)
  }

  function handleConfirmDelete() {
    deleteTask(taskToDelete.id)
    setTaskToDelete(null)
  }

  function selectView(id) {
    setView(id)
    setSidebarOpen(false)
  }

  function clearFilters() {
    setSearch('')
    setFilters(DEFAULT_FILTERS)
  }

  return (
    <div className="app">
      <Sidebar
        views={VIEWS}
        activeView={view}
        counts={counts}
        isOpen={sidebarOpen}
        onSelectView={selectView}
        onAddTask={openAddForm}
        onClose={() => setSidebarOpen(false)}
        progress={stats.progress}
      />

      <main className="main">
        <header className="page-header">
          <button
            type="button"
            className="icon-button menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="page-heading">
            <p className="page-date">{formatLongDate()}</p>
            <h1>{currentView.label}</h1>
            <p className="page-subtitle">{currentView.subtitle}</p>
          </div>
          <button type="button" className="button button-primary header-add" onClick={openAddForm}>
            <PlusIcon size={18} />
            <span>New task</span>
          </button>
        </header>

        <StatsPanel stats={stats} />

        <section className="task-section" aria-label={`${currentView.label} list`}>
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            filters={filters}
            onFiltersChange={setFilters}
            showStatusFilter={view === 'all'}
          />

          {visibleTasks.length > 0 ? (
            <>
              <p className="results-count">
                Showing {visibleTasks.length} of {viewTasksCount}{' '}
                {viewTasksCount === 1 ? 'task' : 'tasks'}
              </p>
              <ul className="task-list">
                {visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    today={today}
                    onToggle={toggleTask}
                    onEdit={openEditForm}
                    onDelete={setTaskToDelete}
                  />
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              view={view}
              isFiltered={isFiltered}
              onAddTask={openAddForm}
              onClearFilters={clearFilters}
            />
          )}
        </section>
      </main>

      <button
        type="button"
        className="fab"
        onClick={openAddForm}
        aria-label="Add a new task"
      >
        <PlusIcon size={24} />
      </button>

      {formState && (
        <TaskForm
          key={formState.task?.id ?? 'new'}
          initialTask={formState.task}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${taskToDelete.title}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onClose={closeDeleteDialog}
        />
      )}
    </div>
  )
}
