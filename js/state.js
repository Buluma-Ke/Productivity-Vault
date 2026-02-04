import { saveState, loadState } from "./storage.js"

export const state = {
    habits: [],
    tasks: []
};

// export const state = loadState();


export function addHabit({ name, startDate, frequency }) {
    const Habit = {
        id: crypto.randomUUID(),
        name,
        startDate,
        frequency,
        completions: []
    };

    state.habits.push(Habit);
    saveState(state);
}

export function markComplete(habitId) {
    // Find the Habit ID;
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const today = new Date().toISOString().split('T')[0];
    console.log(today)

    // only add if not completed today
    if (!habit.completions.includes(today)){
        habit.completions.push(today);
        saveState(state);
    }
}


//----------------
// TASKS
//----------------

export function addTask({ name, dueDate }) {
    const Task = {
        id: crypto.randomUUID(),
        name,
        dueDate,
        completed: false
    };
    console.log(state.tasks);
    state.tasks.push(Task);
    saveState(state);
}

export function markTaskCompleted(taskId) {
    // Find the Task ID;
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return null;

    if (task.completed){
        task.completed = true;
        saveState(state);
    }
}