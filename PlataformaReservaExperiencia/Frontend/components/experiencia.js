// Frontend/components/detalle-experiencia.js

import { getExperienceById } from "../api/experiencesApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("details");

  if (!id) {
    container.innerHTML = "<p>ID no proporcionado.</p>";
    return;
  }

  try {
    const exp = await getExperienceById(id);

    container.innerHTML = `
      <h1>${exp.name}</h1>
      <p><strong>Descripción:</strong> ${exp.description}</p>
      <p><strong>Precio:</strong> $${exp.price}</p>
      <p><strong>Fecha:</strong> ${new Date(exp.date).toLocaleDateString()}</p>
      <p><strong>Cupo total:</strong> ${exp.capacity}</p>
      <p><strong>Disponibles:</strong> ${exp.spotsAvailable}</p>
      <p><strong>Proveedor:</strong> ${exp.provider.name}</p>

      <button class="btn" onclick="alert('Aquí irá el botón de reservar (HU-08)')">
        Reservar
      </button>
    `;
  } catch (error) {
    container.innerHTML = "<p>Error cargando detalle.</p>";
    console.error(error);
  }
});
