const express = require('express');
const router = express.Router();
const TaskList = require('../models/TaskList');
const auth = require('../middleware/auth');

/*-------------------------
  POST - Créer une liste de tâches
--------------------------*/
router.post('/', auth, async (req, res) => {
  try {
    const newList = new TaskList({
      ...req.body,
      user: req.user.id // 🔐 Lien avec le user connecté
    });

    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  GET - Toutes les TaskLists pour un mariage (du user)
--------------------------*/
router.get('/wedding/:weddingId', auth, async (req, res) => {
  try {
    const lists = await TaskList.find({
      wedding: req.params.weddingId,
      user: req.user.id // 🔐 Ne renvoyer que les listes du user
    });
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*-------------------------
  PATCH - Marquer une tâche comme faite / non faite
--------------------------*/
router.patch('/:taskListId/tasks/:taskId/toggle', auth, async (req, res) => {
  try {
    const list = await TaskList.findOne({
      _id: req.params.taskListId,
      user: req.user.id
    });

    if (!list) return res.status(404).json({ message: 'Liste non trouvée' });

    const task = list.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    // 🔁 Toggle done
    task.done = !task.done;

    await list.save();
    res.status(200).json({ message: 'Statut de la tâche mis à jour', task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/*-------------------------
  PUT - Modifier une liste (si elle appartient au user)
--------------------------*/
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await TaskList.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Liste non trouvée' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*-------------------------
  PATCH - Mettre à jour le statut d'une tâche (true ou false)
--------------------------*/
router.patch('/:taskListId/tasks/:taskId', auth, async (req, res) => {
  try {
    const { done } = req.body;

    if (typeof done !== 'boolean') {
      return res.status(400).json({ message: '`done` doit être true ou false.' });
    }

    const list = await TaskList.findOne({
      _id: req.params.taskListId,
      user: req.user.id
    });

    if (!list) return res.status(404).json({ message: 'Liste non trouvée.' });

    const task = list.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });

    task.done = done;

    await list.save();
    res.status(200).json({ message: 'Tâche mise à jour avec succès.', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});


module.exports = router;
