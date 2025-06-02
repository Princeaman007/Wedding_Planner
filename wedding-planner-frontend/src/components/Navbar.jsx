import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../services/api';

function Navbar({ loggedIn, onLogout }) {
  const [firstWeddingId, setFirstWeddingId] = useState(null);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const res = await API.get('/weddings');
        if (res.data.length > 0) {
          setFirstWeddingId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des mariages', err);
      }
    };

    if (loggedIn) fetchWeddings();
  }, [loggedIn]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">Wedding Planner</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mainNav">
        <ul className="navbar-nav ms-auto">
          {loggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Accueil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/weddings">Mes Mariages</Link>
              </li>
              {firstWeddingId && (
                <li className="nav-item">
                  <Link className="nav-link" to={`/weddings/${firstWeddingId}/tasks`}>
                    Mes Tâches
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={onLogout}>
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Connexion</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Inscription</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
