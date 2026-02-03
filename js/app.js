import { addHabit, markComplete} from "./state.js"; 

import { render, showHabitModal, hideHabitModal } from "./render.js";

import { loadState } from "./storage.js";
import { state } from "./state.js";



document.addEventListener("DOMContentLoaded", () => { 
    Object.assign(state, loadState());
    render();


    const newHabitButton = document.getElementById('openHabitModal');
    const closeHabitBtn = document.getElementById('closeHabitModal');

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
        hideHabitModal();
    });

    // Mark day complete
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains("complete-btn")) {
            // get ID from the data attribute
            const habitId = e.target.dataset.habitId;
            markComplete(habitId);
        }
        render()
    })


});



