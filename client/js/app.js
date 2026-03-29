import { addHabit, markComplete, addTask, addProject, toggleTaskComplete, deleteTask, deleteHabit, deleteProject, toggleProjectComplete  } from "./state.js";

import { render, showHabitModal, hideHabitModal, showTaskModal, hideTaskModal, showProjectModal, hideProjectModal, renderFilteredTasks, renderFilteredProjects } from "./render.js";

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


    // Toggle side bar

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--open');
        overlay.classList.toggle('sidebar-overlay--visible');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar--open');
        overlay.classList.remove('sidebar-overlay--visible');
    });


    // Delete buttons

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const { type, id } = e.target.dataset;

            if (type === 'task')    deleteTask(id);
            if (type === 'habit')   deleteHabit(id);
            if (type === 'project') deleteProject(id);

            render();
        }

        if (e.target.classList.contains('task-filter-btn')) {
            // Update active state
            document.querySelectorAll('.task-filter-btn').forEach(btn => {
                btn.classList.remove('task-filter-btn--active');
            });
            e.target.classList.add('task-filter-btn--active');

            renderFilteredTasks(e.target.dataset.filter);
        }

            // Project filter tabs
        if (e.target.classList.contains('project-filter-btn')) {
            document.querySelectorAll('.project-filter-btn').forEach(btn =>
                btn.classList.remove('project-filter-btn--active')
            );
            e.target.classList.add('project-filter-btn--active');
            renderFilteredProjects(e.target.dataset.filter);
        }

        // Project complete button
        if (e.target.classList.contains('project-complete-btn')) {
            const projectId = e.target.dataset.id;
            toggleProjectComplete(projectId);
            render();
        }

        // Navigation
        if (e.target.classList.contains('nav-btn')) {
            const targetId = e.target.dataset.target;
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        if (e.target.classList.contains('empty-card') || e.target.classList.contains('empty-card__label')) {
            const card = e.target.closest('.empty-card');
            const action = card?.dataset.action;

            if (action === 'habit')   showHabitModal();
            if (action === 'task')    showTaskModal();
            if (action === 'project') showProjectModal();
        }
 
    });

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

        addHabit({ name: title, startDate, frequency});

        render();
        habitForm.reset();
        hideHabitModal();
    });

    // Mark day complete

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains("complete-btn")) {
            const habitId = e.target.dataset.habitId;
            markComplete(habitId);
            render(); // <-- inside the if
        }
    })
    // ------------------------------------

    // --------------------
    // Add new Task
    const newTaskBtn = document.getElementById('openTaskModal');
    const closeTaskBtn = document.getElementById('closeModal');

    newTaskBtn.addEventListener("click", () => {
        showTaskModal();
    });

    closeTaskBtn.addEventListener("click", () => {
        hideTaskModal();
    });


    const taskForm = document.getElementById("taskForm");

    // submit new task
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = taskForm.taskName.value;
        const dueDate = taskForm.dueDate.value;
        const projectId = taskForm.projectId.value || null;

        addTask({ title, dueDate, projectId });

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

    document.addEventListener('click', (e) => {

    // Status button — two step toggle
    if (e.target.classList.contains('start')) {
        const btn = e.target;

        if (btn.classList.contains('start--pending')) {
            // step 1: not started → bored
            btn.textContent = '😑 ...';
            btn.classList.replace('start--pending', 'start--bored');

        } else if (btn.classList.contains('start--bored')) {
            // step 2: bored → completed, change state
            const taskId = btn.id.replace('btn', '');
            toggleTaskComplete(taskId);
            btn.textContent = '😊 Completed';
            btn.classList.replace('start--bored', 'start--done');

        } else if (btn.classList.contains('start--done')) {
            // pressing again goes back to bored
            btn.textContent = '😑 ...';
            btn.classList.replace('start--done', 'start--bored');
        }
    }

    // Mark as completed — changes state directly
    if (e.target.classList.contains('task-complete')) {
        const taskId = e.target.dataset.id;
        toggleTaskComplete(taskId);

        const card = e.target.closest('.task-card');
        if (card) {
            const statusBtn = card.querySelector('.start');
            statusBtn.textContent = '😊 Completed';
            statusBtn.classList.remove('start--pending', 'start--bored');
            statusBtn.classList.add('start--done');
        }
    }

    // Habit complete button
    if (e.target.classList.contains("complete-btn")) {
        const habitId = e.target.dataset.habitId;
        markComplete(habitId);
        render();
    }

});

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
        console.log(deadline)

        addProject({ title, deadline });

        render();
        projectForm.reset();
        hideProjectModal();

    });

});
