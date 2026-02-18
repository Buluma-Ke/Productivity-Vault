import { getVault, saveVault } from "./helpers.js";
import { render } from "./render.js";
import { saveState, loadState } from "./storage.js"

export const state = {
    habits: [],
    tasks: [],
    projects: []
};

// export const state = loadState();



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

export function addTask({ name, dueDate, projectId }) {
    const Task = {
        id: crypto.randomUUID(),
        name,
        dueDate,
        completed: false,

        projectId
    };
    console.log(state.tasks);
    state.tasks.push(Task);
    saveState(state);
}

export function toggleTaskComplete(taskId) {
    const vault = getVault()
    // Find the Task ID;
    vault.tasks = vault.tasks.map(task => {
        if(task.id === taskId){
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });

    saveVault(vault);

    // renderTasks();
    // renderProjects();

}   

// -------------
// PROJECTS
// -------------

      
export function addProject({ projectName,  projectDueDate}) {
    console.log(projectName);
    console.log(projectDueDate);
    const Project = {
        id: crypto.randomUUID(),
        projectName,
        projectDueDate
    };
    // console.log(state.tasks);
    console.log(projectName);
    console.log(projectDueDate);
    state.projects.push(Project);
    saveState(state);
}
