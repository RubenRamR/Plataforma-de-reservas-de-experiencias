import { registerProvider } from "../api/authApi.js";

const form = document.getElementById("register-provider-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtener valores (Ajusta los IDs según tu HTML)
    const name = document.getElementById("prov-name").value;
    const email = document.getElementById("prov-email").value;
    const password = document.getElementById("prov-password").value;

    try {
      await registerProvider({ name, email, password });

      alert("Registro exitoso. Tu cuenta está PENDIENTE de aprobación por un administrador.");
      window.location.href = "/login.html";

    } catch (err) {
      console.error(err);
      alert("Error al registrar: " + (err.data?.message || "Intente de nuevo"));
    }
  });
}