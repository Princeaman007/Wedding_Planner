import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Ajout pour redirection
import API from '../services/api';
import WeddingForm from '../components/WeddingForm';

function WeddingListPage() {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeddings = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const res = await API.get('/weddings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filtrer les mariages de l'utilisateur connecté
      const userWeddings = res.data.filter(w => w.user === user.id);
      setWeddings(userWeddings);
    } catch (err) {
      console.error('Erreur lors du chargement des mariages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💒 Mes Mariages</h2>

      {/* Formulaire d'ajout */}
      <WeddingForm onCreated={fetchWeddings} />

      {/* Liste des mariages */}
      {loading ? (
        <p>Chargement...</p>
      ) : weddings.length === 0 ? (
        <div className="alert alert-info">
          Aucun mariage enregistré pour le moment.
        </div>
      ) : (
        <div className="row">
          {weddings.map(w => (
            <div key={w._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{w.name}</h5>
                  <p className="card-text">
                    📍 <strong>Lieu :</strong> {w.location}<br />
                    📆 <strong>Date :</strong> {new Date(w.date).toLocaleDateString()}<br />
                    🎨 <strong>Thème :</strong> {w.theme || 'N/A'}
                  </p>
                  {w.notes && <p className="card-text text-muted">{w.notes}</p>}

                  {/* ✅ Bouton Détail vers WeddingDetailsPage */}
                  <Link to={`/weddings/${w._id}`} className="btn btn-outline-primary btn-sm">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeddingListPage;
