// --- DASHBOARD.JS --- //
document.addEventListener("DOMContentLoaded", () => {
  requireLogin();
  setupLogout();
  setupSidebarToggle();

  const violations = getData("violations");
  const students = getData("students");

  // Hitung total pelanggaran
  document.getElementById("statTotal").textContent = violations.length;

  // Hitung siswa di pembinaan
  const pembinaanCount = students.filter(s => s.status === "pembinaan").length;
  document.getElementById("statPembinaan").textContent = pembinaanCount;

  // Hitung siswa dengan poin tinggi
  const alertCount = violations.reduce((acc, v) => {
    acc[v.name] = (acc[v.name] || 0) + Number(v.points);
    return acc;
  }, {});
  const batas = 50;
  const alertStudents = Object.values(alertCount).filter(p => p >= batas).length;
  document.getElementById("statAlert").textContent = alertStudents;

  // Tabel pelanggaran terakhir
  const tbody = document.querySelector("#recentTable tbody");
  tbody.innerHTML = violations.slice(-5).reverse().map(v => `
    <tr>
      <td>${v.name}</td>
      <td>${v.type}</td>
      <td>${formatDate(v.date)}</td>
    </tr>`).join("");

  // === Chart Tren Pelanggaran ===
  const canvas = document.getElementById("chartCanvas");
  if (canvas && violations.length > 0) {
    const ctx = canvas.getContext("2d");

    // Kelompokkan berdasarkan jenis pelanggaran
    const grouped = violations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const counts = Object.values(grouped);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Jumlah Pelanggaran",
          data: counts,
          backgroundColor: "rgba(11, 102, 195, 0.7)"
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,        // <- tampil 1, 2, 3, bukan 0.5
              precision: 0
            }
          }
        }
      }
    });
  }
});
