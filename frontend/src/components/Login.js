import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, onCreateAccount, onTeacherLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      await onLogin(formData.email, formData.password);
      setLoading(false);
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img 
            src="https://www.entreprises-magazine.com/wp-content/uploads/2022/07/ATFP.jpg" 
            alt="ATFP Logo" 
            className="login-logo"
          />
          <h2>Connexion Étudiant - TEST 123</h2>
          <p>Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email / Nom d'utilisateur</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="login-footer">
            <button type="button" className="create-account-link" onClick={onCreateAccount}>
              Créer un compte
            </button>
            <span className="separator"> | </span>
            <span className="help-text">Besoin d'aide ? Contactez votre enseignant</span>
          </div>
        </form>

        <div className="teacher-login-section" style={{ marginTop: '30px' }}>
          <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, borderBottom: '1px solid #ddd' }}></div>
            <span style={{ padding: '0 15px', color: '#999', fontSize: '14px' }}>ou</span>
            <div style={{ flex: 1, borderBottom: '1px solid #ddd' }}></div>
          </div>
          <button 
            type="button" 
            className="teacher-login-btn" 
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => {
              console.log('Button clicked, onTeacherLogin:', onTeacherLogin);
              if (onTeacherLogin) {
                onTeacherLogin();
              } else {
                alert('onTeacherLogin function not found');
              }
            }}
          >
            👨‍🏫 Connexion Enseignant
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
