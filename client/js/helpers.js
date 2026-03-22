import { state } from "./state.js";
// Vault Helpers

export function getVault(){
    return JSON.parse(localStorage.getItem("productivity-vault")) ||
    {
        habits: [],
        projects: [],
        tasks: []
    };
}

export function saveVault(vault){
    localStorage.setItem("productivity-vault", JSON.stringify(vault));
}


// STREAKS COUNTER

export function getStreak(habit){
    if(!habit.completions.length) return 0;

    const completionSet = new Set(habit.completions);

    // Normalize today
    let today = new Date();
    today = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const todayISO = today.toISOString().split('T')[0];

    // if today not completed -> immediate 0
    if (!completionSet.has(todayISO)){
        return 0;
    }

    let streak = 0;
    let current = today;

    while(true) {
        const iso = current.toISOString().split('T')[0];

        if (completionSet.has(todayISO)){
            streak++;
            current.setDate(current.getDate() - 1);
        }else {
            break;
        }
    }

    return streak
}

// ---------------
// WEEKLY PROGRESS
// ---------------

// was completed in the last 7 days
export function getWeeklProgress(habit) {
    const completions = new Set(habit.completions);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time (hrs, mns, sec)

    let completed = 0;

    for (let i = 0; i < 7; i++){
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const iso = day.toISOString().split("T")[0];

        if(completions.has(iso)){
            completed++;
        }
    }

    return {
        completed: completed,
        total: 7,
        percentage: (completed / 7) * 100
    }
}



export function taskWarning(task){
    const today = new Date();

    const day = today.toISOString().split("T")[0];

    if(task.dueDate === day){
        return 'Today !!'
    } else {
        return task.dueDate
    }
}

// -----------------
// Auto task counts
// -----------------

function getAllTasks(){
    return state.tasks || [];
}

// filter tasks that belong to a project

function getProjectById(projectId) { // your central object
  return state.projects.find(p => p.id === projectId);
}

function getDaysRemaining(deadline) {
  if (!deadline) return null;

  const today = new Date();
  const due = new Date(deadline);

  // Normalize both to LOCAL midnight (prevents timezone drift)
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

function getTaskForProject(projectId){
    const tasks = getAllTasks();

    return tasks.filter(task => task.projectId === projectId);

}

export function getProjectStats(projectId) {
  const projectTasks = getTaskForProject(projectId);
  const project = getProjectById(projectId);

  const total = projectTasks.length;

  const completed = projectTasks.filter(task => task.completed === true).length;

  const incomplete = total - completed;

  // 📅 Time calculation
  const daysRemaining = project?.deadline
    ? getDaysRemaining(project.deadline)
    : null;

  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return {
    total,
    completed,
    incomplete,
    daysRemaining,
    isOverdue
  };
}


// HABIT-STATISTICS

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust to Monday
  return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
  const start = getWeekStart(date);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
}

function filterCompletionsThisWeek(habitId, completions, referenceDate = new Date()) {
  const weekStart = getWeekStart(referenceDate);
  const weekEnd = getWeekEnd(referenceDate);

  return completions
    .filter(c => c.habitId === habitId)
    .filter(c => {
      const cDate = new Date(c.date);
      return cDate >= weekStart && cDate <= weekEnd;
    });
}

export function calculateHabitStats(habit, referenceDate = new Date()) {
    const completionSet = new Set(habit.completions); // completions are date strings

    const weekStart = getWeekStart(referenceDate);
    const weekEnd = getWeekEnd(referenceDate);

    let completedThisWeek = 0;
    let missedDays = 0;

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);

        // Don't count future days as missed
        if (day > referenceDate) break;

        const iso = day.toISOString().split('T')[0];

        if (completionSet.has(iso)) {
            completedThisWeek++;
        } else {
            missedDays++;
        }
    }

    return {
        completedThisWeek,
        missedDays,
        streak: getStreak(habit)  // reuse your existing streak helper
    };
}


export function getPerformanceData() {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // Week number
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((today - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);

    // Today's tasks
    const todayTasks = state.tasks.filter(t => t.dueDate === todayISO);
    const completedToday = todayTasks.filter(t => Boolean(t.completed));

    // Overdue (before today, not completed)
    const overdueTasks = state.tasks.filter(t => t.dueDate < todayISO && !Boolean(t.completed));

    // Overdue last 7 days
    const lastWeekISO = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
    const overdueLastWeek = state.tasks.filter(t =>
        t.dueDate >= lastWeekISO &&
        t.dueDate < todayISO &&
        !Boolean(t.completed)
    );

    // Upcoming this month (after today, before end of month)
    const endOfMonthISO = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString().split('T')[0];
    const upcomingThisMonth = state.tasks.filter(t =>
        t.dueDate > todayISO &&
        t.dueDate <= endOfMonthISO &&
        !Boolean(t.completed)
    );

    return {
        weekNum,
        todayTasks,
        completedToday,
        overdueTasks,
        overdueLastWeek,
        upcomingThisMonth
    };
}



// habit progress bar ad color

// Assigns a random progress bar color on creation, seeded by habit id
export function getHabitColor(habitId) {
    const colors = ['blue', 'green', 'orange', 'yellow'];
    // Use the id string to consistently return the same color for the same habit
    const index = habitId.charCodeAt(0) % colors.length;
    return colors[index];
}

// Returns progress within the current 7-day window starting from startDate
export function getWeeklyWindowProgress(habit) {
    const start = new Date(habit.startDate);
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // How many days since the habit started (capped at 7)
    const daysSinceStart = Math.floor((today - start) / 86400000);
    const currentWeekIndex = Math.floor(daysSinceStart / 7); // which 7-day window we're in

    const windowStart = new Date(start);
    windowStart.setDate(start.getDate() + currentWeekIndex * 7);

    const completionSet = new Set(habit.completions);
    let completed = 0;

    for (let i = 0; i < 7; i++) {
        const day = new Date(windowStart);
        day.setDate(windowStart.getDate() + i);
        if (day > today) break;
        const iso = day.toISOString().split('T')[0];
        if (completionSet.has(iso)) completed++;
    }

    return {
        completed,
        total: 7,
        percentage: Math.round((completed / 7) * 100)
    };
}


// isArchived

export function isArchived(task) {
    if (!task.completed || !task.completedAt) return false;
    const completedAt = new Date(task.completedAt);
    const now = new Date();
    const diffHrs = (now - completedAt) / (1000 * 60 * 60);
    return diffHrs >= 24;
}

export function isProjectArchived(project) {
    if (!project.completedAt) return false;
    const completedAt = new Date(project.completedAt);
    const now = new Date();
    const diffHrs = (now - completedAt) / (1000 * 60 * 60);
    return diffHrs >= 24;
}