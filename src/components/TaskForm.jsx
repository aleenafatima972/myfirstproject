import { useState } from 'react'
import Modal from './Modal.jsx'
import { PRIORITIES } from '../utils/tasks.js'
import { todayKey } from '../utils/dates.js'

const TITLE_MAX = 100
const DESCRIPTION_MAX = 300

function validate(values, initialTask) {
  const errors = {}
  const title = values.title.trim()

  if (!title) {
    errors.title = 'Task title is required.'
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.'
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be ${TITLE_MAX} characters or less.`
  }

  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or less.`
  }

  if (!PRIORITIES.some((p) => p.value === values.priority)) {
    errors.priority = 'Please choose a priority.'
  }

  // A past date is not allowed for new tasks. When editing, an existing
  // (now overdue) date may be kept, but not changed to another past date.
  const dateUnchanged = initialTask && values.dueDate === initialTask.dueDate
  if (values.dueDate && values.dueDate < todayKey() && !dateUnchanged) {
    errors.dueDate = 'Due date cannot be in the past.'
  }

  return errors
}

export default function TaskForm({ initialTask, onSubmit, onClose }) {
  const isEditing = Boolean(initialTask)
  const [values, setValues] = useState({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    priority: initialTask?.priority ?? 'medium',
    dueDate: initialTask?.dueDate ?? '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Errors only show after the first submit attempt, then update live
  const errors = submitted ? validate(values, initialTask) : {}

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values, initialTask)).length > 0) return

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate,
    })
  }

  return (
    <Modal title={isEditing ? 'Edit task' : 'Add a new task'} onClose={onClose}>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Finish the project report"
            value={values.title}
            onChange={handleChange}
            className={errors.title ? 'has-error' : ''}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            autoFocus
            autoComplete="off"
          />
          {errors.title && (
            <p className="field-error" id="title-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            placeholder="Add some details (optional)"
            value={values.description}
            onChange={handleChange}
            className={errors.description ? 'has-error' : ''}
            aria-invalid={Boolean(errors.description)}
          />
          <div className="field-footer">
            {errors.description ? (
              <p className="field-error">{errors.description}</p>
            ) : (
              <span />
            )}
            <span
              className={`char-count ${
                values.description.trim().length > DESCRIPTION_MAX ? 'over' : ''
              }`}
            >
              {values.description.trim().length}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <span className="label">Priority</span>
            <div className="priority-picker" role="radiogroup" aria-label="Priority">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className={`priority-option priority-${p.value} ${
                    values.priority === p.value ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={values.priority === p.value}
                    onChange={handleChange}
                  />
                  <span className="dot" />
                  {p.label}
                </label>
              ))}
            </div>
            {errors.priority && <p className="field-error">{errors.priority}</p>}
          </div>

          <div className="field">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={values.dueDate}
              min={isEditing ? undefined : todayKey()}
              onChange={handleChange}
              className={errors.dueDate ? 'has-error' : ''}
              aria-invalid={Boolean(errors.dueDate)}
            />
            {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            {isEditing ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
