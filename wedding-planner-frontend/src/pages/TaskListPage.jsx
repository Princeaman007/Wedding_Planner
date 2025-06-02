import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import TaskForm from '../components/TaskForm';

function TaskListPage() {
  const { id: weddingId } = useParams();

  const [lists, setLists] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [allWeddings, setAllWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWedding = async () => {
    const res = await API.get(`/weddings/${weddingId}`);
    setWedding(res.data);
  };

  const fetchAllWeddings = async () => {
    const res = await API.get(`/weddings`);
    setAllWeddings(res.data);
  };

  const fetchLists = async () => {
    const res = await API.get(`/tasks/wedding/${weddingId}`);
    setLists(res.data);
  };

  // ✅ Mise à jour explicite du statut de la tâche (true ou false)
  const updateTaskStatus = async (listId, taskId, done) => {
    try {
      await API.patch(`/tasks/${listId}/tasks/${taskId}`, { done });
      fetchLists(); // refresh après update
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la tâche :", err);
    }
  };

  useEffect(() => {
    if (weddingId) {
      setLoading(true);
      Promise.all([fetchWedding(), fetchLists(), fetchAllWeddings()])
        .catch(() => setError("Erreur lors du chargement des données."))
        .finally(() => setLoading(false));
    }
  }, [weddingId]);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Listes de tâches – {wedding?.name || "Mariage"}</h2>
        <Link to={`/weddings/${weddingId}`} className="btn btn-secondary">← Retour</Link>
      </div>

      <TaskForm
        weddingId={weddingId}
        weddings={allWeddings}
        onSuccess={fetchLists}
      />

      {lists.length === 0 ? (
        <p className="text-muted mt-3">Aucune liste de tâches trouvée pour ce mariage.</p>
      ) : (
        lists.map(list => (
          <div key={list._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{list.title}</h5>
              {list.tasks.length === 0 ? (
                <p className="text-muted">Aucune tâche ajoutée.</p>
              ) : (
                <ul className="list-unstyled">
                  {list.tasks.map(task => (
                    <li key={task._id} className="mb-2 d-flex justify-content-between align-items-center">
                      <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                        {task.name}
                      </span>
                      <div>
                        <button
                          className={`btn btn-sm me-2 ${task.done ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => updateTaskStatus(list._id, task._id, true)}
                        >
                          ✅ Fait
                        </button>
                        <button
                          className={`btn btn-sm ${!task.done ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => updateTaskStatus(list._id, task._id, false)}
                        >
                          ❌ Non fait
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskListPage;
