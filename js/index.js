document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    console.log(today)
//  const daysContainer = document.getElementById('days');
//  const monthYear = document.getElementById('');

    const containers = document.querySelectorAll('.habit-calender');

    containers.forEach(container => {
        renderCalendar(container, today);
    })

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();

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
        
    }
   
    



    // Habit Growth Graph

    const grid = document.getElementById('track-grid');
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

        grid.appendChild(day)
    }

}
)