document.addEventListener("DOMContentLoaded", () => {

    requireLogin();
    setupLogout();
    setupSidebarToggle();

    const form = document.getElementById("sanctionForm");
    const table = document.querySelector("#sanctionsTable tbody");
    const selectStudent = document.getElementById("sanctionStudent");

    let sanctions = getData("sanctions");
    let students = getData("students");

    if (students.length > 0) {
        selectStudent.innerHTML = students.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
        selectStudent.disabled = false;
        form.querySelector("button[type='submit']").disabled = false;
    } else {
        selectStudent.innerHTML = '<option value="">(Belum ada data murid)</option>';
        selectStudent.disabled = true;
        form.querySelector("button[type='submit']").disabled = true;
    }

    function renderTable(data = sanctions) {
        table.innerHTML = data.length > 0
            ? data.map((s, i) => `
        <tr>
          <td>${s.name}</td>
          <td>${s.type}</td>
          <td>${formatDate(s.date)}</td>
          <td>${s.status}</td>
          <td><button class="btn small danger" onclick="deleteSanction(${i})">Hapus</button></td>
        </tr>
      `).join("")
            : '<tr><td colspan="5" class="muted">Belum ada data sanksi</td></tr>';
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const s = {
            name: selectStudent.value,
            type: document.getElementById("sanctionType").value,
            date: document.getElementById("sanctionDate").value,
            status: document.getElementById("sanctionStatus").value
        };

        sanctions.push(s);
        saveData("sanctions", sanctions);
        form.reset();
        renderTable();
    });

    document.getElementById("clearSanctions").addEventListener("click", () => {
        if (confirm("Hapus semua data pembinaan?")) {
            sanctions = [];
            saveData("sanctions", sanctions);
            renderTable();
        }
    });

    window.deleteSanction = (index) => {
        sanctions.splice(index, 1);
        saveData("sanctions", sanctions);
        renderTable();
    };

    renderTable();
});
