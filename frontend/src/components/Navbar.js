import React from 'react';
import './Navbar.css';

function Navbar({ darkMode, toggleDarkMode, onNavigate, currentPage, isLoggedIn, studentName, studentPicture }) {
  const handleNavClick = (e, page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={(e) => handleNavClick(e, 'home')}>
          <img 
            src="https://www.entreprises-magazine.com/wp-content/uploads/2022/07/ATFP.jpg" 
            alt="ATFP Logo" 
            className="logo-image"
          />
          <span className="logo-text">Agence Tunisienne de la Formation Professionnelle</span>
        </div>
        
        <div className="navbar-menu">
          <a 
            href="#home" 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            Accueil
          </a>
          <a 
            href="#about" 
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'about')}
          >
            À Propos
          </a>
          
          {isLoggedIn && (
            <a 
              href="#subjects" 
              className={`nav-link ${currentPage === 'subjects' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'subjects')}
            >
              Matières
            </a>
          )}
          
          {isLoggedIn ? (
            <a 
              href="#profile" 
              className={`nav-link account-btn ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'profile')}
            >
              {studentPicture ? (
                <img src={studentPicture} alt="Profile" className="navbar-avatar" />
              ) : (
                <span className="account-icon">👤</span>
              )}
              {studentName}
            </a>
          ) : (
            <a href="#login" className="nav-link login-btn">Connexion</a>
          )}
          
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
