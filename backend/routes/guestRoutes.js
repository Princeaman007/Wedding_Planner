const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth'); // 🔐

/*-------------------------
  CRÉATION
--------------------------*/
router.post('/', auth, async (req, res) => {
  try {
    const newGuest = new Guest({
      ...req.body,
      user: req.user.id // ✅ Lien avec l'utilisateur connecté
    });

    const savedGuest = await newGuest.save();

    await Wedding.findByIdAndUpdate(
      req.body.wedding,
      { $push: { guests: savedGuest._id } }
    );

    res.status(201).json(savedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  GET Tous les invités de l'utilisateur
--------------------------*/
router.get('/', auth, async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user.id });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET invité par ID
--------------------------*/
router.get('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findOne({ _id: req.params.id, user: req.user.id })
      .populate('wedding');

    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET invités d’un mariage
--------------------------*/
router.get('/wedding/:weddingId', auth, async (req, res) => {
  try {
    const guests = await Guest.find({ wedding: req.params.weddingId, user: req.user.id });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET invités par statut
--------------------------*/
router.get('/status/:status', auth, async (req, res) => {
  try {
    const guests = await Guest.find({ status: req.params.status, user: req.user.id });
    res.status(200).json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  PUT mise à jour invité
--------------------------*/
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedGuest = await Guest.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedGuest) return res.status(404).json({ message: 'Guest not found' });
    res.status(200).json(updatedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  PATCH statut
--------------------------*/
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const guest = await Guest.findOne({ _id: req.params.id, user: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    guest.status = req.body.status;
    const updatedGuest = await guest.save();

    res.status(200).json(updatedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  PATCH ajout +1
--------------------------*/
router.patch('/:id/plus-one', auth, async (req, res) => {
  try {
    const guest = await Guest.findOne({ _id: req.params.id, user: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    guest.plusOne = true;
    const updatedGuest = await guest.save();

    res.status(200).json(updatedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  PATCH assignation table
--------------------------*/
router.patch('/:id/table', auth, async (req, res) => {
  try {
    if (!req.body.tableNumber) {
      return res.status(400).json({ message: 'Table number is required' });
    }

    const guest = await Guest.findOne({ _id: req.params.id, user: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    guest.tableNumber = req.body.tableNumber;
    const updatedGuest = await guest.save();

    res.status(200).json(updatedGuest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  DELETE invité
--------------------------*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findOne({ _id: req.params.id, user: req.user.id });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });

    await Wedding.findByIdAndUpdate(
      guest.wedding,
      { $pull: { guests: guest._id } }
    );

    await Guest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
