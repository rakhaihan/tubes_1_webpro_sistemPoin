document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("loggedInUser", username);
      window.location.href = "dashboard.html";
    } else {
      errorMsg.textContent = "Username atau password salah!";
    }
  });
});
