const API_BASE_URL = "http://localhost:5000/api/tasks";

let editingTaskId = null;

localStorage.setItem('profilePic', 'https://www.shutterstock.com/shutterstock/photos/2286554497/display_1500/stock-photo-random-pictures-cute-and-funny-2286554497.jpg');
localStorage.setItem('username', 'Kraneel Manandhar');

// On page load
document.getElementById('profileImg').src = localStorage.getItem('profilePic') || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';


// Load tasks
async function loadTasks() {
    try {
        const res = await fetch(API_BASE_URL);
        const tasks = await res.json();

        const container = document.getElementById("taskContainer");
        container.innerHTML = "";

        tasks.forEach(task => {
            const card = document.createElement("div");
            card.classList.add("task-card");

            card.innerHTML = `
                <p><strong>${task.title || "Untitled"}</strong></p>
                <p>${task.description || ""}</p>
                <button onclick="openTaskForm('${task._id}', '${task.title}', '${task.description}')">Edit</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading tasks", err);
    }
}

// Open modal
function openTaskForm(id = null, title = "", description = "") {
    editingTaskId = id;
    document.getElementById("formTitle").textContent = id ? "Edit Task" : "Add Task";
    document.getElementById("taskTitle").value = title;
    document.getElementById("taskDescription").value = description;
    document.getElementById("taskFormModal").style.display = "flex";
}

// Close modal
function closeTaskForm() {
    document.getElementById("taskFormModal").style.display = "none";
    editingTaskId = null;
}

// Save task
async function saveTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;

    if (!title.trim()) {
        alert("Task title is required!");
        return;
    }

    try {
        if (editingTaskId) {
            await fetch(`${API_BASE_URL}/${editingTaskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
        } else {
            await fetch(API_BASE_URL + "/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
        }
        closeTaskForm();
        loadTasks();
    } catch (err) {
        console.error("Error saving task", err);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    try {
        await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
        loadTasks();
    } catch (err) {
        console.error("Error deleting task", err);
    }
}

async function logout(){
    localStorage.removeItem('profilePic');
    localStorage.removeItem('username');

    document.getElementById('profileImg').src = localStorage.getItem('profilePic') || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
}

window.onload = loadTasks;
