import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ATFP</h3>
            <p>Agence Tunisienne de la Formation Professionnelle</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Adresse: 21 - RUE DE LIBYE LAFAYETTE - 1002 - TUNIS</p>
            <p>Téléphone: +216 71 833 054 / +216 71 832 462</p>
            <p>Email: boc@takwin.atfp.tn</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Agence Tunisienne de la Formation Professionnelle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
