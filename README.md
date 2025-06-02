# Wedding Planner App 💍

Une application web complète pour planifier et organiser des mariages, développée avec Node.js/Express et React.

## 📋 Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Gestion des utilisateurs avec JWT
- Protection des routes avec middleware d'authentification

### 💒 Gestion des mariages
- Création et modification de mariages
- Informations détaillées (nom, date, lieu, thème, notes)
- Tableau de bord personnalisé pour chaque utilisateur

### ✅ Gestion des tâches
- Création de listes de tâches personnalisées
- Marquage des tâches comme terminées/non terminées
- Association des tâches aux mariages spécifiques

### 💰 Gestion du budget (structure prête)
- Modèles pour la gestion budgétaire
- Catégorisation des dépenses
- Suivi des coûts estimés vs réels

### 👥 Gestion des invités (structure prête)
- Liste des invités avec statuts (confirmé, en attente, décliné)
- Gestion des plus-ones
- Attribution des tables

### 🏢 Gestion des prestataires (structure prête)
- Répertoire des vendors par catégorie
- Suivi des paiements
- Informations de contact

## 🛠️ Technologies utilisées

### Backend
- **Node.js** & **Express.js** - Serveur et API REST
- **MongoDB** & **Mongoose** - Base de données et ORM
- **JWT** - Authentification et autorisation
- **bcrypt** - Hachage des mots de passe
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **React 18** - Interface utilisateur
- **React Router** - Navigation
- **Bootstrap 5** - Framework CSS
- **Axios** - Client HTTP

## 📁 Structure du projet

```
wedding-planner/
├── backend/
│   ├── models/          # Modèles Mongoose
│   │   ├── User.js
│   │   ├── Wedding.js
│   │   ├── TaskList.js
│   │   ├── Budget.js
│   │   ├── Guest.js
│   │   └── Vendor.js
│   ├── routes/          # Routes API
│   │   ├── authRoutes.js
│   │   ├── weddingRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── guestRoutes.js
│   │   └── vendorRoutes.js
│   ├── middleware/      # Middlewares
│   │   └── auth.js
│   ├── .env            # Variables d'environnement
│   └── server.js       # Point d'entrée du serveur
│
└── wedding-planner-frontend/
    ├── src/
    │   ├── components/     # Composants réutilisables
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── WeddingForm.jsx
    │   ├── pages/         # Pages principales
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── WeddingListPage.jsx
    │   │   ├── WeddingDetailsPage.jsx
    │   │   └── TaskListPage.jsx
    │   ├── services/      # Services API
    │   │   └── api.js
    │   └── App.jsx        # Composant principal
    └── public/
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB Atlas ou instance locale
- npm ou yarn

### 1. Cloner le repository
```bash
git clone <url-du-repo>
cd wedding-planner
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` avec les variables suivantes :
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding-planner
PORT=5000
JWT_SECRET=votre_jwt_secret_très_sécurisé
```

Démarrer le serveur :
```bash
npm start
# ou pour le développement
npm run dev
```

### 3. Configuration du Frontend

```bash
cd wedding-planner-frontend
npm install
```

Démarrer l'application React :
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Mariages
- `GET /api/weddings` - Liste des mariages de l'utilisateur
- `POST /api/weddings` - Créer un mariage
- `GET /api/weddings/:id` - Détails d'un mariage
- `PUT /api/weddings/:id` - Modifier un mariage
- `DELETE /api/weddings/:id` - Supprimer un mariage

### Tâches
- `POST /api/tasks` - Créer une liste de tâches
- `GET /api/tasks/wedding/:weddingId` - Tâches d'un mariage
- `PATCH /api/tasks/:listId/tasks/:taskId` - Modifier le statut d'une tâche
- `PUT /api/tasks/:id` - Modifier une liste de tâches

### Budget (routes disponibles)
- `POST /api/budgets` - Créer un budget
- `GET /api/budgets` - Liste des budgets
- `GET /api/budgets/wedding/:weddingId` - Budget d'un mariage
- Plus d'endpoints pour la gestion détaillée...

### Invités et Prestataires
Routes complètes disponibles pour la gestion des invités et prestataires.

## 🔒 Sécurité

- **Authentification JWT** - Tokens sécurisés avec expiration
- **Hachage des mots de passe** - Utilisation de bcrypt
- **Protection des routes** - Middleware d'authentification
- **Isolation des données** - Chaque utilisateur accède uniquement à ses données

## 🎨 Interface utilisateur

- **Design responsive** avec Bootstrap 5
- **Navigation intuitive** avec React Router
- **Formulaires dynamiques** pour la gestion des tâches
- **Messages de confirmation** et gestion d'erreurs
- **États de chargement** pour une meilleure UX

## 📱 Fonctionnalités implémentées

### ✅ Actuellement disponibles
- Système d'authentification complet
- Gestion des mariages (CRUD complet)
- Gestion des tâches avec statuts
- Interface utilisateur responsive
- Tableau de bord utilisateur

### 🚧 Prêt à implémenter
- Gestion complète du budget
- Système d'invités avec RSVP
- Répertoire des prestataires
- Notifications et rappels
- Export de données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développement

Pour contribuer au projet :

1. **Backend** - Express.js avec architecture RESTful
2. **Frontend** - React avec hooks et composants fonctionnels
3. **Base de données** - MongoDB avec Mongoose pour l'ODM
4. **Style** - Bootstrap 5 pour un design moderne et responsive

## 🐛 Signaler un bug

Si vous trouvez un bug, veuillez ouvrir une issue avec :
- Description détaillée du problème
- Étapes pour reproduire
- Environnement (OS, navigateur, versions)
- Captures d'écran si applicable

## 📞 Support

Pour toute question ou support, n'hésitez pas à ouvrir une issue ou contacter l'équipe de développement.

---

**Développé avec ❤️ pour simplifier la planification de mariages**