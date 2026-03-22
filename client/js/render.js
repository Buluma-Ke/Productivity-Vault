import {state} from "./state.js";
import { getStreak, taskWarning, getProjectStats, getPerformanceData, calculateHabitStats, getHabitColor, getWeeklyWindowProgress } from "./helpers.js";

function createEmptyCard(label = "+ Add new") {
    const card = document.createElement("div");
    card.className = "empty-card";
    card.innerHTML = `<span class="empty-card__label">${label}</span>`;
    return card;
}

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
    renderProject();
    renderWeeklyCalender();
    renderPerformanceOverview();
    renderHabitStats();
}

function renderHabits() {
    const habitGrid = document.getElementById("habit_grid");
    const trackGrid = document.getElementById("trackhabit_grid");

    if (!habitGrid || !trackGrid) return;

    habitGrid.innerHTML = "";
    trackGrid.innerHTML = "";

    state.habits.forEach(habit => {
        renderHabitCard(habit, habitGrid);
        renderHabitTrack(habit, trackGrid);
    });

    // Placeholder always appended after real cards (acts as "add new" slot)
    habitGrid.appendChild(createEmptyCard("+ Add a new habit"));
    trackGrid.appendChild(createEmptyCard("+ Track a new habit"));
}


function renderHabitCard(habit, container) {
    const card = document.createElement("div");
    card.className = "habit-card";

    const { completed, total, percentage } = getWeeklyWindowProgress(habit);
    const color = getHabitColor(habit.id);
    const completedToday = habit.completions.includes(new Date().toISOString().split('T')[0]);

    card.innerHTML = `
        <div class="card-top">
            <h4>${habit.title}</h4>
            <button class="delete-btn" data-type="habit" data-id="${habit.id}">🗑</button>
        </div>
        <div class="frequency">🎯 Weekly: ${habit.frequency}x</div>
        <div class="habit-calender"></div>
        <div>
            <p class="completed-today completed-today--${completedToday ? color : 'default'}">
                ${completedToday ? '✅' : '○'} Completed Today
            </p>
            <div class="progress-div">
                <div class="progress-track">
                    <div class="progress-bar progress-bar--${color}" style="width: ${percentage}%"></div>
                </div>
                <span class="progress-label">${percentage}%</span>
                <span class="progress-fraction">${completed}/${total}</span>
            </div>
            <p>Streak 🔥${getStreak(habit)} days</p>
        </div>
    `;

    container.appendChild(card);

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


function renderHabitTrack(habit, container) {
    const card = document.createElement("article");
    card.className = "habit-card";

    const Wfrequency = document.createElement('p');
    Wfrequency.textContent = `🎯 Weekly: ${habit.frequency}x`;

    const date = document.createElement('p');
    date.textContent = `📆 Today is: ${todaysDate}`;

    const wrapper = document.createElement("div");
    wrapper.className = "habit-graph-wrapper";

    // Fixed day labels on the left
    const labels = document.createElement("div");
    labels.className = "day-labels";
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
        const span = document.createElement('span');
        span.textContent = d;
        labels.appendChild(span);
    });

    // Scrollable grid container
    const scrollContainer = document.createElement("div");
    scrollContainer.className = "track-scroll";

    const grid = document.createElement("div");
    grid.className = "track-grid";

    scrollContainer.appendChild(grid);
    wrapper.appendChild(labels);
    wrapper.appendChild(scrollContainer);

    card.innerHTML = `<h4>${habit.title}</h4>`;
    card.appendChild(document.createElement('button')).outerHTML; // placeholder
    
    // rebuild button properly
    card.innerHTML = `
        <h4>${habit.title}</h4>
        <button data-habit-id="${habit.id}" class="complete-btn">Mark as complete</button>
    `;

    card.appendChild(Wfrequency);
    card.appendChild(date);
    card.appendChild(wrapper);

    container.appendChild(card);

    renderGrid(grid, habit);

    // Scroll to start of current month
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysToMonth = Math.floor((startOfMonth - startOfYear) / 86400000);
    const cellWidth = 16; // day cell width + gap
    const cols = Math.floor(daysToMonth / 7);
    scrollContainer.scrollLeft = cols * cellWidth;
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
    if (!taskColumns) return;

    // Default filter
    renderFilteredTasks('all');
}

