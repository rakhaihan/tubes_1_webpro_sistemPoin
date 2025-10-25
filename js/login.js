const app = (function () {
  const KEY = {
    AUTH: "sp_auth",
    STUDENTS: "sp_students_v1",
    VIOLATIONS: "sp_violations_v1",
    SANCTIONS: "sp_sanctions_v1",
  };

  function uuid() {
    return "id-" + Math.random().toString(36).slice(2, 9);
  }
  function nowDate() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }
  function save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch (e) {
      return null;
    }
  }

  const data = {
    getAllStudents() {
      return load(KEY.STUDENTS) || [];
    },
    addStudent(s) {
      const arr = this.getAllStudents();
      const ent = {
        id: uuid(),
        name: s.name,
        class: s.class,
        nis: s.nis,
        status: s.status || "aktif",
      };
      arr.push(ent);
      save(KEY.STUDENTS, arr);
      return ent;
    },
    getStudent(id) {
      return this.getAllStudents().find((x) => x.id === id);
    },
    updateStudent(newS) {
      const arr = this.getAllStudents().map((s) =>
        s.id === newS.id ? { ...s, ...newS } : s
      );
      save(KEY.STUDENTS, arr);
    },
    deleteStudent(id) {
      const arr = this.getAllStudents().filter((s) => s.id !== id);
      save(KEY.STUDENTS, arr);
      const vs = this.getAllViolations().filter((v) => v.studentId !== id);
      save(KEY.VIOLATIONS, vs);
      const ss = this.getAllSanctions().filter((s) => s.studentId !== id);
      save(KEY.SANCTIONS, ss);
    },

    getAllViolations() {
      return load(KEY.VIOLATIONS) || [];
    },
    addViolation(v) {
      const arr = this.getAllViolations();
      arr.push(v);
      save(KEY.VIOLATIONS, arr);
    },
    getViolation(id) {
      return this.getAllViolations().find((x) => x.id === id);
    },
    deleteViolation(id) {
      const arr = this.getAllViolations().filter((x) => x.id !== id);
      save(KEY.VIOLATIONS, arr);
    },
    clearViolations() {
      save(KEY.VIOLATIONS, []);
    },

    getAllSanctions() {
      return load(KEY.SANCTIONS) || [];
    },
    addSanction(s) {
      const arr = this.getAllSanctions();
      arr.push(s);
      save(KEY.SANCTIONS, arr);
    },
    getSanction(id) {
      return this.getAllSanctions().find((x) => x.id === id);
    },
    updateSanction(s) {
      const arr = this.getAllSanctions().map((x) => (x.id === s.id ? s : x));
      save(KEY.SANCTIONS, arr);
    },
    deleteSanction(id) {
      const arr = this.getAllSanctions().filter((x) => x.id !== id);
      save(KEY.SANCTIONS, arr);
    },
    clearSanctions() {
      save(KEY.SANCTIONS, []);
    },

    findStudentName(id) {
      const s = this.getAllStudents().find((x) => x.id === id);
      return s ? s.name : "(–)";
    },
    ensureDemo() {},
  };

  const auth = {
    login(u, p) {
      if (u === "admin" && p === "1234") {
        localStorage.setItem(
          KEY.AUTH,
          JSON.stringify({ user: "admin", ts: Date.now() })
        );
        return true;
      }
      return false;
    },
    logout() {
      localStorage.removeItem(KEY.AUTH);
    },
    isAuthenticated() {
      return !!load(KEY.AUTH);
    },
    requireAuth() {
      if (!this.isAuthenticated()) {
        location.href = "index.html";
      }
    },
  };

  const util = {
    uuid,
    exportCSV(arr, keys) {
      if (!arr || !arr.length) return "";
      const k = keys || Object.keys(arr[0]);
      const rows = [k.join(",")].concat(
        arr.map((obj) =>
          k
            .map((h) => {
              let v =
                obj[h] === undefined || obj[h] === null ? "" : String(obj[h]);
              v = v.replace(/"/g, '""');
              return `"${v}"`;
            })
            .join(",")
        )
      );
      return rows.join("\\n");
    },
    downloadFile(content, filename = "export.txt", mime = "text/plain") {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
  };

  return { data, auth, util };
})();

function drawBarChart(canvasId, labels, values) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  if (!labels || !labels.length) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px Inter";
    ctx.fillText("Tidak ada data", 20, 40);
    return;
  }
  const padding = 40;
  const chartW = c.width - padding * 2;
  const chartH = c.height - padding * 2;
  const max = Math.max(...values) || 1;
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
