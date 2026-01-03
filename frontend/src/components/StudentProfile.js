import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './StudentProfile.css';

function StudentProfile({ student, onLogout, onUpdateStudent }) {
  const [profilePicture, setProfilePicture] = useState(student.profilePicture || null);
  const [uploading, setUploading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getValidationStatus = () => {
    const notes = student.notes || [];
    const withKnownSubjects = notes.filter(n => subjects.find(s => s.code === n.code));
    const totalSubjects = withKnownSubjects.length;

    const subjectsPassed = withKnownSubjects.every(note => {
      const subject = subjects.find(s => s.code === note.code);
      if (!subject) return false;
      const finalGrade = note.finalGrade ?? note.grade ?? null;
      if (finalGrade === null || finalGrade === undefined) return false;
      return finalGrade >= subject.threshold;
    });

    const periodChecks = [1, 2, 3, 4, 5].map(period => {
      const periodNotes = withKnownSubjects.filter(n => n.periods?.[`period${period}`]?.grade !== undefined);
      if (periodNotes.length === 0) return null;
      return periodNotes.every(note => {
        const subject = subjects.find(s => s.code === note.code);
        if (!subject) return false;
        const periodGrade = note.periods?.[`period${period}`]?.grade;
        return typeof periodGrade === 'number' && periodGrade >= subject.threshold;
      });
    }).filter(v => v !== null);

    const hasAnyGrade = withKnownSubjects.some(n => n.grade !== undefined || n.finalGrade !== undefined || Object.values(n.periods || {}).some(p => p.grade !== undefined));
    const periodsPassed = periodChecks.length === 0 ? true : periodChecks.every(Boolean);
    const isValidatedDerived = hasAnyGrade && totalSubjects > 0 && subjectsPassed && periodsPassed;
    const isRefusedDerived = hasAnyGrade && totalSubjects > 0 && !isValidatedDerived;

    return { isValidatedDerived, isRefusedDerived };
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      
      try {
        // Update student profile with new picture
        const response = await api.put(`/api/students/${student._id}`, {
          ...student,
          profilePicture: base64Image
        });

        setProfilePicture(base64Image);
        if (onUpdateStudent) {
          onUpdateStudent(response.data);
        }
        alert('Photo de profil mise à jour avec succès!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Erreur lors de la mise à jour de la photo');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer votre photo de profil?')) {
      return;
    }

    setUploading(true);
    try {
      const response = await api.put(`/api/students/${student._id}`, {
        ...student,
        profilePicture: null
      });

      setProfilePicture(null);
      if (onUpdateStudent) {
        onUpdateStudent(response.data);
      }
      alert('Photo de profil supprimée avec succès!');
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Erreur lors de la suppression de la photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="profile-avatar-image" />
          ) : (
            <div className="profile-avatar">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="avatar-actions">
            <label className="upload-button" title="Changer la photo">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {profilePicture && (
              <button 
                className="remove-button" 
                onClick={handleRemoveImage}
                disabled={uploading}
                title="Supprimer la photo"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
        <div className="profile-info">
          <h1>{student.name}</h1>
          <p className="profile-email">{student.email}</p>
            {(() => {
              const { isValidatedDerived, isRefusedDerived } = getValidationStatus();
              return (
                <span className={`validation-badge ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                  {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                </span>
              );
            })()}
        </div>
        <button className="logout-button" onClick={onLogout}>
          Déconnexion
        </button>
      </div>

      <div className="profile-content">
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <h3>Date d'inscription</h3>
              <p className="card-value">{formatDate(student.createdAt)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-icon">🏢</div>
            <div className="card-content">
              <h3>Date d'entrée au centre</h3>
              <p className="card-value">
                {student.centerEntryDate ? formatDate(student.centerEntryDate) : 'Non définie'}
              </p>
            </div>
          </div>

          {student.notes && student.notes.length > 0 && (
            <div className="info-card">
              {(() => {
                const { isValidatedDerived, isRefusedDerived } = getValidationStatus();
                return (
                  <>
                    <div className={`card-icon ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                      {isRefusedDerived ? '✗' : isValidatedDerived ? '✓' : '✗'}
                    </div>
                    <div className="card-content">
                      <h3>Statut de Validation</h3>
                      <p className={`card-value ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                        {isRefusedDerived ? 'Refusé (auto)' : isValidatedDerived ? 'Validé (auto)' : 'Non Validé (auto)'}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <div className="info-card">
            <div className="card-icon">📧</div>
            <div className="card-content">
              <h3>Email</h3>
              <p className="card-value-small">{student.email}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="card-icon">🎓</div>
            <div className="card-content">
              <h3>Formation</h3>
              <p className="card-value-small">BTS Télécommunications</p>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <h2>TEST 12345 - Bienvenue, {student.name}!</h2>
          <p>Vous pouvez naviguer dans le menu pour consulter les matières et les informations de l'ATFP.</p>
          
          {student.centerEntryDate && (
            <div className="center-entry-notice">
              <h3>📍 Date d'entrée au centre: {formatDate(student.centerEntryDate)}</h3>
              <p>Votre date d'entrée au centre de formation a été programmée.</p>
            </div>
          )}
        </div>

        {student.notes && student.notes.length > 0 ? (
          <div className="subjects-overview-section">
            <h2>Mes Notes - BTS TC</h2>
            <p className="date-info">Vous avez {student.notes.length} note(s) évaluée(s)</p>
            
            {/* Period Results Summary */}
            <div className="period-results-summary">
              <h3>Mes Résultats par Période</h3>
              <div className="results-grid">
                {[1, 2, 3, 4, 5].map(periodNum => {
                  const periodKey = `period${periodNum}`;
                  
                  // Calculate period statistics - only for subjects in this formation period
                  const periodNotes = student.notes.filter(note => {
                    const subject = subjects.find(s => s.code === note.code);
                    return subject && subject.formation === periodNum && note.periods?.[periodKey]?.grade;
                  });
                  const totalSubjects = periodNotes.length;
                  const passedSubjects = periodNotes.filter(note => {
                    const grade = note.periods[periodKey].grade;
                    return grade >= note.threshold;
                  }).length;
                  const validatedSubjects = periodNotes.filter(note => note.periods?.[periodKey]?.validated).length;
                const periodValidated = totalSubjects > 0 && validatedSubjects === totalSubjects;
                  
                  const averageGrade = totalSubjects > 0 
                    ? (periodNotes.reduce((sum, note) => sum + note.periods[periodKey].grade, 0) / totalSubjects).toFixed(1)
                    : 0;
                  
                  const successRate = totalSubjects > 0 ? ((passedSubjects / totalSubjects) * 100).toFixed(0) : 0;
                  const validationRate = totalSubjects > 0 ? ((validatedSubjects / totalSubjects) * 100).toFixed(0) : 0;
                  
                  return (
                    <div key={periodNum} className={`period-result-card ${successRate >= 80 ? 'excellent' : successRate >= 60 ? 'good' : 'needs-improvement'}`}>
                      <div className="period-result-header">
                        <span className={`period-number period-${periodNum}`}>P{periodNum}</span>
                        <span className="period-name">Période {periodNum}</span>
                      {totalSubjects > 0 && (
                        <span className={`period-validation ${periodValidated ? 'validated' : 'not-validated'}`}>
                          {periodValidated ? '✓ Validée' : '✗ Non validée'}
                        </span>
                      )}
                      </div>
                      <div className="period-stats">
                        <div className="stat-item">
                          <span className="stat-label">Matières</span>
                          <span className="stat-value">{totalSubjects}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Réussies</span>
                          <span className="stat-value success">{passedSubjects}/{totalSubjects}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Ma Moyenne</span>
                          <span className={`stat-value ${averageGrade >= 80 ? 'excellent' : averageGrade >= 60 ? 'good' : 'poor'}`}>
                            {averageGrade}%
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Taux de Réussite</span>
                          <span className={`stat-value ${successRate >= 80 ? 'excellent' : successRate >= 60 ? 'good' : 'poor'}`}>
                            {successRate}%
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Validées</span>
                          <span className={`stat-value ${validationRate >= 80 ? 'excellent' : validationRate >= 60 ? 'good' : 'poor'}`}>
                            {validationRate}%
                          </span>
                        </div>
                      </div>
                      <div className="period-status">
                        {successRate >= 80 ? (
                          <span className="status-excellent">🏆 Excellent</span>
                        ) : successRate >= 60 ? (
                          <span className="status-good">✅ Bien</span>
                        ) : totalSubjects > 0 ? (
                          <span className="status-needs-improvement">⚠️ À améliorer</span>
                        ) : (
                          <span className="status-no-data">📋 Pas de données</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Chargement des matières...</div>
            ) : (
              <div className="subjects-table-wrapper">
                <table className="profile-subjects-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Code</th>
                      <th>Désignation</th>
                      <th>Seuil</th>
                      <th>Formation</th>
                      <th>Période 1</th>
                      <th>Période 2</th>
                      <th>Période 3</th>
                      <th>Période 4</th>
                      <th>Période 5</th>
                      <th>Note Finale</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, index) => {
                      const studentNote = student.notes?.find(n => n.code === subject.code);
                      const hasNote = studentNote !== undefined;
                      
                      // Only show subjects that have notes
                      if (!hasNote) return null;
                      
                      const finalGrade = studentNote.finalGrade || studentNote.grade;
                      const passed = hasNote && finalGrade >= subject.threshold;
                      
                      return (
                        <tr key={subject.code} className={passed ? 'has-note-pass' : 'has-note-fail'}>
                          <td>{String(index + 1).padStart(3, '0')}</td>
                          <td className="subject-code">{subject.code}</td>
                          <td className="subject-name">{subject.name}</td>
                          <td>
                            <span className="threshold-badge">{subject.threshold}%</span>
                          </td>
                          <td className="formation-badge">F{subject.formation}</td>
                          
                          {/* Period grades */}
                          {[1, 2, 3, 4, 5].map(periodNum => {
                            const periodKey = `period${periodNum}`;
                            const periodGrade = studentNote.periods?.[periodKey]?.grade;
                            const isValidated = studentNote.periods?.[periodKey]?.validated;
                            
                            return (
                              <td key={periodKey} className="period-grade">
                                {periodGrade ? (
                                  <span className={`grade-badge ${periodGrade >= subject.threshold ? 'pass' : 'fail'} ${isValidated ? 'validated' : ''}`}>
                                    {periodGrade}%
                                    {isValidated && <span className="validation-check">✓</span>}
                                  </span>
                                ) : (
                                  <span className="no-grade">-</span>
                                )}
                              </td>
                            );
                          })}
                          
                          <td className="note-column">
                            <span className={`student-note ${passed ? 'pass' : 'fail'}`}>
                              {finalGrade}%
                            </span>
                          </td>
                          <td className="status-column">
                            <span className={`status-indicator ${passed ? 'pass' : 'fail'}`}>
                              {passed ? '✓ Réussi' : '✗ Échoué'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="no-notes-message">
            <div className="empty-icon">📋</div>
            <h3>Aucune note disponible</h3>
            <p>Vos notes n'ont pas encore été ajoutées par l'enseignant.</p>
            <p>Veuillez contacter votre enseignant pour plus d'informations.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