export function renderFilteredTasks(filter = 'all') {
    const taskColumns = document.getElementById("task-grid");
    if (!taskColumns) return;

    taskColumns.innerHTML = "";

    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    const monday = new Date(today);
    const dow = today.getDay();
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    const mondayISO = monday.toISOString().split('T')[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const sundayISO = sunday.toISOString().split('T')[0];

    const filters = {
        all:       () => state.tasks,
        today:     () => state.tasks.filter(t => t.dueDate === todayISO),
        week:      () => state.tasks.filter(t => t.dueDate >= mondayISO && t.dueDate <= sundayISO),
        completed: () => state.tasks.filter(t => Boolean(t.completed))
    };

    const tasks = (filters[filter] || filters.all)();

    tasks.forEach(task => renderTaskCard(task, taskColumns));
    taskColumns.appendChild(createEmptyCard("+ Add a new task"));
}



// Task Cards

export function showTaskModal(){
    document.getElementById('taskModal').style.display = "flex";
    document.getElementById("app").classList.add("blurred");
    populateProjectOptions();
}

export function hideTaskModal(){
    document.getElementById('taskModal').style.display = "none";
    document.getElementById("app").classList.remove("blurred");
}


function renderTaskCard(task, container) {
    const card = document.createElement("div");
    card.className = "task-card";

    const isCompleted = Boolean(task.completed);

card.innerHTML = `
    <div class="card-top">
        <h4>🧾 ${task.title}</h4>
        <button class="delete-btn" data-type="task" data-id="${task.id}">🗑</button>
    </div>
    <button class="start ${isCompleted ? 'start--done' : 'start--pending'}" id="${task.id}btn">
        ${isCompleted ? '😊 Completed' : '😡 Not started'}
    </button>
    <p>📆 Due ${taskWarning(task)}</p>
    <button class="task-complete" data-id="${task.id}">Mark as completed</button>
`;

    container.appendChild(card);
}






// ----------------
// Projects
// ----------------

function renderProject() {
    const projectGrid = document.getElementById("project-grid");
    if (!projectGrid) return;

    projectGrid.innerHTML = "";

    state.projects.forEach(project => {
        renderprojectCard(project, projectGrid);
    });

    projectGrid.appendChild(createEmptyCard("+ Start a new project"));
}

// project tasks
function populateProjectOptions(){
    const select = document.getElementById("taskProject");

    const vault = state
    const projects = vault.projects || [];

    select.innerHTML = `<option value="">Project</option>`;

    projects.forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title
        select.appendChild(option);
    });
}

// project modal
export function showProjectModal(){
    document.getElementById('projectkModal').style.display = "flex";
    document.getElementById("app").classList.add("blurred");
}

export function hideProjectModal(){
    document.getElementById('projectkModal').style.display = "none";
    document.getElementById("app").classList.remove("blurred");
}

// project card
function renderprojectCard(project, container){
    const card = document.createElement("div");
    card.className = "project-card";

    const stats = getProjectStats(project.id)

    const daysLabel = stats.daysRemaining === null
        ? 'No deadline set'
        : stats.daysRemaining < 0
            ? `<span class="overdue-label">⚠ Past due</span>`
            : `${stats.daysRemaining} days to go`;

    card.innerHTML = `
        <div class="card-top">
            <h4>📌 ${project.title}</h4>
            <button class="delete-btn" data-type="project" data-id="${project.id}">🗑</button>
        </div>
        <div class="project-metadata"><p>🕐 Total related tasks = ${stats.total}</p></div>
        <div class="project-metadata">
            <p>☘ Total incompleted tasks = ${stats.incomplete}</p>
            <p>🌺 Total completed tasks = ${stats.completed}</p>
        </div>
        <div>
            <p>📆 ${daysLabel}</p>
        </div>
        <button class="project-completed">Completed</button>
    `;

    container.appendChild(card);
}


// Weekly & Month calender


function renderWeeklyCalender() {
    const calenderGrid = document.getElementById("calendar-grid");
    const calenderHeader = document.getElementById("calendar-month-label");

    if (!calenderGrid) return;

    const today = new Date();
    if (calenderHeader) {
        calenderHeader.textContent = today.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
    }

    renderWeeklyMonthlyCalender(calenderGrid, state.tasks);
}


