const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const authMiddleware = require('../middleware/auth'); // verifica JWT y rol

// GET /api/v1/admin/pending-providers
router.get('/pending-providers', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Prohibido: solo Admin' });
        }

        const pendingProviders = await User.find({ role: 'Proveedor', status: 'Pendiente' });
        res.json(pendingProviders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener proveedores pendientes' });
    }
});

// PUT /api/v1/admin/approve-provider/:userId
router.put('/approve-provider/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Prohibido: solo Admin' });
        }

        const provider = await User.findById(req.params.userId);
        if (!provider || provider.role !== 'Proveedor') {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        provider.status = 'Aprobado';
        await provider.save();

        res.json({ message: 'Proveedor aprobado', provider });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al aprobar proveedor' });
    }
});

module.exports = router;
