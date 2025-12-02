const express = require('express');
const router = express.Router();
const Reservation = require('../../models/Reservation');
const Experience = require('../../models/Experience');
const auth = require('../../middleware/auth'); 

// @route   POST /api/v1/reservations
// @desc    Iniciar una reserva (HU-06)
router.post('/', auth, async (req, res) => {
    try {
        const { experienceId, slots } = req.body;
        const slotsRequested = parseInt(slots);

        if (!experienceId || !slotsRequested || slotsRequested < 1) {
            return res.status(400).json({ message: 'Datos de reserva inválidos' });
        }

        const experience = await Experience.findById(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experiencia no encontrada' });
        }

        if (experience.spotsAvailable < slotsRequested) {
            return res.status(400).json({ message: 'No hay suficientes cupos disponibles' });
        }

        const totalPrice = experience.price * slotsRequested;

        const newReservation = new Reservation({
            visitor: req.user._id, 
            experience: experienceId,
            slots: slotsRequested,
            totalPrice,
            status: 'pending_payment'
        });

        await newReservation.save();

        experience.spotsAvailable -= slotsRequested;
        await experience.save();

        res.status(201).json({
            message: 'Reserva iniciada correctamente',
            reservation: newReservation
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al procesar la reserva' });
    }
});

module.exports = router;