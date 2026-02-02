import { addHabit } from "./state.js"; 

import { render, showHabitModal, hideHabitModal } from "./render.js";

import { loadState } from "./storage.js";
import { state } from "./state.js";



document.addEventListener("DOMContentLoaded", () => { 
    Object.assign(state, loadState());
    render();


    const newHabitButton = document.getElementById('openHabitModal');
    const closeHabitBtn = document.getElementById('closeHabitModal');

    console.log("newHabitButton found:", newHabitButton)

    newHabitButton.addEventListener("click", () => {
        showHabitModal();
    });

    closeHabitBtn.addEventListener("click", () => {
        hideHabitModal();
    });




    const form = document.getElementById("habitForm");

    //console.log("form found:", form)

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.habitName.value;
        const startDate = form.startDate.value;
        const frequency = Number(form.frequency.value);

        addHabit({ name, startDate, frequency});

        render();
        form.reset();
});

    // Mark day complete
    


});



// // Mark day complete

// const markCompleteBtn = document.getElementById('markAsComplete')

// markCompleteBtn.addEventListener("click", () => {

//     // difference in days(including today)
//     const startOfYear = new Date(year, 0, 1); // jan 1st current year

//     const diffInMs = today - startOfYear;

//     const index_today = Math.floor(diffInMs/(1000 * 60 * 60 * 24)) + 1;
//     console.log(index_today)

//     const completedDay = document.querySelector('.day')

//     console.log(completedDay[index_today])


//     completedDay[index_today].classList.add('day-completed')

// });

