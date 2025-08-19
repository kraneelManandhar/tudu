const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const headers = { "Content-Type": "application/json" };

document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {
    username: regUsername.value,
    email: regEmail.value,
    password: regPassword.value,
    firstName: firstName.value,
    lastName: lastName.value
  };
  const res = await fetch(`${API}/auth/register/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  alert(data.message || "Registered!");
});

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {
    username: loginUsername.value,
    password: loginPassword.value
  };
  const res = await fetch(`${API}/auth/login/validateCredentials`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log("Login response:", data);

  if (res.ok && data.result?.accessToken) {
    localStorage.setItem("token", data.result.accessToken);
    localStorage.setItem("username", data.result.username);
    alert("Logged in!");
    loadTasks();
  } else {
    alert(data.message || "Login failed");
  }
});

document.getElementById("verifyBtn").addEventListener("click", async () => {
  const res = await fetch(`${API}/auth/login/`, {
    method: "POST",
    headers: { ...headers, "access-token": token() },
    body: JSON.stringify({ username: localStorage.getItem("username") })
  });
  const data = await res.json();
  alert(data.message || (res.ok ? "Token OK" : "Token invalid"));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  alert("Logged out");
});

document.getElementById("taskForm").addEventListener("submit", async e => {
  e.preventDefault();
  const body = {
    title: taskTitle.value,
    description: taskDescription.value,
    category: taskCategory.value
  };
  await fetch(`${API}/tasks/create`, {
    method: "POST",
    headers: { ...headers, "access-token": token() },
    body: JSON.stringify(body)
  });
  loadTasks();
});

async function loadTasks() {
  const res = await fetch(`${API}/tasks`);
  const tasks = await res.json();
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>ID:</strong> ${t._id} <br>
        <strong>Title:</strong> ${t.title} <br>
        <strong>Description:</strong> ${t.description || "—"} <br>
        <strong>Status:</strong> ${t.status} <br>
        <strong>Category:</strong> ${t.category || "—"}
      </div>
      <span>
        <button onclick="updateTask('${t._id}')">Edit</button>
        <button onclick="deleteTask('${t._id}')">Delete</button>
      </span>`;
    ul.appendChild(li);
  });
}

async function updateTask(id) {
  const newTitle = prompt("New title:");
  if (!newTitle) return;
  await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { ...headers, "access-token": token() },
    body: JSON.stringify({ title: newTitle })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "access-token": token() }
  });
  loadTasks();
}

if (token()) {
  loadTasks();
}