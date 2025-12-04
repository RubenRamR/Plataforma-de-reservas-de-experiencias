// Backend/api/reservations/publicReservations.routes.js

import express from "express";
import Reservation from "../../models/Reservation.js";

const router = express.Router();

/**
 * GET /api/v1/public/reservations?email=correo@example.com
 * Consulta reservas por email (visitante)
 */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    const reservas = await Reservation.find({ email })
      .populate("experience")
      .sort({ date: -1 });

    res.json(reservas);
  } catch (error) {
    console.error("Error obteniendo reservas:", error);
    res.status(500).json({ message: "Error al obtener reservas" });
  }
});

export default router;
