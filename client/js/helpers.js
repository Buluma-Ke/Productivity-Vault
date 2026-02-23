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
