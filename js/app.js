import { addHabit, markComplete, addTask} from "./state.js";

import { render, showHabitModal, hideHabitModal, showTaskModal, hideTaskModal } from "./render.js";

import { loadState } from "./storage.js";
import { state } from "./state.js";



document.addEventListener("DOMContentLoaded", () => {
    Object.assign(state, loadState());
    render();

    // Add new habit
    const newHabitButton = document.getElementById('openHabitModal');
    const closeHabitBtn = document.getElementById('closeHabitModal');

    newHabitButton.addEventListener("click", () => {
        showHabitModal();
    });

    closeHabitBtn.addEventListener("click", () => {
        hideHabitModal();
    });




    const habitForm = document.getElementById("habitForm");

    //console.log("form found:", form)

    habitForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = habitForm.habitName.value;
        const startDate = habitForm.startDate.value;
        const frequency = Number(habitForm.frequency.value);

        addHabit({ name, startDate, frequency});

        render();
        habitForm.reset();
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


    // Add new Task
    const newTaskBtn = document.getElementById('openTaskModal');
    const closeTaskBtn = document.getElementById('closeModal');

    newTaskBtn.addEventListener("click", () => {
        console.log("click!");
        showTaskModal();
    });

    closeTaskBtn.addEventListener("click", () => {
        hideTaskModal();
    });


    const taskForm = document.getElementById("taskForm");

    //console.log("form found:", form)

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = taskForm.taskName.value;
        const dueDate = taskForm.dueDate.value;

        addTask({ name, dueDate });

        render();
        taskForm.reset();
        hideTaskModal();
    });


    document.addEventListener('click', (e) => {
        if (e.target.classList.contains("start")) {
            // get ID from the data attribute
            const taskId = e.target.dataset.taskId;
        }
        render()
    })


});
