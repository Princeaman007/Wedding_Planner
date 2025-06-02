import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskListPage from './pages/TaskListPage';
import WeddingListPage from './pages/WeddingListPage';
import WeddingDetailsPage from './pages/WeddingDetailsPage';
import LandingPage from './pages/LandingPage'; // ✅ Import de la LandingPage

function RequireAuth({ loggedIn, children }) {
  return loggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  const handleLogin = () => setLoggedIn(true);

  return (
    <Router>
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />

      <main className="container mt-4">
        <Routes>
          {/* Page publique */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onRegister={handleLogin} />} />

          {/* Page d'accueil utilisateur connecté */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth loggedIn={loggedIn}>
                <LandingPage />
              </RequireAuth>
            }
          />

          {/* Mariages (protégés) */}
          <Route
            path="/weddings"
            element={
              <RequireAuth loggedIn={loggedIn}>
                <WeddingListPage />
              </RequireAuth>
            }
          />

          <Route
            path="/weddings/:id"
            element={
              <RequireAuth loggedIn={loggedIn}>
                <WeddingDetailsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/weddings/:id/tasks"
            element={
              <RequireAuth loggedIn={loggedIn}>
                <TaskListPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
