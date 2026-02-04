import {state} from "./state.js";
import {getStreak, taskWarning } from "./helpers.js"



//-------------------------------------------------------------------
// Cache Daily tracking grid onfirst load

let dayLabelsTemplate = null;

function cacheDayLabelsTemplate(){
    if(!dayLabelsTemplate) {
    const template = document.getElementById("day-labels-template");
    if(template) {
        dayLabelsTemplate = template.content.cloneNode(true);
    }
    }
}
// ------------------------------------------------------------------


export function showHabitModal(){
    document.getElementById('habitModal').style.display = "flex";
    document.getElementById("app").classList.add("blurred");
}

export function hideHabitModal(){
    document.getElementById('habitModal').style.display = "none";
    document.getElementById("app").classList.remove("blurred");
}



// Main render function
export function render(){
    cacheDayLabelsTemplate(); // Cache template on first render
    renderHabits();
    renderGrid();
    renderTasks();
}




function renderHabits() {
    const habitGrid = document.getElementById("habit_grid");
    const trackGrid = document.getElementById("trackhabit_grid");

    if(!habitGrid || !trackGrid) return;

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
        <div class="frequency">🎯 Weekly: ${habit.frequency}x</div>
        <div class="habit-calender"></div>
        <div>
            <p>Completed Today</p>
            <div class="progress-div">
                Progress - <div class="cntainer">
                                <div class="progress-bar" id="myBar"></div>
                            </div>
                <p id="label">0%</p>
            </div>
            <p>Streak 🔥${getStreak(habit)} days</p>
        </div>


    `;

    container.appendChild(card);

    // Render calender calender grid inside the card
    const calendarGrid = card.querySelector(".habit-calender");
    renderCalendar(calendarGrid, habit);

}

//------------------------------
// habit tracking grid (heatmap)
// -----------------------------


// day labels
function cloneDayLabels(){

    if (dayLabelsTemplate){
        return dayLabelsTemplate.cloneNode(true);
    }
   // console.log("template found:", dayLabelsTemplate)
   console.error("Day label template not found");
}

const today = new Date();
const todaysDate = today.toLocaleDateString('en-GB', {
    day   : 'numeric',
    month : 'long',
    year  : 'numeric'
});

function renderHabitTrack(habit, container){
    const card = document.createElement("article");
    card.className = "habit-card";


    card.innerHTML = `
        <h4>${habit.name}</h4>
        <button data-habit-id=${habit.id} class="complete-btn">Mark as complete</button>
    `;


    const Wfrequency = document.createElement('p');
    Wfrequency.textContent = `🎯Weekly:${habit.frequency}x`;

    const date = document.createElement('p');
    date.textContent = `📆Today is: ${todaysDate}`;

    const wrapper = document.createElement("div");
    wrapper.className = "habit-graph-wrapper";

    const grid = document.createElement("div");
    grid.className = "track-grid";

    wrapper.appendChild(cloneDayLabels());
    wrapper.appendChild(grid);

    // card.appendChild(title);
    // card.appendChild(button);
    card.appendChild(Wfrequency);
    card.appendChild(date);
    card.appendChild(wrapper); // template


    container.appendChild(card);

    //Render tracking grid inside this card
    renderGrid(grid, habit);
}


// ----------------------
// Calendar rendering
// ----------------------

function renderCalendar(container, habit) {
    if(!container) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstday = new Date(year, month, 1);
    const lastday = new Date(year, month + 1, 0);
    const daysInMonth = lastday.getDate();
    const firstDayIndex = firstday.getDay();

    container.innerHTML = "";

    // Add empty divs for alignment
    for (let i = 1; i <= firstDayIndex; i++){
        const spacer = document.createElement("div");
        spacer.className = "spacer";
        container.appendChild(spacer);
    }

    // Add days
    for (let i = 1; i <= daysInMonth; i++){
        const dayDiv = document.createElement("div");
        dayDiv.className = "habit-day";
        dayDiv.dataset.day = i;
        dayDiv.textContent = i;

        // Highlight today

        if (
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            dayDiv.classList.add("today");
        }

        container.appendChild(dayDiv);
    }
}





// -------------------------
// Tracking grid rendering
// -------------------------
function renderGrid(container, habit){

    if(!container) return;
    const today = new Date();
    const year = today.getFullYear();
    const month = 0
    const firstday = new Date(year, month, 1);
    const startOfYear = new Date(year, 0, 1);
    const diffMs = today - startOfYear;
    const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    const firstDayIndex = firstday.getDay();

    container.innerHTML = "";

    // Empty divs for alignment
    for (let i = 1; i <= firstDayIndex; i++){
        const spacer = document.createElement("div");
        spacer.className = "spacer";
        container.appendChild(spacer);
        }

    for (let i = 1; i <= dayOfYear; i++){
        const day = document.createElement("div");
        day.className = "day";

        // Convert day number to actual date
        const currentDate = new Date(startOfYear);
        currentDate.setDate(i);

        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(currentDate.getDate()).padStart(2, '0');

        const dateString = `${y}-${m}-${d}`;

        //if the day is completed for ths habit, highlight it


        if (habit.completions.includes(dateString)){
            day.classList.add("day-completed");
        }

        container.appendChild(day);
    }
}


// ---------------------------
// TASKS
// ---------------------------

function renderTasks() {
    const taskColumns = document.getElementById("task-grid");

    if(!taskColumns) return;

    taskColumns.innerHTML = "";

    state.tasks.forEach(task => {
        renderTaskCard(task, taskColumns);
    });
}



// Task Cards

export function showTaskModal(){
    console.log("Task!")
    document.getElementById('taskModal').style.display = "flex";
    document.getElementById("app").classList.add("blurred");
}

export function hideTaskModal(){
    document.getElementById('taskModal').style.display = "none";
    document.getElementById("app").classList.remove("blurred");
}


function renderTaskCard(task, container){
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
        <h4>🧾 ${task.name}</h4>
        <button class="start" data-task-id=${task.id}>🔴 Not started</button>
        <p>📆 Due ${taskWarning(task)}</p>
        <button class="task-complete">Mark as completed</button>

    `;

    container.appendChild(card);
}
