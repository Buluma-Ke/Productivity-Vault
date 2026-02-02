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