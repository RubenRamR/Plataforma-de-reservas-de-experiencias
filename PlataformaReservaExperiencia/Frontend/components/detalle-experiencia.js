// Frontend/components/detalle-experiencia.js

import { getExperienceById } from "../api/experiencesApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("details");

  if (!id) {
    container.innerHTML = "<p>Error: No se proporcionó ID de experiencia.</p>";
    return;
  }

  try {
    const exp = await getExperienceById(id);

    const fechaFormateada = new Date(exp.date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    container.innerHTML = `
      <h1>${exp.name}</h1>

      <div class="detail-info">
        <p><strong>Descripción:</strong> ${exp.description}</p>
        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p><strong>Precio:</strong> $${exp.price} MXN</p>
        <p><strong>Duración:</strong> ${exp.duration || "No especificado"}</p>
        <p><strong>Capacidad total:</strong> ${exp.capacity}</p>
        <p><strong>Lugares disponibles:</strong> ${exp.spotsAvailable ?? "N/A"}</p>

        <hr style="margin: 1rem 0;">

        <h3>Información del proveedor</h3>
        <p><strong>Nombre:</strong> ${exp.provider?.name || "No disponible"}</p>
        <p><strong>Contacto:</strong> ${
          exp.provider?.contact || "No proporcionado"
        }</p>
        <p><strong>Teléfono:</strong> ${
          exp.provider?.phone || "No disponible"
        }</p>
      </div>

      <button class="btn btn-reservar" onclick="alert('Aquí va la lógica de reservar — HU-08')">
        Reservar experiencia
      </button>
    `;
  } catch (error) {
    container.innerHTML = "<p>Error cargando la experiencia.</p>";
    console.error(error);
  }
});
