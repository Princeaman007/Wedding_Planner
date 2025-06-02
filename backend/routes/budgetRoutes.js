const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth'); // 🔐 middleware JWT

// ✅ Créer un budget (lié à l'utilisateur connecté)
router.post('/', auth, async (req, res) => {
  try {
    const newBudget = new Budget({
      ...req.body,
      user: req.user.id // 👈 Ajoute le user connecté
    });

    const savedBudget = await newBudget.save();

    // Mettre à jour le mariage associé avec la référence au budget
    await Wedding.findByIdAndUpdate(
      req.body.wedding,
      { budget: savedBudget._id }
    );

    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Lire tous les budgets du user connecté
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Lire un budget par ID (si appartient au user)
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id })
      .populate('wedding')
      .populate('items.vendor');

    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Lire le budget d'un mariage (si user propriétaire)
router.get('/wedding/:weddingId', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ wedding: req.params.weddingId, user: req.user.id })
      .populate('items.vendor');

    if (!budget) return res.status(404).json({ message: 'Budget not found for this wedding' });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Mettre à jour un budget (vérification user)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.status(200).json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Ajouter un item à un budget (sécurisé)
router.post('/:id/items', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.items.push(req.body);
    const updatedBudget = await budget.save();

    res.status(201).json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Modifier un item d’un budget (sécurisé)
router.put('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const itemIndex = budget.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Budget item not found' });

    budget.items[itemIndex] = { ...budget.items[itemIndex].toObject(), ...req.body };
    const updatedBudget = await budget.save();

    res.status(200).json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Supprimer un item
router.delete('/:id/items/:itemId', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.items = budget.items.filter(item => item._id.toString() !== req.params.itemId);
    const updatedBudget = await budget.save();

    res.status(200).json({ message: 'Budget item deleted', budget: updatedBudget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Supprimer un budget complet
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    await Wedding.findByIdAndUpdate(budget.wedding, { $unset: { budget: 1 } });
    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
