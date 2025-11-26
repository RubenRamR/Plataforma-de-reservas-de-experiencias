// Frontend/components/crearExperiencia.js
import { createExperience } from "../api/experiencesApi.js";

const form = document.getElementById("experience-form");
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

  const token = localStorage.getItem("token");
  if (!token) {
    setStatus(
      "error",
      "No hay sesión iniciada. Inicia sesión como proveedor aprobado."
    );
    return;
  }

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const date = document.getElementById("date").value;
  const capacity = parseInt(document.getElementById("capacity").value, 10);

  if (!name || !description || isNaN(price) || !date || isNaN(capacity)) {
    setStatus("error", "Por favor llena todos los campos correctamente.");
    return;
  }

  const payload = {
    name,
    description,
    price,
    date: new Date(date).toISOString(),
    capacity,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Creando...";

  try {
    const created = await createExperience(token, payload);
    console.log("Experiencia creada:", created);
    window.location.href = "/proveedor/experiencias.html";

  } catch (err) {
    console.error(err);
    if (err.status === 403) {
      setStatus(
        "error",
        err.data?.message ||
          "No tienes permiso para crear experiencias (proveedor no aprobado)."
      );
    } else if (err.status === 401) {
      setStatus(
        "error",
        err.data?.message ||
          "Sesión inválida o expirada. Vuelve a iniciar sesión."
      );
    } else {
      setStatus(
        "error",
        err.data?.message || "Error al crear la experiencia en el servidor."
      );
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Crear experiencia";
  }
});
