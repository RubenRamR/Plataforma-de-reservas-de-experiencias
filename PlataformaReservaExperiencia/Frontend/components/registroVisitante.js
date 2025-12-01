// Frontend/components/registroVisitante.js
import { registerVisitor } from "../api/authApi.js";

const form = document.getElementById("register-form");
const statusDiv = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

function setStatus(type, message) {
  statusDiv.textContent = message;
  statusDiv.className = "status";
  if (type === "error") statusDiv.classList.add("error");
  if (type === "success") statusDiv.classList.add("success");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!name || !email || !password || !confirm) {
    setStatus("error", "Por favor llena todos los campos.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setStatus("error", "Ingresa un correo electrónico válido.");
    return;
  }

  if (password.length < 6) {
    setStatus("error", "La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (password !== confirm) {
    setStatus("error", "Las contraseñas no coinciden.");
    return;
  }

  const payload = {
    name,
    email,
    password,
    role: "Visitante", 
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Registrando...";

  try {
    await registerVisitor(payload);

    setStatus("success", "Registro exitoso. Ahora puedes iniciar sesión.");
    form.reset();

    // redirigir a login después de 1.2s (ajusta ruta si usas otra)
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1200);
  } catch (err) {
    console.error(err);

    if (err.status === 400) {
      setStatus("error", err.data?.message || "Este correo ya está registrado.");
    } else {
      setStatus(
        "error",
        err.data?.message || "Ocurrió un error al registrar el visitante."
      );
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Crear cuenta";
  }
});
