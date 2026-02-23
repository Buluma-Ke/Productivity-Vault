import { addHabit, markComplete, addTask, addProject, toggleTaskComplete } from "./state.js";

import { render, showHabitModal, hideHabitModal, showTaskModal, hideTaskModal, showProjectModal, hideProjectModal } from "./render.js";

// import { loadState } from "./storage.js";
import { state } from "./state.js";



document.addEventListener("DOMContentLoaded", () => {

    async function init() {
        try {
            // Load state from server; state.load() already updates the state object
            await state.load();

        } catch (e) {
            console.error("Failed to load state:", e);
        }

        // Render UI after state is populated
        render();
    }

    init();


    // ----------------
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

    // submit new habit
    habitForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = habitForm.habitName.value;
        const startDate = habitForm.startDate.value;
        const frequency = Number(habitForm.frequency.value);

        addHabit({ title, startDate, frequency});

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
    // ------------------------------------

    // --------------------
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

    // submit new task
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = taskForm.taskName.value;
        const dueDate = taskForm.dueDate.value;
        const projectId = taskForm.projectId.value || null;
        console.log(projectId);

        addTask({ name, dueDate, projectId });

        render();
        taskForm.reset();
        hideTaskModal();
    });

   //const taskContainer = document.querySelectorAll("task-card");

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains("task-complete")) {
            // get ID from the data attribute
            const taskId = e.target.dataset.id;
            toggleTaskComplete(taskId);

            render();
        }
    })
    // ------------------------

    // -----------------------
    // Add project
    const newProjectBtn = document.getElementById('openProjectModal');
    const closeProjectBtn = document.getElementById('closeProjectModal');

    newProjectBtn.addEventListener("click", () => {
        console.log("click!");
        showProjectModal();
    });

    closeProjectBtn.addEventListener("click", () => {
        console.log("click!");
        hideProjectModal();
    });


    const projectForm = document.getElementById("projectForm");

    // submit new project
       projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = projectForm.projectName.value;
        const deadline = projectForm.dueDate.value;

        addProject({ title, deadline });

        render();
        projectForm.reset();
        hideProjectModal();

    });

});
