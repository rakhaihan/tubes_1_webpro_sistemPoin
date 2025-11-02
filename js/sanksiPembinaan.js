
document.addEventListener("DOMContentLoaded", () => {
    requireLogin();
    setupLogout();
    setupSidebarToggle();
    ensureInitialData();

    const modal = document.getElementById("sanctionModal");
    const openBtn = document.getElementById("addSanctionBtn");
    const closeBtn = document.getElementById("closeModal");
    const form = document.getElementById("sanctionForm");
    const table = document.querySelector("#sanctionsTable tbody");
    const selectStudent = document.getElementById("sanctionStudent");
    const sanctionType = document.getElementById("sanctionType");
    const sanctionDate = document.getElementById("sanctionDate");

    let students = getData("students");
    let violations = getData("violations");
    let sanctions = getData("sanctions");

    // ----------------- Migrasi jika perlu -----------------
    (function migrateViolationsIfNeeded() {
        try {
            const raw = localStorage.getItem("violations");
            if (!raw) return;
            const arr = JSON.parse(raw);
            const need = arr.some(v => v.studentIndex == null || v.points == null);
            if (!need) {
                violations = arr;
                return;
            }
            const migrated = arr.map(v => {
                let idx = null;
                if (v.hasOwnProperty("studentIndex")) {
                    const n = Number(v.studentIndex);
                    idx = Number.isNaN(n) ? null : n;
                } else if (v.name) {
                    const found = (students || []).findIndex(s => s.name === v.name);
                    idx = found === -1 ? null : found;
                }
                const maybePoints = Number(v.points ?? v.typeValue ?? (parseInt(v.type, 10) || 0)) || 0;
                return {
                    studentIndex: idx,
                    name: v.name || (idx != null && students[idx] ? students[idx].name : ""),
                    typeText: v.typeText || v.type || "",
                    typeValue: (v.typeValue != null) ? String(v.typeValue) : (maybePoints ? String(maybePoints) : ""),
                    date: v.date || v.tanggal || "",
                    note: v.note || v.keterangan || "",
                    points: Number(maybePoints)
                };
            });
            localStorage.setItem("violations", JSON.stringify(migrated));
            violations = migrated;
            console.info("Migrasi violations selesai:", migrated.length);
        } catch (err) {
            console.warn("Migrasi violations error:", err);
        }
    })();

    // --------------- Helper: hitung poin ---------------
    function totalPoinSiswaByIndex(studentIndex) {
        if (typeof studentIndex !== "number" || Number.isNaN(studentIndex)) return 0;
        violations = getData("violations") || [];
        return violations
            .filter(v => Number(v.studentIndex) === studentIndex)
            .reduce((sum, v) => sum + (Number(v.points) || Number(v.typeValue) || 0), 0);
    }

    function tentukanSanksi(poin) {
        if (poin >= 100) return "Skorsing 3 Hari";
        if (poin >= 75) return "Skorsing 1 Hari";
        if (poin >= 50) return "Surat Peringatan 3";
        if (poin >= 25) return "Surat Peringatan 2";
        if (poin > 0) return "Surat Peringatan 1";
        return "Tidak Ada Sanksi";
    }

    
    function populateStudentDropdown() {
        students = getData("students") || [];
        if (!selectStudent) return;
        if (!students.length) {
            selectStudent.innerHTML = `<option disabled selected>Belum ada murid</option>`;
            selectStudent.disabled = true;
        } else {
            selectStudent.disabled = false;
            selectStudent.innerHTML = students.map((s, idx) =>
                `<option value="${idx}">${s.name}${s.class ? " — " + s.class : ""}</option>`
            ).join("");
        }
    }

   
    populateStudentDropdown();

    function evaluateSanctionForSelected() {
        const idx = Number(selectStudent.value);
        if (Number.isNaN(idx)) {
            sanctionType.value = "";
            return;
        }
        const poin = totalPoinSiswaByIndex(idx);
        sanctionType.value = tentukanSanksi(poin);
    }

    if (selectStudent) {
        selectStudent.addEventListener("change", evaluateSanctionForSelected);
    }

    if (openBtn && modal) {
        openBtn.addEventListener("click", () => {
            
            students = getData("students") || [];
            violations = getData("violations") || [];
            sanctions = getData("sanctions") || [];
            populateStudentDropdown();
            form.reset();
            sanctionType.value = "";
            
            if (selectStudent && selectStudent.options.length > 0 && !selectStudent.disabled) {
                selectStudent.selectedIndex = 0;
                evaluateSanctionForSelected();
            }
            modal.classList.add("show");
        });
    }

    if (closeBtn) closeBtn.addEventListener("click", () => modal.classList.remove("show"));
    window.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

    
    function renderTable(data = getData("sanctions") || []) {
        if (!table) return;
        sanctions = data;
        if (!sanctions.length) {
            table.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data</td></tr>`;
            return;
        }
        students = getData("students") || [];
        violations = getData("violations") || [];
        table.innerHTML = sanctions.map((rec, i) => {
            const displayName = (typeof rec.studentIndex === "number" && students[rec.studentIndex]) ?
                students[rec.studentIndex].name :
                (rec.name || "—");
            let points = (typeof rec.points === "number") ? rec.points : null;
            if (points == null && typeof rec.studentIndex === "number") {
                points = totalPoinSiswaByIndex(rec.studentIndex);
            }
            points = (points == null) ? "—" : points;
            return `
        <tr>
            <td>${displayName}</td>
            <td>${points}</td>
            <td>${rec.type}</td>
            <td>${formatDate(rec.date)}</td>
            <td>${rec.status}</td>
            <td><button class="btn small danger" onclick="deleteSanction(${i})">Hapus</button></td>
        </tr>
        `;
        }).join("");
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!sanctionDate.value) { alert("Tanggal sanksi harus diisi!"); return; }
            const idx = Number(selectStudent.value);
            const computedPoints = Number.isNaN(idx) ? 0 : totalPoinSiswaByIndex(idx);
            const s = {
                studentIndex: Number.isNaN(idx) ? null : idx,
                name: (students[idx] && students[idx].name) || selectStudent.options[selectStudent.selectedIndex]?.text || "",
                type: sanctionType.value || "Tidak Ada Sanksi",
                date: sanctionDate.value,
                status: document.getElementById("sanctionStatus").value,
                points: computedPoints
            };
            sanctions = getData("sanctions") || [];
            sanctions.push(s);
            saveData("sanctions", sanctions);
            renderTable(sanctions);
            modal.classList.remove("show");
            showPopupMessage("✅ Data sanksi berhasil ditambahkan!");
        });
    }

    window.deleteSanction = (index) => {
        sanctions = getData("sanctions") || [];
        if (!sanctions[index]) return;
        if (confirm("Yakin hapus data ini?")) {
            sanctions.splice(index, 1);
            saveData("sanctions", sanctions);
            renderTable(sanctions);
            showPopupMessage("🗑️ Data sanksi dihapus");
        }
    };

    function showPopupMessage(msg) {
        const popup = document.createElement("div");
        popup.className = "popup-msg";
        popup.textContent = msg;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add("show"), 10);
        setTimeout(() => popup.classList.remove("show"), 2000);
        setTimeout(() => popup.remove(), 2500);
    }

    (function quickCheck() {
        students = getData("students") || [];
        violations = getData("violations") || [];
        sanctions = getData("sanctions") || [];
        console.info("QuickCheck:", { students: students.length, violations: violations.length, sanctions: sanctions.length });
        if (violations[0]) console.debug("violations[0]:", violations[0]);
        if (students[0]) console.debug("students[0]:", students[0]);
    })();

    renderTable(getData("sanctions") || []);
});
