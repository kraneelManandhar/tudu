const API_BASE_URL = "http://localhost:5000/api";
const TASK_API = `${API_BASE_URL}/tasks`;
const CATEGORY_API = `${API_BASE_URL}/tasks/cat`;

let editingTaskId = null;
let categories = [];

// Initialize profile
localStorage.setItem('profilePic', 'https://www.shutterstock.com/shutterstock/photos/2286554497/display_1500/stock-photo-random-pictures-cute-and-funny-2286554497.jpg');
localStorage.setItem('username', 'Kraneel Manandhar');

document.getElementById('profileImg').src = localStorage.getItem('profilePic') || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';

// Load tasks and categories on page load
async function initialize() {
    await loadCategories();
    await loadTasks();
}

// Load tasks
async function loadTasks() {
    try {
        const res = await fetch(TASK_API);
        const tasks = await res.json();

        const container = document.getElementById("taskContainer");
        container.innerHTML = "";

        tasks.forEach(task => {
            const card = document.createElement("div");
            card.classList.add("task-card");

            // Get category for this task if it exists
            const taskCategory = categories.find(cat => cat.tasks && cat.tasks._id === task._id);
            
            card.innerHTML = `
                <p><strong>${task.title || "Untitled"}</strong></p>
                <p>${task.description || ""}</p>
                ${taskCategory ? `<p class="category-tag">${taskCategory.category}</p>` : ''}
                <button onclick="openTaskForm('${task._id}', '${task.title}', '${task.description}')">Edit</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading tasks", err);
    }
}

// Load categories
async function loadCategories() {
    try {
        const res = await fetch(CATEGORY_API);
        categories = await res.json();
    } catch (err) {
        console.error("Error loading categories", err);
    }
}

function openTaskForm(id = null, title = "", description = "") {
    editingTaskId = id;
    document.getElementById("formTitle").textContent = id ? "Edit Task" : "Add Task";
    document.getElementById("taskTitle").value = title;
    document.getElementById("taskDescription").value = description;
    
    // Add category checkboxes to the form
    const categoryContainer = document.getElementById("categoryContainer");
    categoryContainer.innerHTML = '<h4>Categories</h4>';
    
    ['important', 'very important', 'not so important'].forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `category-${category.replace(/\s+/g, '-')}`;
        checkbox.value = category;
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = category;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        categoryContainer.appendChild(div);
    });
    
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
    const selectedCategory = document.querySelector('input[type="checkbox"]:checked')?.value;

    if (!title.trim()) {
        alert("Task title is required!");
        return;
    }

    try {
        if (editingTaskId) {
            // Update task
            await fetch(`${TASK_API}/${editingTaskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });

            // Update category if selected
            if (selectedCategory) {
                await updateTaskCategory(editingTaskId, selectedCategory);
            }
        } else {
            // Create new task
            const res = await fetch(TASK_API + "/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
            const newTask = await res.json();

            // Add category if selected
            if (selectedCategory) {
                await updateTaskCategory(newTask._id, selectedCategory);
            }
        }
        closeTaskForm();
        await loadTasks();
    } catch (err) {
        console.error("Error saving task", err);
    }
}

// Update or create category for task
async function updateTaskCategory(taskId, category) {
    try {
        // First check if this task already has a category
        const existingCategory = categories.find(cat => cat.tasks && cat.tasks._id === taskId);
        
        if (existingCategory) {
            // Update existing category
            await fetch(`${CATEGORY_API}/update/${existingCategory._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, tasks: taskId })
            });
        } else {
            // Create new category
            await fetch(`${CATEGORY_API}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, tasks: taskId })
            });
        }
        
        // Reload categories
        await loadCategories();
    } catch (err) {
        console.error("Error updating task category", err);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;
    try {
        await fetch(`${TASK_API}/${id}`, { method: "DELETE" });
        
        // Also delete any associated category
        const category = categories.find(cat => cat.tasks && cat.tasks._id === id);
        if (category) {
            await fetch(`${CATEGORY_API}/delete/${category._id}`, { method: "DELETE" });
        }
        
        await loadTasks();
    } catch (err) {
        console.error("Error deleting task", err);
    }
}

async function logout() {
    localStorage.removeItem('profilePic');
    localStorage.removeItem('username');
    document.getElementById('profileImg').src = localStorage.getItem('profilePic') || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg';
}

window.onload = initialize;