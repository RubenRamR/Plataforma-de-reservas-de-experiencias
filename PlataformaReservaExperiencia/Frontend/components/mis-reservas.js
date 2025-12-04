import { getReservationsByEmail } from "../api/reservationsApi.js";

const emailInput = document.getElementById("emailInput");
const searchBtn  = document.getElementById("searchBtn");
const statusMsg  = document.getElementById("statusMsg");
const container  = document.getElementById("reservasContainer");

searchBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  container.innerHTML = "";
  statusMsg.textContent = "";

  if (!email) {
    statusMsg.textContent = "Ingresa un correo por favor.";
    statusMsg.className = "status error";
    return;
  }

  try {
    statusMsg.textContent = "Buscando...";
    statusMsg.className = "status";

    const reservas = await getReservationsByEmail(email);

    if (reservas.length === 0) {
      statusMsg.textContent = "No tienes reservas registradas.";
      statusMsg.className = "status";
      return;
    }

    statusMsg.textContent = `Se encontraron ${reservas.length} reservas.`;
    statusMsg.className = "status success";

    reservas.forEach((r) => {
      const card = document.createElement("div");
      card.className = "reserva-card";

      card.innerHTML = `
        <h3>${r.experience?.name || "Experiencia eliminada"}</h3>

        <p><strong>Fecha de la experiencia:</strong> 
        ${new Date(r.experience?.date).toLocaleDateString()}</p>

        <p><strong>Personas reservadas:</strong> ${r.quantity}</p>

        <p><strong>Total pagado:</strong> $${r.totalAmount}</p>

        <p><strong>Estado:</strong> 
          <span class="${r.status === "paid" ? "status-paid" : "status-pending"}">
            ${r.status === "paid" ? "Pagada" : "Pendiente"}
          </span>
        </p>

        <p><strong>Folio de pago:</strong> ${r.paymentId || "No asignado"}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    statusMsg.textContent = error.message || "Error al buscar reservas";
    statusMsg.className = "status error";
  }
});
