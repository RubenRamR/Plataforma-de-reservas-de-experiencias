// Frontend/components/pagoReserva.js
import { payReservation } from "../api/paymentsApi.js";

const statusDiv = document.getElementById("status");
const payBtn = document.getElementById("pay-btn");
const reservationInfoDiv = document.getElementById("reservation-info");

function setStatus(type, message) {
  statusDiv.textContent = message;
  statusDiv.className = "status";
  if (type === "error") statusDiv.classList.add("error");
  if (type === "success") statusDiv.classList.add("success");
}

// Helper para leer query params (?reservationId=...)
function getReservationIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("reservationId");
}

document.addEventListener("DOMContentLoaded", () => {
  const reservationId = getReservationIdFromUrl();
  if (!reservationId) {
    setStatus("error", "Falta el ID de la reserva en la URL.");
    payBtn.disabled = true;
    return;
  }

  // Podrías mostrar info básica de la reserva desde localStorage o desde otra llamada
  reservationInfoDiv.textContent = `Vas a pagar la reserva con ID: ${reservationId}`;

  payBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const status = localStorage.getItem("status");

    if (!token) {
      setStatus("error", "Debes iniciar sesión para pagar.");
      return;
    }

    if (role !== "Visitante" || status !== "Aprobado") {
      setStatus("error", "Solo un visitante aprobado puede pagar una reserva.");
      return;
    }

    payBtn.disabled = true;
    payBtn.textContent = "Procesando pago...";

    try {
      const result = await payReservation(token, reservationId);
      console.log("Pago OK:", result);

      setStatus("success", result.message || "Pago realizado con éxito.");

      // Redirigir a "Mis reservas" después de unos segundos
      setTimeout(() => {
        window.location.href = "/mis-reservas.html"; // ajusta a tu ruta real
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.status === 400 || err.status === 404) {
        setStatus("error", err.data?.message || "No se pudo completar el pago.");
      } else if (err.status === 403) {
        setStatus("error", err.data?.message || "No tienes permiso para pagar esta reserva.");
      } else {
        setStatus("error", "Error de servidor al realizar el pago.");
      }
    } finally {
      payBtn.disabled = false;
      payBtn.textContent = "Pagar ahora";
    }
  });
});
