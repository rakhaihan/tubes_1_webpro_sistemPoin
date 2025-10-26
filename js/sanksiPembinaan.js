document.addEventListener('DOMContentLoaded', () => {
    const studentSelect = document.getElementById('sanctionStudent');
    const sanctionForm = document.getElementById('sanctionForm');
    const sanctionsTable = document.querySelector('#sanctionsTable tbody');
    const clearBtn = document.getElementById('clearSanctions');
    const logoutBtn = document.getElementById('logoutBtn4');
    const toggleBtn = document.getElementById('sidebarToggle');

    // --- Load murid ke dropdown ---
    const muridList = JSON.parse(localStorage.getItem('muridList')) || [];
    studentSelect.innerHTML = muridList.length
        ? muridList.map(m => `<option value="${m.nama}">${m.nama}</option>`).join('')
        : '<option value="">(Belum ada data murid)</option>';

    // --- Load data sanksi ---
    let sanctions = JSON.parse(localStorage.getItem('sanctionsList')) || [];

    const renderTable = () => {
        sanctionsTable.innerHTML = sanctions.length
            ? sanctions.map((s, i) => `
        <tr>
            <td>${s.nama}</td>
            <td>${s.jenis}</td>
            <td>${s.tanggal}</td>
            <td>${s.status}</td>
            <td><button class="btn small danger" data-index="${i}">Hapus</button></td>
        </tr>
        `).join('')
            : '<tr><td colspan="5" class="muted">Belum ada data sanksi</td></tr>';
    };

    renderTable();

    // --- Simpan data sanksi baru ---
    sanctionForm.addEventListener('submit', e => {
        e.preventDefault();
        const nama = studentSelect.value;
        const jenis = document.getElementById('sanctionType').value.trim();
        const tanggal = document.getElementById('sanctionDate').value;
        const status = document.getElementById('sanctionStatus').value;

        if (!nama || !jenis || !tanggal) {
            alert('Lengkapi semua data sanksi!');
            return;
        }

        sanctions.push({ nama, jenis, tanggal, status });
        localStorage.setItem('sanctionsList', JSON.stringify(sanctions));
        sanctionForm.reset();
        renderTable();
    });

    // --- Hapus 1 sanksi ---
    sanctionsTable.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            if (confirm('Hapus data sanksi ini?')) {
                sanctions.splice(index, 1);
                localStorage.setItem('sanctionsList', JSON.stringify(sanctions));
                renderTable();
            }
        }
    });

    // --- Hapus semua sanksi ---
    clearBtn.addEventListener('click', () => {
        if (confirm('Hapus semua data sanksi?')) {
            sanctions = [];
            localStorage.setItem('sanctionsList', JSON.stringify(sanctions));
            renderTable();
        }
    });

    // --- Logout ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    // --- Sidebar toggle (mobile) ---
    toggleBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
    });
});
