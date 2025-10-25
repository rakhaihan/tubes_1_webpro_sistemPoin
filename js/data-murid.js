// --- DATA-MURID.JS --- //
document.addEventListener("DOMContentLoaded", () => {
  requireLogin();
  setupLogout();
  setupSidebarToggle();

  const table = document.querySelector("#studentsTable tbody");
  const modal = document.getElementById("modal");
  const form = document.getElementById("studentForm");
  const cancelBtn = document.getElementById("cancelModal");
  const addBtn = document.getElementById("addStudentBtn");
  const search = document.getElementById("searchStudent");
  const exportBtn = document.getElementById("exportStudents");

  let students = getData("students");

  function renderTable(data = students) {
    table.innerHTML = data.map((s, i) => `
      <tr>
        <td>${s.name}</td>
        <td>${s.class}</td>
        <td>${s.nis}</td>
        <td>${s.status}</td>
        <td>
          <button class="btn small" onclick="editStudent(${i})">Edit</button>
          <button class="btn small danger" onclick="deleteStudent(${i})">Hapus</button>
        </td>
      </tr>
    `).join("");
  }

  window.editStudent = (index) => {
    const s = students[index];
    form.studentId.value = index;
    form.studentName.value = s.name;
    form.studentClass.value = s.class;
    form.studentNIS.value = s.nis;
    form.studentStatus.value = s.status;
    document.getElementById("modalTitle").textContent = "Edit Murid";
    modal.classList.remove("hidden");
  };

  window.deleteStudent = (index) => {
    if (confirm("Hapus murid ini?")) {
      students.splice(index, 1);
      saveData("students", students);
      renderTable();
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const s = {
      name: form.studentName.value,
      class: form.studentClass.value,
      nis: form.studentNIS.value,
      status: form.studentStatus.value
    };
    const id = form.studentId.value;
    if (id) students[id] = s; else students.push(s);
    saveData("students", students);
    modal.classList.add("hidden");
    form.reset();
    renderTable();
  });

  addBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Tambah Murid";
    form.reset();
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    const filtered = students.filter(s => s.name.toLowerCase().includes(q) || s.nis.includes(q));
    renderTable(filtered);
  });

  // --- Ekspor CSV (fungsi diperbaiki) ---
  exportBtn.addEventListener("click", () => {
    if (students.length === 0) {
      alert("Tidak ada data murid untuk diekspor.");
      return;
    }

    const header = ["Nama", "Kelas", "NIS", "Status"];
    const rows = students.map(s => [s.name, s.class, s.nis, s.status]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data_murid.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  renderTable();
});
