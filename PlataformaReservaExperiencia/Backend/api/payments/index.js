// routes/api/payments.js (por ejemplo)
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Reservation = require("../../models/Reservation");
const Experience = require("../../models/Experience");

// POST /api/v1/payments/pay
// Body: { reservationId }
// Simula la confirmación de un pago exitoso para una reserva pendiente
router.post("/pay", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Solo visitantes aprobados pueden pagar reservas
    if (user.role !== "Visitante" || user.status !== "Aprobado") {
      return res.status(403).json({ message: "Prohibido: solo visitantes aprobados pueden pagar reservas" });
    }

    const { reservationId } = req.body;
    if (!reservationId) {
      return res.status(400).json({ message: "reservationId es requerido" });
    }

    // Buscar reserva pendiente de este usuario
    const reservation = await Reservation.findOne({
      _id: reservationId,
      visitor: user._id,
      status: "PendientePago",
    }).populate("experience");

    if (!reservation) {
      return res.status(404).json({
        message: "Reserva no encontrada o ya pagada/cancelada",
      });
    }

    // (Opcional) verificar que haya lugares disponibles aún
    if (reservation.experience.spotsAvailable < reservation.spots) {
      return res.status(400).json({
        message: "No hay suficientes lugares disponibles para completar el pago",
      });
    }

    // "Simulación de pasarela externa":
    // Aquí *en un sistema real* irías a Stripe/MercadoPago y solo
    // al recibir el webhook confirmarías el pago.
    // Para el proyecto, asumimos que el pago fue exitoso.

    reservation.status = "Pagada";
    await reservation.save();

    // Decrementar lugares disponibles en la experiencia
    reservation.experience.spotsAvailable -= reservation.spots;
    await reservation.experience.save();

    return res.json({
      message: "Pago realizado exitosamente. Reserva confirmada.",
      reservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al procesar el pago" });
  }
});

module.exports = router;
