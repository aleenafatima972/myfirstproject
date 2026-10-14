# TaskFlow – Smart To-Do List

TaskFlow is a clean, modern and responsive to-do list web app built with **React**, **Vite**, **JavaScript** and plain **CSS**, using a lavender / purple theme. Your tasks are saved in the browser with `localStorage`, so they are still there after you refresh or reopen the page.

## Features

- **Add, edit and delete tasks.** Deleting asks for confirmation first.
- **Mark tasks complete or incomplete** with one click.
- **Priorities:** High, Medium and Low, each with its own colour.
- **Due dates** with friendly labels (Today, Tomorrow, Oct 20, 2026) and red **overdue** indicators.
- **Search** by title or description.
- **Filters:** by priority and status, plus sorting by due date, priority or newest.
- **Views:**
  - **All Tasks:** everything on your list
  - **Today:** tasks due today, plus overdue tasks
  - **Upcoming:** tasks with a future due date
  - **Completed:** finished tasks
- **Statistics:** total, in progress, completed and overdue counts, plus a progress bar.
- **Saved automatically** in `localStorage`.
- **Empty states** for every view and for searches with no results.
- **Form validation:**
  - The title is required and must be 3 to 100 characters.
  - The description can be at most 300 characters.
  - New tasks cannot have a due date in the past.
- **Responsive design:**
  - On desktop, a sidebar is always visible.
  - On mobile, the sidebar becomes a slide-out menu and a floating "+" button appears.

## Requirements

- [Node.js](https://nodejs.org/) version 20.19 or newer (it comes with `npm`)

Check your versions:

```bash
node -v
npm -v
```

## Getting started

Open a terminal in the project folder (in VS Code, choose **Terminal → New Terminal**), then:

```bash
# 1. Install dependencies (only needed the first time)
npm install

# 2. Start the development server
npm run dev
```

Then open **http://localhost:5177** in your browser. Press `Ctrl + C` in the terminal to stop the server.

## Available scripts

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Starts the development server with live reload       |
| `npm run build`   | Creates an optimised production build in `dist/`     |
| `npm run preview` | Serves the production build locally to test it       |

## Project structure

```
├── index.html               # HTML page that loads the app
├── package.json             # Project info, scripts and dependencies
├── vite.config.js           # Vite configuration
├── public/
│   └── favicon.svg          # Browser tab icon
└── src/
    ├── main.jsx             # Entry point – mounts <App /> into the page
    ├── App.jsx              # Main component: state, views, add/edit/delete logic
    ├── index.css            # All styles (theme colours are CSS variables at the top)
    ├── components/
    │   ├── Sidebar.jsx      # Logo, navigation views and counts
    │   ├── StatsPanel.jsx   # Statistic cards and progress bar
    │   ├── Toolbar.jsx      # Search box, filters and sorting
    │   ├── TaskItem.jsx     # A single task row
    │   ├── TaskForm.jsx     # Add / edit form with validation
    │   ├── Modal.jsx        # Reusable popup window
    │   ├── ConfirmDialog.jsx# "Are you sure?" dialog for deleting
    │   ├── EmptyState.jsx   # Messages shown when a list is empty
    │   └── Icons.jsx        # Small SVG icon set
    ├── hooks/
    │   └── useLocalStorage.js # useState that also saves to localStorage
    └── utils/
        ├── dates.js         # Date helpers (today, overdue, formatting)
        └── tasks.js         # Filtering, sorting and statistics helpers
```

## How the data is stored

Tasks are saved in your browser's `localStorage` under the key `taskflow.tasks`. This means:

- The data stays on **your computer, in that browser only**.
- Clearing your browser's site data will delete your tasks.

To reset the app, open the browser DevTools (`F12`), go to **Application → Local Storage → http://localhost:5177**, and delete the `taskflow.tasks` key.

## Customising the theme

All colours are defined as CSS variables at the top of `src/index.css` (for example `--purple-600`). Change them there to restyle the whole app.

## Tech stack

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- JavaScript (ES modules)
- CSS (no UI framework)
