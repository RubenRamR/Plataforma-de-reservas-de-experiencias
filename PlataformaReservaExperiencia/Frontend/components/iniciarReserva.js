import { createReservation } from "../api/reservationsApi.js";

const form = document.getElementById("reservation-form");
const btnSubmit = document.getElementById("btn-reservar");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const experienceId = urlParams.get("id");

    const slotsInput = document.getElementById("slots");

    if (!experienceId) {
      alert("Error: No se ha seleccionado una experiencia.");
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Procesando...";

    try {
      const payload = {
        experienceId,
        slots: slotsInput.value,
      };    

      const response = await createReservation(payload);

      alert(
        `Reserva iniciada. Total a pagar: $${response.reservation.totalPrice}`
      );
      window.location.href = `/pago-reserva.html?reservationId=${response.reservation._id}`;
    } catch (err) {
      console.error(err);
      alert(err.message);
      if (err.message.includes("iniciar sesión")) {
        window.location.href = "/login.html";
      }
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Reservar Ahora";
    }
  });
}
