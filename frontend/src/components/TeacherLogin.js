import React, { useState } from 'react';
import './Login.css';

function TeacherLogin({ onLogin, onBackToStudent }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div className="login-box">
        <div className="login-header">
          <h1>Connexion Enseignant</h1>
          <p>Accédez au tableau de bord enseignant</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@gmail.com ou teacher@atfp.tn"
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Utilisez: teacher@gmail.com ou teacher@atfp.tn
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="teacher123"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se Connecter'}
          </button>
        </form>

        <div className="login-footer">
          <div style={{ 
            background: '#e8f4fd', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            fontSize: '14px',
            color: '#2c5aa0'
          }}>
            <strong>Comptes de démonstration:</strong><br/>
            📧 Email: teacher@gmail.com<br/>
            🔑 Mot de passe: teacher123
          </div>
          <button onClick={onBackToStudent} className="switch-mode-btn">
            ← Retour à la connexion étudiant
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;
