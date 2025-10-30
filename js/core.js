function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Cek login
function requireLogin() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "index.html";
}

// Logout
function setupLogout() {
  document.querySelectorAll("#logoutBtn, #logoutBtn2, #logoutBtn3, #logoutBtn4").forEach(btn => {
    if (btn) {
      btn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
      });
    }
  });
}

// Sidebar toggle (responsive)
function setupSidebarToggle() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.getElementById("sidebarToggle");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("show"));
  }
}

// Utilitas format tanggal
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getFullYear()}`;
}
