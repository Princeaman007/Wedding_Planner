const express = require('express');
const router = express.Router();
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth'); // 🔐 middleware JWT

/*-------------------------
  CRÉATION
--------------------------*/
router.post('/', auth, async (req, res) => {
  try {
    const newWedding = new Wedding({
      ...req.body,
      user: req.user.id // 🔗 liaison à l'utilisateur
    });

    const savedWedding = await newWedding.save();
    res.status(201).json(savedWedding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  GET - Tous les mariages du user
--------------------------*/
router.get('/', auth, async (req, res) => {
  try {
    const weddings = await Wedding.find({ user: req.user.id });
    res.status(200).json(weddings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET - Mariage par ID (si user)
--------------------------*/
router.get('/:id', auth, async (req, res) => {
  try {
    const wedding = await Wedding.findOne({ _id: req.params.id, user: req.user.id })
      .populate('guests')
      .populate('vendors')
      .populate('budget');

    if (!wedding) return res.status(404).json({ message: 'Wedding not found' });
    res.status(200).json(wedding);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  PUT - Modifier un mariage
--------------------------*/
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedWedding = await Wedding.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedWedding) return res.status(404).json({ message: 'Wedding not found' });
    res.status(200).json(updatedWedding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  DELETE - Supprimer un mariage
--------------------------*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedWedding = await Wedding.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deletedWedding) return res.status(404).json({ message: 'Wedding not found' });

    res.status(200).json({ message: 'Wedding deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/weddings/my
router.get('/my', auth, async (req, res) => {
  try {
    const weddings = await Wedding.find({ user: req.user.id });
    res.status(200).json(weddings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
