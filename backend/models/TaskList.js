const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskItemSchema = new Schema({
  name: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const taskListSchema = new Schema({
  user: { // 🔐 Relie chaque liste à l'utilisateur qui l'a créée
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wedding: { 
    type: Schema.Types.ObjectId, 
    ref: 'Wedding',
    required: true
  },
  title: { type: String, required: true }, 
  tasks: [taskItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskList', taskListSchema);
