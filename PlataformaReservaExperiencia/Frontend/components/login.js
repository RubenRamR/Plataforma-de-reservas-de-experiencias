import { loginUser } from "../api/authApi.js";

const form = document.getElementById("login-form");
const errorDiv = document.getElementById("login-error");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorDiv) errorDiv.textContent = "";

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role); 
      const { role, status } = data.user;

      if (role === "Admin") {
        window.location.href = "/admin-verificaciones.html";
      } else if (role === "Proveedor") {
        if (status === "Pendiente") {
            alert("Tu cuenta está pendiente de aprobación.");
        } else {
            window.location.href = "/crear-experiencia.html";
        }
      } else {
        window.location.href = "/home.html";
      }

    } catch (err) {
      console.error(err);
      if (errorDiv) errorDiv.textContent = err.data?.message || "Credenciales incorrectas";
      alert("Error: " + (err.data?.message || "Credenciales incorrectas"));
    }
  });
}