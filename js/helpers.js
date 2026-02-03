// STREAKS COUNTER

export function getStreak(habit){
    if(!habit.completions.length) return 0;

    const completionSet = new Set(habit.completions);

    // Normalize today
    let today = new Date();
    today = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const todayISO = today.toISOString().split('T')[0];

    // if today not completed -> immediate 0
    if (!completionSet.has(todayISO)){
        return 0;
    }

    let streak = 0;
    let current = today;

    while(true) {
        const iso = current.toISOString().split('T')[0];

        if (completionSet.has(todayISO)){
            streak++;
            current.setDate(current.getDate() - 1);
        }else {
            break;
        }
    }

    return streak
}

// ---------------
// WEEKLY PROGRESS
// ---------------

// was completed in the last 7 days
export function getWeeklProgress(habit) {
    const completions = new Set(habit.completions);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time (hrs, mns, sec)
    
    let completed = 0;

    for (let i = 0; i < 7; i++){
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const iso = day.toISOString().split("T")[0];

        if(completions.has(iso)){
            completed++;
        }
    }

    return {
        completed: completed,
        total: 7,
        percentage: (completed / 7) * 100
    }
}