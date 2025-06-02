import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function WeddingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wedding, setWedding] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', location: '', theme: '', notes: '' });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWedding = async () => {
    try {
      const res = await API.get(`/weddings/${id}`);
      setWedding(res.data);
      setForm({
        name: res.data.name || '',
        date: res.data.date?.substring(0, 10) || '',
        location: res.data.location || '',
        theme: res.data.theme || '',
        notes: res.data.notes || ''
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la récupération du mariage");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/wedding/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches :", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWedding(), fetchTasks()])
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/weddings/${id}`, form);
      alert('Mariage mis à jour ✅');
      fetchWedding();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer ce mariage ?")) return;
    try {
      await API.delete(`/weddings/${id}`);
      alert("Mariage supprimé ✅");
      navigate('/weddings');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading || !wedding) return <div className="container mt-5"><p>Chargement...</p></div>;

  return (
    <div className="container mt-4">
      <h2>Détails du mariage</h2>
      <form onSubmit={handleUpdate} className="mb-4">
        {['name', 'location', 'theme', 'notes'].map((field) => (
          <div className="mb-3" key={field}>
            <input
              type="text"
              className="form-control"
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              required={field === 'name' || field === 'location'}
            />
          </div>
        ))}
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">Mettre à jour</button>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer</button>
      </form>

      <hr />

      <div className="mt-4">
        <h4>Listes de tâches associées</h4>
        {tasks.length === 0 ? (
          <p className="text-muted">Aucune tâche pour ce mariage.</p>
        ) : (
          tasks.map(list => (
            <div key={list._id} className="mb-3">
              <h5>{list.title}</h5>
              <ul className="list-group">
                {list.tasks.map(task => (
                  <li
                    key={task._id}
                    className={`list-group-item d-flex justify-content-between ${task.done ? 'list-group-item-success' : ''}`}
                  >
                    <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.name}
                    </span>
                    <span>{task.done ? '✅' : '⏳'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        <div className="mt-3">
          <Link to={`/weddings/${id}/tasks`} className="btn btn-outline-primary">
            Gérer les tâches →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WeddingDetailsPage;
