import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './SubjectsList.css';

function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      console.log('Fetching subjects from API...');
      const response = await api.get('/api/subjects');
      console.log('Subjects received:', response.data);
      setSubjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Chargement des matières...</div>;
  }

  const totalHours = filteredSubjects.reduce((sum, subject) => sum + (subject.totalHours || 0), 0);

  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1>Liste des Compétences de la Spécialité</h1>
        <p className="subtitle">BTS Télécommunications</p>
        <p className="date-info">Date: 08/10/2025 - Page 1 sur 2</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher une matière ou un code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="subjects-table-wrapper">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Code Module</th>
              <th>Code élément</th>
              <th>Désignation</th>
              <th>Seuil</th>
              <th>Heures Hebdo</th>
              <th>Heures Théorie</th>
              <th>Heures Pratique</th>
              <th>Total Heures</th>
              <th>Formation</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject, index) => (
              <tr key={subject.code}>
                <td className="number-cell">{String(index + 1).padStart(3, '0')}</td>
                <td className="module-code-cell">{subject.moduleCode}</td>
                <td className="code-cell">{subject.code}</td>
                <td className="name-cell">{subject.name}</td>
                <td className="threshold-cell">
                  <span className="threshold-badge">{subject.threshold}%</span>
                </td>
                <td className="hours-cell">{subject.hours}</td>
                <td className="hours-cell">{subject.hoursTheory}</td>
                <td className="hours-cell">{subject.hoursPractical}</td>
                <td className="total-hours-cell">{subject.totalHours}</td>
                <td className="formation-cell">{subject.formation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="subjects-footer">
        <div className="footer-stats">
          <p><strong>Total compétences:</strong> {filteredSubjects.length}</p>
          <p><strong>Total heures:</strong> {totalHours}h</p>
        </div>
      </div>
    </div>
  );
}

export default SubjectsList;
