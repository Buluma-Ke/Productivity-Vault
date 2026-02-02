import {state} from "./state.js";

export function render(){
    renderHabits();
}

function renderHabits() {
    const habitGrid = document.getElementById("habit_grid");
    const trackGrid = document.getElementById("trackhabit_grid");

    habitGrid.innerHTML = "";
    trackGrid.innerHTML = "";

    state.habits.forEach(habit => {
        renderHabitCard(habit, habitGrid)
        renderHabitTrack(habit, trackGrid)
    });
}

function renderHabitCard(habit, container){
    const card = document.createElement("div");
    card.className = "habit-card";

    card.innerHTML = `
        <h4>${habit.name}</h4>
        <div class="frequency">Weekly: ${habit.timesPerWeek}x</div>
        <div class="habit-calender"></div>
    `;

    container.appendChild(card);
}

function renderHabitTrack(habit, container){
    const card = document.createElement("div");
    card.className = "habit-card";

    card.innerHTML = `
        <h4>${habit.name}</h4>
        <button data-id="${habit.name}">Mark as Complete</button>
        <div class="track-grid"></div>
    
    `;

    container.appendChild(card)
}
