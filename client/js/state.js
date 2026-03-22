import { getVault, saveVault } from "./helpers.js";
import { render } from "./render.js";
// import { saveState, loadState } from "./storage.js"

// state.js
export const state = {
    habits: [],
    tasks: [],
    projects: [],

    // method to load state from server
    async load() {
        try {
            const response = await fetch("http://localhost:3000/state");
            if (!response.ok) throw new Error("Server error");

            const data = await response.json();

            // populate the state object
            this.habits = data.habits;
            this.tasks = data.tasks;
            this.projects = data.projects;

            return this; // optional, so you can chain or await

        } catch (err) {
            console.error("Failed to load state", err);
            this.habits = [];
            this.tasks = [];
            this.projects = [];
            return this;
        }
    }
};

export async function saveState(state) {
    await fetch("http://localhost:3000/state" ,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(state)
    });
}
// drop tasks

export function deleteTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveState(state);
}

export function deleteHabit(habitId) {
    state.habits = state.habits.filter(h => h.id !== habitId);
    saveState(state);
}

export function deleteProject(projectId) {
    state.projects = state.projects.filter(p => p.id !== projectId);
    saveState(state);
}


// -------------
// HABITS
// -------------

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

export function addTask({ title, dueDate, projectId }) {
    const Task = {
        id: crypto.randomUUID(),
        title,
        dueDate,
        completed: false,

        projectId
    };
    state.tasks.push(Task);
    saveState(state);
}

// ✅ fixed — updates state and persists to server
export function toggleTaskComplete(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveState(state);
}

// -------------
// PROJECTS
// -------------
export function addProject({ title, deadline }) {
    const Project = {
        id: crypto.randomUUID(),
        title,
        deadline
    };
    state.projects.push(Project);
    saveState(state);
}
