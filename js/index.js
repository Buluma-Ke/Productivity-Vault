const calendar = document.getElementById("calendar");

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();      // 0-based
const today = now.getDate();       // 1–31

// Get number of days in the current month
const daysInMonth = new Date(year, month + 1, 0).getDate();

for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;

    if (day === today) {
        dayDiv.classList.add("today");
    }

    calendar.appendChild(dayDiv);
}
