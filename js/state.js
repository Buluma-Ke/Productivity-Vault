import { saveState } from "./storage.js"

export const state = {
    habits: []
};


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