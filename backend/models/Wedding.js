const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weddingSchema = new Schema({
  user: { // 🔥 Relation avec l'utilisateur
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },

  guests: [{ type: Schema.Types.ObjectId, ref: 'Guest' }],
  vendors: [{ type: Schema.Types.ObjectId, ref: 'Vendor' }],
  budget: { type: Schema.Types.ObjectId, ref: 'Budget' },

  theme: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wedding', weddingSchema);
