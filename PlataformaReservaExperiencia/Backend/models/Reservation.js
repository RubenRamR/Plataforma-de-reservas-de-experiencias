const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  slots: { 
    type: Number, 
    required: true,
    min: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending_payment', 'confirmed', 'cancelled'],
    default: 'pending_payment'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reservation', ReservationSchema);