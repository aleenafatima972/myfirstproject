import { CloseIcon, SearchIcon } from './Icons.jsx'

export default function Toolbar({ search, onSearchChange, filters, onFiltersChange, showStatusFilter }) {
  function update(name, value) {
    onFiltersChange({ ...filters, [name]: value })
  }

  return (
    <div className="toolbar">
      <div className="search-box">
        <SearchIcon size={18} />
        <input
          type="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search tasks"
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>

      <div className="filters">
        <select
          value={filters.priority}
          onChange={(event) => update('priority', event.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        {showStatusFilter && (
          <select
            value={filters.status}
            onChange={(event) => update('status', event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        )}

        <select
          value={filters.sortBy}
          onChange={(event) => update('sortBy', event.target.value)}
          aria-label="Sort tasks"
        >
          <option value="dueDate">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>
    </div>
  )
}