function renderWeeklyMonthlyCalender(container, tasks = []) {
    if (!container) return;

    container.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build Mon–Sun dates for the current week
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });

    // Index tasks by dueDate string
    const tasksByDate = {};
    tasks.forEach(task => {
        if (!task.dueDate) return;
        if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
        tasksByDate[task.dueDate].push(task);
    });

    // Build each day column
    weekDates.forEach(date => {
        const dateStr = date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");

        const isToday = date.getTime() === today.getTime();
        const dayTasks = tasksByDate[dateStr] || [];

        const dayCol = document.createElement("div");
        dayCol.className = "calendar-day" + (isToday ? " calendar-day--today" : "");

        // Day header with name + number
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-day__header" + (isToday ? " calendar-day__header--today" : "");
        dayHeader.innerHTML = `
            <span class="calendar-day__name">${date.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
            <span class="calendar-day__number">${date.getDate()}</span>
        `;
        dayCol.appendChild(dayHeader);

        // Task list
        const taskList = document.createElement("div");
        taskList.className = "calendar-day__tasks";

        if (dayTasks.length === 0) {
            const empty = document.createElement("p");
            empty.className = "calendar-day__empty";
            empty.textContent = "No tasks";
            taskList.appendChild(empty);
        } else {
            dayTasks.forEach(task => {
                const card = document.createElement("div");
                card.className = "task-card-calender";

                card.innerHTML = `
                    <h4>🧾 ${task.title}</h4>
                    <button class="start ${Boolean(task.completed) ? 'start--done' : 'start--pending'}" id="${task.id}btn">
                        ${Boolean(task.completed) ? '😊 Completed' : '😡 Not started'}
                    </button>
                    <p>📆 Due ${taskWarning(task)}</p>
                    <button class="task-complete" data-id="${task.id}">Mark as completed</button>
                `;

                taskList.appendChild(card);
            });
        }

        dayCol.appendChild(taskList);
        container.appendChild(dayCol);
    });
}





// PERFORMANCE

export function renderPerformanceOverview() {
    const container = document.getElementById("performance-overview");
    if (!container) return;

    const today = new Date();
    const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
    const fullDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const {
        weekNum,
        todayTasks,
        completedToday,
        overdueTasks,
        overdueLastWeek,
        upcomingThisMonth
    } = getPerformanceData();

    container.innerHTML = `
        <div class="perf-overview-card">
            <h4>🔥Performance Overview</h4>
            <p class="perf-intro">
                Today is <strong>${dayName}</strong>, ${fullDate}
                <span class="perf-week-badge">(Week ${weekNum} of the year</span>
            </p>

            <h3 class="perf-section-title">Task status overview</h3>
            <p class="perf-sub">Here's a quick glimpse of your day so far;</p>
            <p class="perf-stat">
                To-do: <span class="perf-count">${completedToday.length}/${todayTasks.length}</span>
            </p>
            <ul class="perf-task-list">
                ${todayTasks.length
                    ? todayTasks.map(t => `
                        <li class="${Boolean(t.completed) ? 'perf-task--done' : ''}">
                            ${Boolean(t.completed) ? '✓' : '○'} ${t.title}
                        </li>`).join('')
                    : '<li class="perf-empty">No tasks due today</li>'
                }
            </ul>

            <h3 class="perf-section-title">Due & upcoming tasks</h3>
            ${overdueTasks.length
                ? `<p class="perf-overdue-label">Overdue</p>
                   <ul class="perf-task-list perf-task-list--overdue">
                       ${overdueTasks.map(t => `
                           <li>⚠ ${t.title} <span class="perf-due-date">${t.dueDate}</span></li>
                       `).join('')}
                   </ul>`
                : ''
            }

            <div class="perf-notifications">
                <p class="${overdueLastWeek.length > 0 ? 'perf-notify--warn' : 'perf-notify--ok'}">
                    ⚠️You have ${overdueLastWeek.length} task${overdueLastWeek.length !== 1 ? 's' : ''} overdue from last week
                </p>
                <p class="perf-notify--ok">
                    📆You have ${upcomingThisMonth.length} upcoming task${upcomingThisMonth.length !== 1 ? 's' : ''} this month
                </p>
            </div>
        </div>
    `;
}


// HABIT STATISTICS

function renderHabitStats() {
    const habitStat = document.getElementById("habit-stat");
    if (!habitStat) return;

    habitStat.innerHTML = "";
    renderHabitStatsCards(habitStat, state.habits);
}

function renderHabitStatsCards(container, habits = []) {
    if (habits.length === 0) {
        container.appendChild(createEmptyCard("No habits yet"));
        return;
    }

    habits.forEach(habit => {
        const { completedThisWeek, missedDays, streak } = calculateHabitStats(habit);

        const card = document.createElement("div");
        card.className = "habit-stat-card";

        card.innerHTML = `
            <h4 class="habit-stat-card__title">${habit.title}</h4>
            <div class="habit-stat-card__row">
                <span class="habit-stat-card__label">This week</span>
                <span class="habit-stat-card__value">${completedThisWeek} / 7</span>
            </div>
            <div class="habit-stat-card__row">
                <span class="habit-stat-card__label">Days missed</span>
                <span class="habit-stat-card__value habit-stat-card__value--missed">${missedDays}</span>
            </div>
            <div class="habit-stat-card__row">
                <span class="habit-stat-card__label">Streak</span>
                <span class="habit-stat-card__value">
                    🔥 ${streak} day${streak !== 1 ? 's' : ''}
                    ${streak <= 1 ? '<span class="habit-stat-card__badge">New record</span>' : ''}
                </span>
            </div>
        `;

        container.appendChild(card);
    });
}