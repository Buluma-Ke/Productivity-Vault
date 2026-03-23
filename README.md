# Productivity Vault - Habit Tracker

A simple habit tracker web app built with **Vanilla JavaScript**, **Node.js**, and **SQLite**.
Track your habits, tasks and projects, mark completions, see weekly progress, and measure streaks.

---

## Features

- Add, view, and delete habits, tasks and projects
- Track daily habit completions
- Rolling 7-day progress bar per habit
- Streak calculation for each habit
- Calendar view of habit completions
- Task filtering — All, Today, This Week, Completed, Archive
- Project manager with completion tracking and archive
- Performance overview in the sidebar
- Weekly calendar with task due dates
- Local persistence via SQLite

---

## Technologies Used

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Helpers:** `helpers.js` for logic (streaks, progress, stats)
- **State Management:** `state.js` for storing the minimal truth

---

## Project Structure

```text
habit-tracker/
├── client/
│   ├── index.html
│   ├── app.js          # Main frontend JS & event listeners
│   ├── render.js       # DOM rendering
│   ├── state.js        # Application state & data mutations
│   └── helpers.js      # Calculations (streaks, progress, stats)
├── server/
│   ├── server.js       # Node + Express backend
│   ├── db.js           # SQLite database connection
│   └── habits.db       # SQLite database file
├── package.json
└── README.md
```

---

## Getting Started

### Requirements
- Node.js v18+

### 1. Clone the repository

```bash
git clone https://github.com/Buluma-Ke/Productivity-Vault.git
cd Productivity-Vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm run dev
```

This boots the Express backend and serves the frontend at http://localhost:3000. Open http://localhost:3000 in your browser.

---

## Optional — Run from anywhere in your terminal

### Mac/Linux

Add this to your `~/.zshrc` or `~/.bashrc`:

```bash
alias habittracker="cd /full/path/to/habit-tracker && npm run dev"
```

Reload your shell:

```bash
source ~/.zshrc
```

Now you can run `habittracker` from anywhere.

### Windows

1. Create a folder for personal scripts, e.g. `C:\Users\YourName\scripts\`
2. Create a file called `habittracker.bat` inside it:

```bat
@echo off
cd /d C:\full\path\to\habit-tracker
npm run dev
```

3. Add that folder to your PATH:
   - Search **"Environment Variables"** in the Start menu
   - Under User variables → find `Path` → Edit → New
   - Paste `C:\Users\YourName\scripts` → OK

4. Open a **new** terminal and run:

```bat
habittracker
```

> Note: replace `/full/path/to/habit-tracker` with wherever you cloned the repo.

---

## How It Works

- **State:** `state.js` keeps the source of truth (habits, tasks, projects, completions)
- **Helpers:** `helpers.js` computes streaks, rolling 7-day progress, performance stats, and archive logic
- **Render:** `render.js` updates the DOM based on state and helper calculations
- **Backend API:** Node.js + Express + SQLite persist everything server-side
- **Frontend:** Uses `fetch` to communicate with the backend API

---

## Example Usage

- **Add a habit:** Click "+ Add New Habit" in the sidebar or the placeholder card
- **Mark a habit complete:** Click "Mark as Complete" on the tracking card
- **View progress:** See your streak and rolling 7-day progress bar on each habit card
- **Add a task:** Click "+ Add New Task" and assign a due date and optional project
- **Filter tasks:** Use the tab menu — All, Today, This Week, Completed, Archive
- **Add a project:** Click "+ Add New Project" and set a deadline
- **Mark a project complete:** Click "Mark complete" on the project card

---

## Future Improvements

- User authentication for multiple users
- Custom habit frequency (e.g., 3x/week)
- Notifications and reminders
- Graphs for long-term progress
- Electron wrapper for desktop app (no terminal needed)
