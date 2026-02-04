const STORAGE_KEY = "productivity-vault";

export function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data): {habits: [], tasks: []};
        console.log("tasks locked in")
    }catch{
        return {habits: [], tasks: []};
    }
}
