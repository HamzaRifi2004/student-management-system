import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './TeacherDashboard.css';

function TeacherDashboard({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    centerEntryDate: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  const getValidationStatus = (studentData) => {
    const student = studentData || {};
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

    // Period checks: only consider notes that actually have a grade for that period.
    const periodChecks = [1, 2, 3, 4, 5].map(period => {
      const periodNotes = withKnownSubjects.filter(n => n.periods?.[`period${period}`]?.grade !== undefined);
      if (periodNotes.length === 0) return null; // no grades for this period, ignore
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/subjects')
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setShowAddNote(false);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!newStudent.name || !newStudent.email) {
      alert('Veuillez remplir le nom et l\'email');
      return;
    }

    try {
      await api.post('/api/students', {
        name: newStudent.name,
        email: newStudent.email,
        password: null, // Student will create their own password
        centerEntryDate: newStudent.centerEntryDate || null,
        createdAt: newStudent.registrationDate,
        notes: [],
        timeUsed: 0,
        isValidated: false,
        accountActive: false
      });

      alert(`Étudiant ajouté avec succès!\n\nEmail: ${newStudent.email}\n\nL'étudiant doit créer son compte en utilisant le bouton "Créer un compte" sur la page de connexion avec cet email.`);
      
      // Reset form and refresh data
      setNewStudent({
        name: '',
        email: '',
        centerEntryDate: '',
        registrationDate: new Date().toISOString().split('T')[0]
      });
      setShowAddStudent(false);
      fetchData();
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.response?.status === 400) {
        alert('Un étudiant avec cet email existe déjà');
      } else {
        alert('Erreur lors de l\'ajout de l\'étudiant');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  const handleSavePeriodNotes = async (period) => {
    try {
      // Get all form inputs for this period
      const periodKey = `period${period}`;
      const updatedNotes = [...(selectedStudent.notes || [])];
      
      // Update notes with period data
      subjects.forEach(subject => {
        const gradeInput = document.querySelector(`input[data-subject="${subject.code}"][data-period="${period}"]`);
        const validationInput = document.querySelector(`input[type="checkbox"][data-subject="${subject.code}"][data-period="${period}"]`);
        
        if (gradeInput && gradeInput.value) {
          const grade = parseFloat(gradeInput.value);
          const isValidated = validationInput ? validationInput.checked : false;
          
          let existingNoteIndex = updatedNotes.findIndex(n => n.code === subject.code);
          
          if (existingNoteIndex === -1) {
            // Create new note structure
            const newNote = {
              code: subject.code,
              subject: subject.name,
              threshold: subject.threshold,
              formation: subject.formation,
              periods: {},
              finalGrade: grade,
              validated: isValidated,
              grade: grade, // backward compatibility
              date: new Date().toISOString().split('T')[0]
            };
            newNote.periods[periodKey] = {
              grade: grade,
              date: new Date().toISOString().split('T')[0],
              validated: isValidated,
              weeks: `${(period - 1) * 8 + 1}-${period * 8}`
            };
            updatedNotes.push(newNote);
          } else {
            // Update existing note
            if (!updatedNotes[existingNoteIndex].periods) {
              updatedNotes[existingNoteIndex].periods = {};
            }
            updatedNotes[existingNoteIndex].periods[periodKey] = {
              grade: grade,
              date: new Date().toISOString().split('T')[0],
              validated: isValidated,
              weeks: `${(period - 1) * 8 + 1}-${period * 8}`
            };
            
            // Recalculate final grade (average of all periods)
            const periods = updatedNotes[existingNoteIndex].periods;
            const periodGrades = Object.values(periods).filter(p => p.grade).map(p => p.grade);
            if (periodGrades.length > 0) {
              updatedNotes[existingNoteIndex].finalGrade = periodGrades.reduce((sum, g) => sum + g, 0) / periodGrades.length;
              updatedNotes[existingNoteIndex].grade = updatedNotes[existingNoteIndex].finalGrade; // backward compatibility
            }
          }
        }
      });

      const response = await api.put(`/api/students/${selectedStudent._id}`, {
        ...selectedStudent,
        notes: updatedNotes,
        ...getValidationStatus({ ...selectedStudent, notes: updatedNotes })
      });

      setSelectedStudent(response.data);
      await fetchData();
      alert(`Notes de la Période ${period} sauvegardées avec succès!`);
    } catch (error) {
      console.error('Error saving period notes:', error);
      alert('Erreur lors de la sauvegarde des notes');
    }
  };

  const handleValidatePeriod = async (period) => {
    try {
      const periodKey = `period${period}`;
      const updatedNotes = [...(selectedStudent.notes || [])];
      
      // Validate all notes for this period that have grades
      updatedNotes.forEach(note => {
        if (note.periods && note.periods[periodKey] && note.periods[periodKey].grade) {
          note.periods[periodKey].validated = true;
        }
      });

      const response = await api.put(`/api/students/${selectedStudent._id}`, {
        ...selectedStudent,
        notes: updatedNotes,
        ...getValidationStatus({ ...selectedStudent, notes: updatedNotes })
      });

      setSelectedStudent(response.data);
      await fetchData();
      alert(`Période ${period} validée avec succès!`);
    } catch (error) {
      console.error('Error validating period:', error);
      alert('Erreur lors de la validation de la période');
    }
  };

  const handleEditPeriodNote = (subjectCode, period) => {
    setSelectedPeriod(period);
    setShowAddNote(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.period-notes-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeletePeriodNote = async (subjectCode, period) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la note de la Période ${period} pour cette matière?`)) {
      return;
    }

    try {
      const periodKey = `period${period}`;
      const updatedNotes = [...(selectedStudent.notes || [])];
      
      const noteIndex = updatedNotes.findIndex(n => n.code === subjectCode);
      if (noteIndex !== -1 && updatedNotes[noteIndex].periods) {
        delete updatedNotes[noteIndex].periods[periodKey];
        
        // If no periods left, remove the entire note
        if (Object.keys(updatedNotes[noteIndex].periods).length === 0) {
          updatedNotes.splice(noteIndex, 1);
        } else {
          // Recalculate final grade
          const periods = updatedNotes[noteIndex].periods;
          const periodGrades = Object.values(periods).filter(p => p.grade).map(p => p.grade);
          if (periodGrades.length > 0) {
            updatedNotes[noteIndex].finalGrade = periodGrades.reduce((sum, g) => sum + g, 0) / periodGrades.length;
            updatedNotes[noteIndex].grade = updatedNotes[noteIndex].finalGrade;
          }
        }
      }

      const response = await api.put(`/api/students/${selectedStudent._id}`, {
        ...selectedStudent,
        notes: updatedNotes,
        ...getValidationStatus({ ...selectedStudent, notes: updatedNotes })
      });

      setSelectedStudent(response.data);
      await fetchData();
      alert('Note supprimée avec succès!');
    } catch (error) {
      console.error('Error deleting period note:', error);
      alert('Erreur lors de la suppression de la note');
    }
  };

  const handleUpdateTimeUsed = async (student, newTime) => {
    try {
      const response = await api.put(`/api/students/${student._id}`, {
        ...student,
        timeUsed: parseInt(newTime)
      });

      await fetchData();
      if (selectedStudent && selectedStudent._id === student._id) {
        setSelectedStudent(response.data);
      }
    } catch (error) {
      console.error('Error updating time:', error);
      alert('Erreur lors de la mise à jour du temps');
    }
  };

  const handleUpdateCenterEntryDate = async (student, newDate) => {
    try {
      const response = await api.put(`/api/students/${student._id}`, {
        ...student,
        centerEntryDate: newDate
      });

      await fetchData();
      if (selectedStudent && selectedStudent._id === student._id) {
        setSelectedStudent(response.data);
      }
    } catch (error) {
      console.error('Error updating center entry date:', error);
      alert('Erreur lors de la mise à jour de la date d\'entrée');
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Tableau de Bord Enseignant</h1>
        <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
      </div>

      <div className="dashboard-content">
        <div className="students-list-panel">
          <div className="students-panel-header">
            <h3>Sélectionner un Étudiant</h3>
            <button 
              className="add-student-btn"
              onClick={() => setShowAddStudent(!showAddStudent)}
            >
              {showAddStudent ? '✕ Annuler' : '+ Ajouter un Étudiant'}
            </button>
          </div>

          {showAddStudent && (
            <div className="add-student-form-container">
              <h4>Ajouter un Nouvel Étudiant</h4>
              <form onSubmit={handleAddStudent} className="add-student-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name">Nom Complet *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      placeholder="Nom de l'étudiant"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="registrationDate">Date d'inscription</label>
                    <input
                      type="date"
                      id="registrationDate"
                      name="registrationDate"
                      value={newStudent.registrationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="centerEntryDate">Date d'entrée au centre</label>
                    <input
                      type="date"
                      id="centerEntryDate"
                      name="centerEntryDate"
                      value={newStudent.centerEntryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    ✓ Ajouter l'Étudiant
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddStudent(false);
                      setNewStudent({
                        name: '',
                        email: '',
                        centerEntryDate: '',
                        registrationDate: new Date().toISOString().split('T')[0]
                      });
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="students-grid">
            {students.map(student => (
              <div 
                key={student._id} 
                className={`student-card ${selectedStudent?._id === student._id ? 'selected' : ''}`}
                onClick={() => handleSelectStudent(student)}
              >
                <div className="student-card-header">
                  {student.profilePicture ? (
                    <img src={student.profilePicture} alt={student.name} className="student-avatar" />
                  ) : (
                    <div className="student-avatar-placeholder">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="student-info">
                    <h4>{student.name}</h4>
                    <p>{student.email}</p>
                  {(() => {
                    const { isValidatedDerived, isRefusedDerived } = getValidationStatus(student);
                    return (
                      <span className={`validation-badge small ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                        {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                      </span>
                    );
                  })()}
                  </div>
                </div>
                <div className="student-stats">
                  {(() => {
                    const { isValidatedDerived, isRefusedDerived } = getValidationStatus(student);
                    return (
                      <span className={`validation-status ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                        {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                      </span>
                    );
                  })()}
                  <span className="notes-count">
                    {student.notes?.length || 0} notes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="student-details-panel">
          {selectedStudent ? (
            <>
              <div className="details-header">
                <div className="student-profile">
                  {selectedStudent.profilePicture ? (
                    <img src={selectedStudent.profilePicture} alt={selectedStudent.name} className="profile-pic" />
                  ) : (
                    <div className="profile-pic-placeholder">
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                      <h2>{selectedStudent.name}</h2>
                      <p>{selectedStudent.email}</p>
                      {(() => {
                        const { isValidatedDerived, isRefusedDerived } = getValidationStatus(selectedStudent);
                        return (
                          <span className={`validation-badge ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                            {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                          </span>
                        );
                      })()}
                  </div>
                </div>
              </div>

              <div className="student-controls">
                <div className="control-group">
                  <label>Statut (auto):</label>
                  {(() => {
                    const { isValidatedDerived, isRefusedDerived } = getValidationStatus(selectedStudent);
                    return (
                      <span className={`validation-badge ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                        {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                      </span>
                    );
                  })()}
                </div>

                <div className="control-group">
                  <label>Date d'entrée au centre:</label>
                  <input
                    type="date"
                    value={selectedStudent.centerEntryDate || ''}
                    onChange={(e) => handleUpdateCenterEntryDate(selectedStudent, e.target.value)}
                    className="date-input"
                  />
                </div>

                <div className="control-group">
                  <label>Temps Utilisé (minutes):</label>
                  <input
                    type="number"
                    value={selectedStudent.timeUsed || 0}
                    onChange={(e) => handleUpdateTimeUsed(selectedStudent, e.target.value)}
                    className="time-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="notes-section">
                <div className="notes-header">
                  <h3>Gestion des Notes par Période</h3>
                  <button className="add-note-btn" onClick={() => setShowAddNote(!showAddNote)}>
                    {showAddNote ? '✕ Annuler' : '+ Ajouter/Modifier des Notes'}
                  </button>
                </div>

                {showAddNote && (
                  <div className="period-notes-form">
                    <div className="period-selector">
                      <h4>Sélectionner une Période</h4>
                      <div className="period-tabs">
                        {[1, 2, 3, 4, 5].map(period => {
                          const subjectsInPeriod = subjects.filter(s => s.formation === period).length;
                          return (
                            <button
                              key={period}
                              type="button"
                              className={`period-tab ${selectedPeriod === period ? 'active' : ''}`}
                              onClick={() => setSelectedPeriod(period)}
                            >
                              Période {period}
                              <span className="subject-count">({subjectsInPeriod} matières)</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="period-form-content">
                      <h4>
                        Période {selectedPeriod} - Semaines {(selectedPeriod - 1) * 8 + 1}-{selectedPeriod * 8}
                        <span className="formation-info">
                          Formation {selectedPeriod} - {subjects.filter(s => s.formation === selectedPeriod).length} matières
                        </span>
                      </h4>
                      
                      {subjects.filter(subject => subject.formation === selectedPeriod).length === 0 ? (
                        <div className="no-subjects-message">
                          <div className="icon">📚</div>
                          <h5>Aucune matière pour cette période</h5>
                          <p>La Période {selectedPeriod} ne contient aucune matière selon le programme de formation.</p>
                        </div>
                      ) : (
                        <div className="subjects-grid-form">
                          {subjects
                            .filter(subject => subject.formation === selectedPeriod)
                            .map(subject => {
                          const existingNote = selectedStudent.notes?.find(n => n.code === subject.code);
                          const periodGrade = existingNote?.periods?.[`period${selectedPeriod}`]?.grade || '';
                          const isValidated = existingNote?.periods?.[`period${selectedPeriod}`]?.validated || false;
                          
                          return (
                            <div key={subject.code} className="subject-form-card">
                              <div className="subject-form-header">
                                <span className="subject-code">{subject.code}</span>
                                <span className="subject-threshold">Seuil: {subject.threshold}%</span>
                              </div>
                              <div className="subject-form-name">{subject.name}</div>
                              
                              <div className="grade-input-group">
                                <label>Note (%):</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.5"
                                  defaultValue={periodGrade}
                                  data-subject={subject.code}
                                  data-period={selectedPeriod}
                                  placeholder="0-100"
                                  className="grade-input"
                                />
                              </div>
                              
                              <div className="validation-group">
                                <label className="validation-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={isValidated}
                                    data-subject={subject.code}
                                    data-period={selectedPeriod}
                                  />
                                  <span>Validé</span>
                                </label>
                              </div>
                              
                              {periodGrade && (
                                <div className={`grade-status ${periodGrade >= subject.threshold ? 'pass' : 'fail'}`}>
                                  {periodGrade >= subject.threshold ? '✓ Réussi' : '✗ Échoué'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>
                      )}
                      
                      <div className="period-actions">
                        <button 
                          type="button" 
                          className="save-period-btn"
                          onClick={() => handleSavePeriodNotes(selectedPeriod)}
                        >
                          💾 Sauvegarder Période {selectedPeriod}
                        </button>
                        <button 
                          type="button" 
                          className="validate-period-btn"
                          onClick={() => handleValidatePeriod(selectedPeriod)}
                        >
                          ✓ Valider Période {selectedPeriod}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Period Results Display */}
                <div className="periods-display">
                  {[1, 2, 3, 4, 5].map(period => {
                    const periodKey = `period${period}`;
                    // Filter notes to only include subjects from this formation period
                    const periodNotes = selectedStudent.notes?.filter(note => {
                      const subject = subjects.find(s => s.code === note.code);
                      return subject && subject.formation === period && note.periods?.[periodKey]?.grade;
                    }) || [];
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
                    
                    return (
                      <div key={period} className="period-display-section">
                        <div className="period-display-header">
                          <h4>
                            <span className={`period-badge period-${period}`}>Période {period}</span>
                            <span className="period-weeks">(Semaines {(period - 1) * 8 + 1}-{period * 8})</span>
                          </h4>
                          <div className="period-summary">
                            <span className="summary-item">Matières: {totalSubjects}</span>
                            <span className="summary-item">Réussies: {passedSubjects}/{totalSubjects}</span>
                            <span className="summary-item">Moyenne: {averageGrade}%</span>
                            <span className="summary-item">Validées: {validatedSubjects}/{totalSubjects}</span>
                            {totalSubjects > 0 && (
                              <span className={`summary-item period-validation ${periodValidated ? 'validated' : 'not-validated'}`}>
                                {periodValidated ? '✓ Période validée' : '✗ Période non validée'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {totalSubjects > 0 ? (
                          <table className="period-notes-table">
                            <thead>
                              <tr>
                                <th>Code</th>
                                <th>Matière</th>
                                <th>Seuil</th>
                                <th>Note</th>
                                <th>Statut</th>
                                <th>Validé</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {periodNotes.map((note, index) => {
                                const periodGrade = note.periods[periodKey].grade;
                                const isValidated = note.periods[periodKey].validated;
                                const passed = periodGrade >= note.threshold;
                                
                                return (
                                  <tr key={index}>
                                    <td>{note.code}</td>
                                    <td className="subject-name-cell">{note.subject}</td>
                                    <td>{note.threshold}%</td>
                                    <td>
                                      <span className={`grade-badge ${passed ? 'pass' : 'fail'}`}>
                                        {periodGrade}%
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`status-badge ${passed ? 'pass' : 'fail'}`}>
                                        {passed ? '✓ Réussi' : '✗ Échoué'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`validation-badge ${isValidated ? 'validated' : 'not-validated'}`}>
                                        {isValidated ? '✓ Validé' : '✗ Non validé'}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="edit-btn"
                                        onClick={() => handleEditPeriodNote(note.code, period)}
                                        title="Modifier"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        className="delete-btn"
                                        onClick={() => handleDeletePeriodNote(note.code, period)}
                                        title="Supprimer"
                                      >
                                        🗑️
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <div className="no-period-notes">
                            <p>Aucune note pour cette période</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Sélectionnez un étudiant pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
