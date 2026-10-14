import { CheckIcon, CloseIcon, PlusIcon } from './Icons.jsx'

export default function Sidebar({ views, activeView, counts, isOpen, onSelectView, onAddTask, onClose, progress }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-logo">
              <CheckIcon size={20} strokeWidth="3" />
            </div>
            <span className="brand-name">TaskFlow</span>
          </div>
          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <button type="button" className="button button-primary button-block" onClick={onAddTask}>
          <PlusIcon size={18} />
          Add task
        </button>

        <nav className="nav" aria-label="Task views">
          {views.map(({ id, label, icon: ViewIcon }) => (
            <button
              key={id}
              type="button"
              className={`nav-item ${activeView === id ? 'active' : ''}`}
              onClick={() => onSelectView(id)}
              aria-current={activeView === id ? 'page' : undefined}
            >
              <ViewIcon size={18} />
              <span>{label}</span>
              <span className="nav-count">{counts[id]}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-footer-title">Daily focus</p>
          <div className="mini-progress">
            <div className="mini-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="sidebar-footer-text">{progress}% of all tasks done</p>
        </div>
      </aside>
    </>
  )
}
