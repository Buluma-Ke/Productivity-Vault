# Productivity Vault - Habit Tracker

A simple habit tracker web app built with **Vanilla JavaScript**, **Node.js**, and **SQLite**.  
Track your habits, mark completions, see weekly progress, and measure streaks.

---

## Features

- Add, view, and delete habits
- Track daily habit completions
- Rolling 7-day progress bar
- Streak calculation for each habit
- Calendar view of habit completions
- Local persistence via SQLite

---

## Technologies Used

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Helpers:** `helpers.js` for logic (streaks, progress)
- **State Management:** `state.js` for storing the minimal truth

---

## Project Structure
```text
habit-tracker/
├── client/
│ ├── index.html
│ ├── app.js # Main frontend JS
│ ├── render.js # DOM rendering
│ ├── state.js # Application state
│ └── helpers.js # Calculations (streaks, progress)
├── server/
│ ├── server.js # Node + Express backend
│ ├── db.js # SQLite database connection
│ └── habits.db # SQLite database file
└── README.md
```

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/productivity-vault.git
cd productivity-vault
```

### 2. Install backend dependancies
```bash
cd server
npm install
```
### 3. Start the backend server
```bash
npx nodemon server.js
```
The API will run at http://localhost:3000.

###  4. Open frontend

- Open client/index.html in your browser
- Make sure your backend server is running
- Add habits and track completions

## How It Works

State: state.js keeps the “truth” (habits + completions)

Helpers: helpers.js computes streaks, rolling 7-day progress, and other analytics

Render: render.js updates the DOM based on state + helper calculations

Backend API: Node.js + SQLite persist your habits and completions

Frontend: Uses fetch to communicate with the backend API


## Example Usage

Add a new habit: Click “Add New Habit”, enter name, start date, frequency.

Mark a habit complete: Click “Mark as Complete” on the tracking card.

View progress: See your streak and rolling 7-day progress on the habit card.

## Future Improvements

User authentication for multiple users

Custom habit frequency (e.g., 3x/week)

Notifications / reminders

Graphs for long-term progress
