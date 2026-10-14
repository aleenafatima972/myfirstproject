import { AlertIcon, CheckCircleIcon, ListIcon, SunIcon } from './Icons.jsx'

export default function StatsPanel({ stats }) {
  const cards = [
    { label: 'Total tasks', value: stats.total, icon: ListIcon, tone: 'purple' },
    { label: 'In progress', value: stats.active, icon: SunIcon, tone: 'blue' },
    { label: 'Completed', value: stats.completed, icon: CheckCircleIcon, tone: 'green' },
    { label: 'Overdue', value: stats.overdue, icon: AlertIcon, tone: 'red' },
  ]

  return (
    <section className="stats" aria-label="Task statistics">
      <div className="stat-cards">
        {cards.map(({ label, value, icon: CardIcon, tone }) => (
          <div key={label} className={`stat-card tone-${tone}`}>
            <div className="stat-icon">
              <CardIcon size={20} />
            </div>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-card">
        <div className="progress-header">
          <span>Overall progress</span>
          <strong>{stats.progress}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={stats.progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Tasks completed"
        >
          <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
        </div>
        <p className="progress-caption">
          {stats.total === 0
            ? 'Add tasks to start tracking your progress.'
            : stats.progress === 100
              ? 'Amazing! Every task is done. 🎉'
              : `${stats.completed} of ${stats.total} tasks completed`}
        </p>
      </div>
    </section>
  )
}
