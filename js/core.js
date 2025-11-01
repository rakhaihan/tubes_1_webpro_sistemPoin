// --- core.js --- //

// 🔹 Ambil data dari localStorage
function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Gagal membaca data ${key}:`, err);
    return [];
  }
}

// 🔹 Simpan data ke localStorage
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Gagal menyimpan data ${key}:`, err);
  }
}

// 🔹 Cek login
function requireLogin() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) {
    alert("Sesi login berakhir, silakan login ulang.");
    window.location.href = "index.html";
  }
}

// 🔹 Logout untuk semua tombol
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

// 🔹 Sidebar toggle (responsive)
function setupSidebarToggle() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.getElementById("sidebarToggle");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => sidebar.classList.toggle("show"));
  }
}

// 🔹 Format tanggal ke format Indonesia
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getFullYear()}`;
}

// 🔹 Pastikan struktur awal data ada (tanpa dummy)
function ensureInitialData() {
  const keys = ["students", "sanctions", "studentSanctionRecords"];
  keys.forEach(key => {
    if (!localStorage.getItem(key)) {
      saveData(key, []);
    }
  });
}
