const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Wedding = require('../models/Wedding');
const auth = require('../middleware/auth'); // 🔐

/*-------------------------
  CRÉATION
--------------------------*/
router.post('/', auth, async (req, res) => {
  try {
    const newVendor = new Vendor({
      ...req.body,
      user: req.user.id // ✅ Lien avec le user
    });

    const savedVendor = await newVendor.save();

    await Wedding.findByIdAndUpdate(
      req.body.wedding,
      { $push: { vendors: savedVendor._id } }
    );

    res.status(201).json(savedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  GET - Tous les vendors du user
--------------------------*/
router.get('/', auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({ user: req.user.id });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET - Vendor par ID
--------------------------*/
router.get('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, user: req.user.id })
      .populate('wedding');

    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.status(200).json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET - Vendors par mariage
--------------------------*/
router.get('/wedding/:weddingId', auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({ wedding: req.params.weddingId, user: req.user.id });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  GET - Vendors par type
--------------------------*/
router.get('/type/:type', auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({ type: req.params.type, user: req.user.id });
    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  PUT - Mettre à jour un vendor
--------------------------*/
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedVendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedVendor) return res.status(404).json({ message: 'Vendor not found' });
    res.status(200).json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  PATCH - Marquer comme payé
--------------------------*/
router.patch('/:id/pay', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, user: req.user.id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    vendor.isPaid = true;
    const updatedVendor = await vendor.save();

    res.status(200).json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  DELETE - Supprimer un vendor
--------------------------*/
router.delete('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, user: req.user.id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    await Wedding.findByIdAndUpdate(
      vendor.wedding,
      { $pull: { vendors: vendor._id } }
    );

    await Vendor.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
