const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetItemSchema = new Schema({
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['venue', 'catering', 'attire', 'photography', 'music', 'decoration', 'transportation', 'other']
  },
  estimatedCost: { type: Number, required: true },
  actualCost: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' }
});

const budgetSchema = new Schema({
  user: { // 👈 Nouvelle relation avec User
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wedding: { 
    type: Schema.Types.ObjectId, 
    ref: 'Wedding',
    required: true
  },
  totalBudget: { type: Number, required: true },
  items: [budgetItemSchema],
  notes: String
});

module.exports = mongoose.model('Budget', budgetSchema);
