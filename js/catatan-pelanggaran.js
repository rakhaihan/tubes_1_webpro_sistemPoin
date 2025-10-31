// === CATATAN-PELANGGARAN.JS ===
document.addEventListener("DOMContentLoaded", () => {
  // ==== Utilitas LocalStorage ====
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  const students = getData("students");
  let violations = getData("violations");

  // ==== Elemen ====
  const selStudent = document.getElementById("violationStudent");
  const violationType = document.getElementById("violationType");
  const violationPoints = document.getElementById("violationPoints");
  const violationForm = document.getElementById("violationForm");
  const searchInput = document.getElementById("searchViolation");
  const clearBtn = document.getElementById("clearViolations");
  const printBtn = document.getElementById("printReport");
  const tableBody = document.querySelector("#violationsTable tbody");

  // ==== Isi Dropdown Murid ====
  function fillStudentOptions() {
    selStudent.innerHTML = '<option value="">-- Pilih Murid --</option>';
    students.forEach((s, i) => {
      selStudent.innerHTML += `<option value="${i}">${s.name} — ${s.class}</option>`;
    });
  }

  // ==== Render Tabel Pelanggaran ====
  function renderTable(filter = "") {
    const q = filter.toLowerCase();
    const filtered = violations.filter(v => {
      const name = students[v.studentIndex]?.name?.toLowerCase() || "";
      return (
        name.includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.note || "").toLowerCase().includes(q)
      );
    });

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="muted center">Belum ada catatan pelanggaran</td></tr>`;
      drawBarChart("chartCanvas2", [], []);
      return;
    }

    filtered.slice().reverse().forEach((v, i) => {
      const s = students[v.studentIndex];
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s ? s.name : "(Tidak ditemukan)"}</td>
        <td>${v.type}</td>
        <td>${v.date}</td>
        <td>${v.points}</td>
        <td>${v.note || ""}</td>
        <td>
          <button class="btn small" onclick="editViolation(${violations.indexOf(v)})">Edit</button>
          <button class="btn small danger" onclick="deleteViolation(${violations.indexOf(v)})">Hapus</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Update chart
    const counts = {};
    violations.forEach(v => counts[v.type] = (counts[v.type] || 0) + 1);
    drawBarChart("chartCanvas2", Object.keys(counts), Object.values(counts));
  }

  // ==== Tambah / Edit Pelanggaran ====
  violationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentIndex = selStudent.value;
    if (studentIndex === "") return alert("Pilih murid terlebih dahulu.");

    const newData = {
      studentIndex: Number(studentIndex),
      type: violationType.options[violationType.selectedIndex].text,
      date: document.getElementById("violationDate").value,
      note: document.getElementById("violationNote").value.trim(),
      points: Number(violationPoints.value) || 0
    };

    violations.push(newData);
    saveData("violations", violations);
    violationForm.reset();
    violationPoints.value = "";
    renderTable();
  });

  // ==== Hapus satu pelanggaran ====
  window.deleteViolation = (index) => {
    if (confirm("Hapus catatan ini?")) {
      violations.splice(index, 1);
      saveData("violations", violations);
      renderTable();
    }
  };

  // ==== Edit pelanggaran ====
  window.editViolation = (index) => {
    const v = violations[index];
    const s = students[v.studentIndex];
    if (!s) return alert("Data murid tidak ditemukan.");

    if (confirm("Muat data ke form untuk diedit? Setelah disimpan akan menambah catatan baru.")) {
      selStudent.value = v.studentIndex;
      violationType.value = v.points;
      document.getElementById("violationDate").value = v.date;
      document.getElementById("violationNote").value = v.note;
      violationPoints.value = v.points;

      violations.splice(index, 1);
      saveData("violations", violations);
      renderTable();
    }
  };

  // ==== Bersihkan Semua ====
  clearBtn.addEventListener("click", () => {
    if (confirm("Hapus semua catatan pelanggaran?")) {
      violations = [];
      saveData("violations", violations);
      renderTable();
    }
  });

  // ==== Cetak ====
  printBtn.addEventListener("click", () => window.print());

  // ==== Filter Cari ====
  searchInput.addEventListener("input", (e) => renderTable(e.target.value));

  // ==== Otomatis isi poin ====
  violationType.addEventListener("change", function () {
    violationPoints.value = this.value;
  });

  // ==== Chart (fungsi sederhana) ====
  function drawBarChart(canvasId, labels, values) {
    const c = document.getElementById(canvasId);
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    if (labels.length === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px Inter";
      ctx.fillText("Tidak ada data", 20, 40);
      return;
    }

    const padding = 40;
    const chartW = c.width - padding * 2;
    const chartH = c.height - padding * 2;
    const max = Math.max(...values, 1);
    const barW = Math.max(24, chartW / labels.length - 18);

    ctx.strokeStyle = "#e6eef7";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartH);
    ctx.lineTo(padding + chartW, padding + chartH);
    ctx.stroke();

    labels.forEach((lab, i) => {
      const val = values[i];
      const x = padding + 12 + i * (barW + 18);
      const h = (val / max) * (chartH - 20);
      const y = padding + chartH - h;
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, "#1473e6");
      g.addColorStop(1, "#0b66c3");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, barW, h);
      ctx.fillStyle = "#334155";
      ctx.font = "12px Inter";
      ctx.fillText(lab, x, padding + chartH + 16);
      ctx.fillStyle = "#0f1724";
      ctx.font = "13px Inter";
      ctx.fillText(val, x, y - 8);
    });
  }

  // ==== Inisialisasi ====
  fillStudentOptions();
  renderTable();
});
