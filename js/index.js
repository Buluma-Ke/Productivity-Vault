
//CALENDER CREATION FUNCTION

function renderCalendar(container, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstday = new Date(year, month, 1);
    const lastday = new Date(year, month + 1, 0);
    const daysInMonth = lastday.getDate();
    const firstDayIndex = firstday.getDay();

    console.log(firstDayIndex)


//  monthYear.textContainer =

    container.innerHTML = '';

//  Spacers for the start of the month
//  Pushes the 1st day of the month to the correct day column
    for (let j = 0; j < firstDayIndex; j++) {
        const spacer = document.createElement('div');
        spacer.classList.add('habit-day');
        container.appendChild(spacer);
    }

//  Current Month's Dates
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');

        dayDiv.classList.add('habit-day');
        dayDiv.textContent = i;

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        container.appendChild(dayDiv);
    }
    
};



document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    console.log(today)
//  const daysContainer = document.getElementById('days');
//  const monthYear = document.getElementById('');


    const year = date.getFullYear();
    const month = date.getMonth();
    const firstday = new Date(year, month, 1);
    const lastday = new Date(year, month + 1, 0);
    const daysInMonth = lastday.getDate();
    const firstDayIndex = firstday.getDay();


    const containers = document.querySelectorAll('.habit-calender');

    // containers.forEach(container => {
    //     renderCalendar(container, today);
    // })
    containers.forEach(renderCalendar)


    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();
   


    // Habit Growth Graph

    const grid = document.getElementById('track-grid');

   const heatmapContainers = document.querySelectorAll('.track-grid');

    heatmapContainers.forEach(heatMapContainer => {
        renderGrid(heatMapContainer, today);
    })


    function renderGrid(heatMapContainer) {
        const year = today.getFullYear();

        const startOfYear = new Date(year, 0, 1); // jan 1st current year
        
        // difference in days(including today)
        const diffInMs = today - startOfYear;
        const dayOfYear = Math.floor(diffInMs/(1000 * 60 * 60 * 24)) + 1;

        // mock day completed data
        const completedDays = [1, 2, 15, dayOfYear];

        for(let i = 1; i < dayOfYear; i++){
            const day = document.createElement('div');
            day.classList.add('day');
        
            if(completedDays.includes(i)){
                day.classList.add('day-completed')
            }

            heatMapContainer.appendChild(day)
        }
    }

}
);



// ADD NEW HABIT
//------------------------------------------

const app = document.getElementById("app");
const modal = document.getElementById('habitModal');
const openBtn = document.getElementById('openHabitModal');
const closeBtn = document.getElementById('closeHabitModal');
const startDateInput = document.getElementById('habitStartDate');
const form = document.getElementById('habitForm');


// Toggle blur

//default start date today
const dateToday = new Date().toISOString().split("T")[0]; 
startDateInput.value = dateToday;

openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    app.classList.add("blurred")
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    app.classList.remove("blurred")
});

modal.addEventListener("click", (e) => {
    if(e.target === modal) modal.style.display ="none"; 
        app.classList.remove("blurred")
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const habit = {
        habitname: habitName.value.trim(),
        startDate: habitStartDate.value,
        timesPerWeek:Number(habitFrequency.value),
    };

    console.log(habit);
    addHabitToUi(habit)

    form.reset();
    startDateInput.value = dateToday;
    modal.style.display = "none"
    app.classList.remove("blurred");
});

// Add habit to UI

const habitsGrid = document.getElementById("habit_grid")

function addHabitToUi(habit) {
    const habitCard = document.createElement('div');
    habitCard.className = "habit-calender";

    habitCard.innerHTML = `
    <h4>${habit.habitname}</h4>
    <div class="frequency">Weekly: ${habit.timesPerWeek}x</div>
    <div class="habit-calender"></div>
    <div class="habit-meta">
        Completed Today<br>
        Streak: 1 day
    </div>
    `;

    habitsGrid.appendChild(habitCard);

    //Render
    const newCalender = habitCard.querySelector(".habit-calender");
    renderCalendar(newCalender) ;
}