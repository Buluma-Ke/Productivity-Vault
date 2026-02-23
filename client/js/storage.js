
// export async function saveState(state) {
//     await fetch("http://localhost:3000/state" ,{
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(state)
//     });
// }


// export async function loadState() {
//     try {
//         const response = await fetch("http://localhost:3000/state");

//         if(!response.ok){
//             throw new Error("Server error")
//         }

//         const data = await response.json();
//         return data;

//     }catch(err){
//         console.error("Failed to load state", err);
//         return {habits: [], tasks: [], projects: []};
//     }
// }
