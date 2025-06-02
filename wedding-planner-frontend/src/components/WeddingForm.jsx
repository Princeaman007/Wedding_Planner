import { useState } from 'react';
import API from '../services/api';

function WeddingForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    location: '',
    theme: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      await API.post(
        '/weddings',
        { ...form, user: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({ name: '', date: '', location: '', theme: '', notes: '' });
      setSuccess(true);
      if (onCreated) onCreated(); // Rafraîchir la liste
    } catch (err) {
      alert('❌ Erreur lors de la création du mariage');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="card-title mb-3">💍 Ajouter un nouveau mariage</h4>

        {success && <div className="alert alert-success">✔️ Mariage ajouté avec succès</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                placeholder="Nom du mariage"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                name="location"
                placeholder="Lieu"
                className="form-control"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                name="theme"
                placeholder="Thème"
                className="form-control"
                value={form.theme}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <textarea
                name="notes"
                placeholder="Notes"
                className="form-control"
                rows="3"
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Création...' : 'Créer le mariage'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WeddingForm;
