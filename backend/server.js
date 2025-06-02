const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const weddingRoutes = require('./routes/weddingRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const guestRoutes = require('./routes/guestRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Ajout pour traiter les requêtes x-www-form-urlencoded

// Amélioration de la connexion MongoDB avec options
console.log('Tentative de connexion à MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000, // Augmentation du timeout à 60 secondes
  socketTimeoutMS: 75000, // Augmentation du timeout de socket à 75 secondes
  connectTimeoutMS: 60000 // Augmentation du timeout de connexion à 60 secondes
})
  .then(() => console.log('MongoDB connecté avec succès'))
  .catch((err) => {
    console.error('Erreur de connexion MongoDB :', err);
    // Ajouter des détails sur l'erreur pour faciliter le débogage
    if (err.name === 'MongoServerSelectionError') {
      console.error('Détails de l\'erreur de sélection du serveur:', err.reason);
    }
  });

// Ajout d'écouteurs d'événements pour la connexion MongoDB
mongoose.connection.on('connecting', () => console.log('Connexion MongoDB en cours...'));
mongoose.connection.on('connected', () => console.log('Mongoose connecté à MongoDB'));
mongoose.connection.on('disconnected', () => console.log('Mongoose déconnecté de MongoDB'));
mongoose.connection.on('error', (err) => console.error('Erreur de connexion Mongoose:', err));

// Vérification du fichier .env et de l'URI MongoDB
if (!process.env.MONGO_URI) {
  console.error('ERREUR: Variable d\'environnement MONGO_URI non définie!');
  console.error('Veuillez définir MONGO_URI dans votre fichier .env');
  process.exit(1); // Arrêter l'application si l'URI n'est pas défini
}

// Route de test simple
app.get('/', (req, res) => {
  res.send('API Wedding Planner est en ligne!');
});

// Application des routes
app.use('/api/weddings', weddingRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
  console.log(`URL de l'API: http://localhost:${PORT}`);
});