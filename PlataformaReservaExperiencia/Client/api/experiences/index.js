const express = require('express');
const router = express.Router();
const Experience = require('../../models/Experience');
const authMiddleware = require('../../api/middleware/auth'); // middleware para verificar proveedor

// POST /api/v1/experiences
router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = req.user; // del middleware auth

        // Solo proveedores aprobados pueden crear experiencia
        if (user.role !== 'Proveedor' || user.status !== 'Aprobado') {
            return res.status(403).json({ message: 'Prohibido: proveedor no aprobado' });
        }

        const { name, description, price, date, capacity } = req.body;

        const newExperience = new Experience({
            name,
            description,
            price,
            date,
            capacity,
            spotsAvailable: capacity,
            provider: {
                id: user._id,
                name: user.name,
                status: user.status
            }
        });

        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear la experiencia' });
    }
});

// GET /api/v1/public/experiences -> Lista de experiencias aprobadas con filtros opcionales
router.get('/', async (req, res) => {
    try {
        const { priceMin, priceMax, date } = req.query;

        let filter = { 'provider.status': 'Aprobado' };

        if (priceMin) filter.price = { ...filter.price, $gte: Number(priceMin) };
        if (priceMax) filter.price = { ...filter.price, $lte: Number(priceMax) };
        if (date) filter.date = { $gte: new Date(date) };

        const experiences = await Experience.find(filter);
        res.json(experiences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener experiencias' });
    }
});

// GET /api/v1/public/experiences/:id -> Detalle de una experiencia específica
router.get('/:id', async (req, res) => {
    try {
        const experience = await Experience.findOne({
            _id: req.params.id,
            'provider.status': 'Aprobado'
        });

        if (!experience) {
            return res.status(404).json({ message: 'Experiencia no encontrada' });
        }

        res.json(experience);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la experiencia' });
    }
});

module.exports = router;
