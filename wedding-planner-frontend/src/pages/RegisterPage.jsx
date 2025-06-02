import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      if (onRegister) onRegister();
      navigate('/login'); // ✅ Redirection vers le tableau de bord
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription. Veuillez vérifier vos informations.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Créer un compte</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="form-control"
            placeholder="Jean"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="form-control"
            placeholder="Dupont"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Adresse email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="jean.dupont@email.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          S'inscrire
        </button>
      </form>

      <div className="mt-3 text-center">
        <span>Déjà un compte ? </span>
        <Link to="/login" className="btn btn-link p-0">
          Se connecter
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
