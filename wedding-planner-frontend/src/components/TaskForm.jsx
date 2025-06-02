import { useState, useEffect } from 'react';
import API from '../services/api';

function TaskForm({ weddingId, weddings = [], onSuccess }) {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([{ name: '', done: false }]);
  const [selectedWeddingId, setSelectedWeddingId] = useState(weddingId || '');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (weddingId) {
      setSelectedWeddingId(weddingId);
    }
  }, [weddingId]);

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = value;
    setTasks(updatedTasks);
  };

  const addTaskField = () => {
    setTasks([...tasks, { name: '', done: false }]);
  };

  const removeTaskField = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validTasks = tasks.filter(t => t.name.trim() !== '');
    if (!title.trim() || !selectedWeddingId || validTasks.length === 0) return;

    try {
      await API.post('/tasks', {
        title,
        wedding: selectedWeddingId,
        tasks: validTasks
      });

      setTitle('');
      setTasks([{ name: '', done: false }]);
      setSuccessMessage("✅ Liste de tâches ajoutée !");
      
      // Cacher le message après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Erreur lors de la création de la liste :', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Message de succès */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Sélecteur de mariage */}
      <div className="mb-3">
        <label className="form-label">Associer au mariage</label>
        <select
          className="form-select"
          value={selectedWeddingId}
          onChange={(e) => setSelectedWeddingId(e.target.value)}
          required
        >
          <option value="">-- Choisir un mariage --</option>
          {weddings.map(w => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Titre de la liste */}
      <div className="mb-3">
        <label className="form-label">Titre de la liste</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Décoration"
          required
        />
      </div>

      {/* Tâches */}
      <label className="form-label">Tâches</label>
      {tasks.map((task, index) => (
        <div key={index} className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            value={task.name}
            onChange={(e) => handleTaskChange(index, e.target.value)}
            placeholder={`Tâche ${index + 1}`}
            required
          />
          {tasks.length > 1 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeTaskField(index)}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button type="button" className="btn btn-outline-primary mb-3" onClick={addTaskField}>
        + Ajouter une tâche
      </button>

      <div>
        <button type="submit" className="btn btn-success">
          Créer la liste de tâches
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
