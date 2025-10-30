// --- CATATAN-PELANGGARAN.JS --- //
document.addEventListener("DOMContentLoaded", () => {
  requireLogin();
  setupLogout();
  setupSidebarToggle();

  const form = document.getElementById("violationForm");
  const table = document.querySelector("#violationsTable tbody");
  const search = document.getElementById("searchViolation");
  const selectStudent = document.getElementById("violationStudent");

  let violations = getData("violations");
  const students = getData("students");

  selectStudent.innerHTML = students.map(s => `<option>${s.name}</option>`).join("");

  function renderTable(data = violations) {
    table.innerHTML = data.map((v, i) => `
      <tr>
        <td>${v.name}</td>
        <td>${v.type}</td>
        <td>${formatDate(v.date)}</td>
        <td>${v.points}</td>
        <td>${v.note || "-"}</td>
        <td><button class="btn small danger" onclick="deleteViolation(${i})">Hapus</button></td>
      </tr>
    `).join("");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const record = {
      name: selectStudent.value,
      type: document.getElementById("violationType").value,
      date: document.getElementById("violationDate").value,
      note: document.getElementById("violationNote").value,
      points: parseInt(document.getElementById("violationPoints").value)
    };
    violations.push(record);
    saveData("violations", violations);
    form.reset();
    renderTable();
  });

  document.getElementById("clearViolations").addEventListener("click", () => {
    if (confirm("Yakin hapus semua catatan pelanggaran?")) {
      violations = [];
      saveData("violations", violations);
      renderTable();
    }
  });

  window.deleteViolation = (index) => {
    violations.splice(index, 1);
    saveData("violations", violations);
    renderTable();
  };

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    const filtered = violations.filter(v =>
      v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q)
    );
    renderTable(filtered);
  });

  // Cetak hanya tabel laporan
  document.getElementById("printReport").addEventListener("click", () => {
    window.print();
  });

  renderTable();
});
