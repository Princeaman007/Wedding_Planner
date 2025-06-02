const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  user: { // 🔥 Ajout du lien avec l'utilisateur
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wedding: { 
    type: Schema.Types.ObjectId, 
    ref: 'Wedding',
    required: true
  },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['catering', 'photography', 'venue', 'music', 'flowers', 'decoration', 'other']
  },
  contactPerson: String,
  email: String,
  phone: String,
  price: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  notes: String
});

module.exports = mongoose.model('Vendor', vendorSchema);
