const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    spotsAvailable: { type: Number, required: true },
    provider: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        status: { type: String, enum: ['Pendiente', 'Aprobado', 'Rechazado'], default: 'Pendiente' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema);
