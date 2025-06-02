import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

function LandingPage() {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeddings = async () => {
    try {
      const res = await API.get('/weddings'); // 🔐 Assure-toi que l'utilisateur est authentifié
      setWeddings(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les mariages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Chargement des mariages...</p>
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
      <h1 className="mb-4">Bienvenue 👋</h1>
      <h2>Vos Mariages</h2>

      {weddings.length === 0 ? (
        <p className="text-muted">Vous n’avez encore aucun mariage enregistré.</p>
      ) : (
        <div className="row">
          {weddings.map(wedding => (
            <div key={wedding._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{wedding.name}</h5>
                  <p className="card-text">
                    Date : {new Date(wedding.date).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="d-flex gap-2">
                    <Link to={`/weddings/${wedding._id}`} className="btn btn-primary btn-sm">
                      Détails
                    </Link>
                    <Link to={`/weddings/${wedding._id}/tasks`} className="btn btn-outline-secondary btn-sm">
                      Voir les tâches
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link to="/weddings" className="btn btn-success">
          ➕ Créer un nouveau mariage
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
