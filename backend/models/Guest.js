const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestSchema = new Schema({
  user: { // 🔥 Ajout de la relation utilisateur
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wedding: { 
    type: Schema.Types.ObjectId, 
    ref: 'Wedding',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String,
    trim: true,
    lowercase: true
  },
  phone: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending'
  },
  plusOne: { type: Boolean, default: false },
  dietaryRestrictions: String,
  tableNumber: Number
});

module.exports = mongoose.model('Guest', guestSchema);
