import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './TeacherStudentsTable.css';

function TeacherStudentsTable() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    registrationDate: new Date().toISOString().split('T')[0],
    isValidated: false,
    centerEntryDate: ''
  });
  const [studentNotes, setStudentNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedStudentForNote, setSelectedStudentForNote] = useState(null);
  const [newNote, setNewNote] = useState({
    subjectCode: '',
    grade: ''
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStudentGrade = (student, subjectCode) => {
    const note = student.notes?.find(n => n.code === subjectCode);
    return note ? note.grade : '-';
  };

  const getStudentNoteStatus = (student, subjectCode) => {
    const note = student.notes?.find(n => n.code === subjectCode);
    if (!note) return null;
    const subject = subjects.find(s => s.code === subjectCode);
    return note.grade >= subject.threshold ? 'pass' : 'fail';
  };

  const toggleExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${studentName}" ?\n\nCette action est irréversible et supprimera toutes les notes de cet étudiant.`)) {
      return;
    }

    try {
      await api.delete(`/api/students/${studentId}`);
      alert('Étudiant supprimé avec succès!');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Erreur lors de la suppression de l\'étudiant');
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      email: student.email,
      registrationDate: student.createdAt.split('T')[0],
      isValidated: student.isValidated,
      centerEntryDate: student.centerEntryDate || ''
    });
    setStudentNotes(student.notes || []);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    if (!newStudent.name) {
      alert('Veuillez entrer le nom de l\'étudiant');
      return;
    }

    // No password set by teacher - student will create their own
    const noPassword = null;

    // Calculate total time used based on subjects with notes
    const totalTimeUsed = studentNotes.reduce((total, note) => {
      const subject = subjects.find(s => s.code === note.code);
      return total + (subject?.totalHours || 0);
    }, 0);

    try {
      if (editingStudent) {
        // Update existing student
        await api.put(`/api/students/${editingStudent._id}`, {
          ...editingStudent,
          name: newStudent.name,
          email: newStudent.email,
          isValidated: newStudent.isValidated,
          timeUsed: totalTimeUsed,
          notes: studentNotes,
          centerEntryDate: newStudent.centerEntryDate,
          createdAt: newStudent.registrationDate || editingStudent.createdAt
        });

        alert(`Étudiant mis à jour avec succès avec ${studentNotes.length} notes!`);
        setEditingStudent(null);
      } else {
        // Create new student
        await api.post('/api/students', {
          name: newStudent.name,
          email: newStudent.email,
          password: noPassword,
          isValidated: newStudent.isValidated,
          timeUsed: totalTimeUsed,
          notes: studentNotes,
          accountActive: false,
          centerEntryDate: newStudent.centerEntryDate,
          createdAt: newStudent.registrationDate || new Date().toISOString()
        });

        alert(`Étudiant ajouté avec succès avec ${studentNotes.length} notes!\n\nEmail: ${newStudent.email}\n\nL'étudiant doit créer son compte en utilisant le bouton "Créer un compte" sur la page de connexion avec cet email.`);
      }
      setShowAddForm(false);
      setNewStudent({
        name: '',
        email: '',
        registrationDate: new Date().toISOString().split('T')[0],
        isValidated: false,
        centerEntryDate: ''
      });
      setStudentNotes([]);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error adding student:', error);
      if (error.response?.status === 400) {
        alert('Un étudiant avec ce nom existe déjà');
      } else {
        alert('Erreur lors de l\'ajout de l\'étudiant');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddNoteForStudent = (student) => {
    setSelectedStudentForNote(student);
    setShowNoteForm(true);
  };

  const handleAddIndividualNote = async () => {
    if (!newNote.subjectCode || !newNote.grade) {
      alert('Veuillez sélectionner une matière et entrer une note');
      return;
    }

    try {
      const subject = subjects.find(s => s.code === newNote.subjectCode);
      const updatedNotes = [...(selectedStudentForNote.notes || [])];
      
      const existingNoteIndex = updatedNotes.findIndex(n => n.code === newNote.subjectCode);
      const gradeValue = parseFloat(newNote.grade);
      
      const noteData = {
        code: subject.code,
        subject: subject.name,
        threshold: subject.threshold,
        formation: subject.formation,
        periods: {
          period1: { grade: gradeValue, date: new Date().toISOString(), validated: true, weeks: "1-8" },
          period2: { grade: gradeValue, date: new Date().toISOString(), validated: true, weeks: "9-16" },
          period3: { grade: gradeValue, date: new Date().toISOString(), validated: true, weeks: "17-24" },
          period4: { grade: gradeValue, date: new Date().toISOString(), validated: true, weeks: "25-32" },
          period5: { grade: gradeValue, date: new Date().toISOString(), validated: true, weeks: "33-40" }
        },
        finalGrade: gradeValue,
        validated: gradeValue >= subject.threshold,
        grade: gradeValue,
        date: new Date().toISOString()
      };

      if (existingNoteIndex !== -1) {
        updatedNotes[existingNoteIndex] = noteData;
      } else {
        updatedNotes.push(noteData);
      }

      await api.put(`/api/students/${selectedStudentForNote._id}`, {
        ...selectedStudentForNote,
        notes: updatedNotes
      });

      alert('Note ajoutée avec succès!');
      setShowNoteForm(false);
      setNewNote({ subjectCode: '', grade: '' });
      setSelectedStudentForNote(null);
      fetchData();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Erreur lors de l\'ajout de la note');
    }
  };

  const handleAddNoteToStudent = (subjectCode, grade) => {
    const subject = subjects.find(s => s.code === subjectCode);
    if (!subject) return;

    const existingNoteIndex = studentNotes.findIndex(n => n.code === subjectCode);
    
    let updatedNotes;
    if (grade === '' || grade === null) {
      if (existingNoteIndex !== -1) {
        updatedNotes = studentNotes.filter((_, index) => index !== existingNoteIndex);
      } else {
        updatedNotes = studentNotes;
      }
    } else {
      // Create new note with 5-period structure
      const gradeValue = parseFloat(grade);
      const newNote = {
        code: subject.code,
        subject: subject.name,
        threshold: subject.threshold,
        formation: subject.formation,
        periods: {
          period1: { grade: gradeValue, date: newStudent.registrationDate, validated: true, weeks: "1-8" },
          period2: { grade: gradeValue, date: newStudent.registrationDate, validated: true, weeks: "9-16" },
          period3: { grade: gradeValue, date: newStudent.registrationDate, validated: true, weeks: "17-24" },
          period4: { grade: gradeValue, date: newStudent.registrationDate, validated: true, weeks: "25-32" },
          period5: { grade: gradeValue, date: newStudent.registrationDate, validated: true, weeks: "33-40" }
        },
        finalGrade: gradeValue,
        validated: gradeValue >= subject.threshold,
        // Keep backward compatibility
        grade: gradeValue,
        date: newStudent.registrationDate
      };

      if (existingNoteIndex !== -1) {
        updatedNotes = [...studentNotes];
        updatedNotes[existingNoteIndex] = newNote;
      } else {
        updatedNotes = [...studentNotes, newNote];
      }
    }
    
    setStudentNotes(updatedNotes);
    
    // Calculate average and auto-validate if >= 80%
    if (updatedNotes.length > 0) {
      const totalGrade = updatedNotes.reduce((sum, note) => sum + (note.finalGrade || note.grade), 0);
      const average = totalGrade / updatedNotes.length;
      
      setNewStudent({
        ...newStudent,
        isValidated: average >= 80
      });
    } else {
      setNewStudent({
        ...newStudent,
        isValidated: false
      });
    }
  };

  const getNoteForSubject = (subjectCode) => {
    const note = studentNotes.find(n => n.code === subjectCode);
    return note ? (note.finalGrade || note.grade) : '';
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="teacher-students-table">
      <div className="table-header">
        <h2>Vue d'ensemble des Étudiants</h2>
        <button 
          className="add-student-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Annuler' : '+ Ajouter un Étudiant'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-student-form-container">
          <h3>{editingStudent ? `Modifier: ${editingStudent.name}` : 'Ajouter un Nouvel Étudiant'}</h3>
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
                  placeholder="Ajouter un nom"
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
                  placeholder="exemple@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="registrationDate">Date d'inscription *</label>
                <input
                  type="date"
                  id="registrationDate"
                  name="registrationDate"
                  value={newStudent.registrationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="centerEntryDate">Date d'entrée au centre</label>
                <input
                  type="date"
                  id="centerEntryDate"
                  name="centerEntryDate"
                  value={newStudent.centerEntryDate || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Statut de Validation (Automatique):</label>
                <div className="validation-status">
                  {studentNotes.length > 0 ? (
                    <>
                      <div className={`validation-indicator ${newStudent.isValidated ? 'validated' : 'not-validated'}`}>
                        {newStudent.isValidated ? '✓ Validé' : '✗ Non Validé'}
                      </div>
                      <span className="validation-info">
                        Moyenne: {(studentNotes.reduce((sum, note) => sum + note.grade, 0) / studentNotes.length).toFixed(2)}% 
                        {newStudent.isValidated ? ' (≥ 80%)' : ' (< 80%)'}
                      </span>
                    </>
                  ) : (
                    <span className="validation-info">Ajoutez des notes pour calculer la validation</span>
                  )}
                </div>
              </div>
            </div>

            <div className="subjects-notes-section">
              <h4>Ajouter les Notes ({studentNotes.length}/{subjects.length} matières)</h4>
              <p className="info-text">Entrez les notes pour les matières. Laissez vide si pas encore évalué.</p>
              
              <div className="subjects-grid-input">
                {subjects.map(subject => {
                  const noteValue = getNoteForSubject(subject.code);
                  const passed = noteValue !== '' && noteValue >= subject.threshold;
                  const failed = noteValue !== '' && noteValue < subject.threshold;
                  
                  return (
                    <div key={subject.code} className={`subject-input-card ${noteValue !== '' ? (passed ? 'has-pass' : 'has-fail') : ''}`}>
                      <div className="subject-input-header">
                        <span className="subject-input-code">{subject.code}</span>
                        <span className="subject-input-threshold">Seuil: {subject.threshold}%</span>
                      </div>
                      <div className="subject-input-name">{subject.name}</div>
                      <div className="subject-input-field">
                        <label htmlFor={`note-${subject.code}`}>Note:</label>
                        <input
                          type="number"
                          id={`note-${subject.code}`}
                          min="0"
                          max="100"
                          step="0.5"
                          value={noteValue}
                          onChange={(e) => handleAddNoteToStudent(subject.code, e.target.value)}
                          placeholder="0-100"
                          className="note-input"
                        />
                      </div>
                    </div>
                  );
                })}
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
                  setShowAddForm(false);
                  setNewStudent({
                    name: '',
                    email: '',
                    registrationDate: new Date().toISOString().split('T')[0],
                    isValidated: false,
                    centerEntryDate: ''
                  });
                  setStudentNotes([]);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="table-container">
        <table className="students-overview-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Date d'entrée centre</th>
              <th>Validation</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const totalNotes = student.notes?.length || 0;
              const passedNotes = student.notes?.filter(note => {
                const subject = subjects.find(s => s.code === note.code);
                return subject && note.grade >= subject.threshold;
              }).length || 0;

              return (
                <React.Fragment key={student._id}>
                  <tr className={expandedStudent === student._id ? 'expanded' : ''}>
                    <td>
                      {student.profilePicture ? (
                        <img src={student.profilePicture} alt={student.name} className="student-photo" />
                      ) : (
                        <div className="student-photo-placeholder">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="student-name">{student.name}</td>
                    <td className="student-email">{student.email}</td>
                    <td>{formatDate(student.createdAt)}</td>
                    <td>
                      {student.centerEntryDate ? (
                        <span className="center-entry-date">
                          {formatDate(student.centerEntryDate)}
                        </span>
                      ) : (
                        <span className="no-entry-date">Non définie</span>
                      )}
                    </td>
                    <td>
                      <span className={`validation-status ${student.isValidated ? 'validated' : 'not-validated'}`}>
                        {student.isValidated ? '✓ Validé' : '✗ Non Validé'}
                      </span>
                    </td>
                    <td>
                      <span className="notes-summary">
                        {passedNotes}/{totalNotes} réussis
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-student-btn"
                          onClick={() => handleEditStudent(student)}
                          title="Modifier l'étudiant"
                        >
                          ✏️ Modifier
                        </button>
                        <button 
                          className="expand-btn"
                          onClick={() => toggleExpand(student._id)}
                        >
                          {expandedStudent === student._id ? '▼ Masquer' : '▶ Voir détails'}
                        </button>
                        <button 
                          className="delete-student-btn"
                          onClick={() => handleDeleteStudent(student._id, student.name)}
                          title="Supprimer l'étudiant"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedStudent === student._id && (
                    <tr className="expanded-row">
                      <td colSpan="8">
                        <div className="student-details">
                          <div className="student-details-header">
                            <h3>Matières et Notes de {student.name}</h3>
                            <button 
                              className="add-note-btn"
                              onClick={() => handleAddNoteForStudent(student)}
                            >
                              + Ajouter une Note
                            </button>
                          </div>
                          
                          {/* Period Results Summary */}
                          {totalNotes > 0 && (
                            <div className="period-results-summary">
                              <h4>Résultats par Période</h4>
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
                                          <span className="stat-label">Moyenne</span>
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
                          )}
                          
                          {totalNotes > 0 ? (
                            <div className="periods-vertical-layout">
                              {/* Formation 1 */}
                              <div className="period-section">
                                <h4 className="period-title">
                                  <span className="period-badge period-1">Formation 1</span>
                                  <span className="period-weeks">(Semaines 1-8)</span>
                                </h4>
                                <table className="subjects-table period-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note</th>
                                      <th>Statut</th>
                                      <th>Validation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const periodGrade = note.periods?.period1?.grade;
                                      const isValidated = note.periods?.period1?.validated;
                                      const passed = periodGrade && periodGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            {periodGrade ? (
                                              <span className={`period-grade-badge ${passed ? 'pass' : 'fail'}`}>
                                                {periodGrade}%
                                              </span>
                                            ) : (
                                              <span className="no-grade">-</span>
                                            )}
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {periodGrade ? (passed ? '✓ Réussi' : '✗ Échoué') : '-'}
                                            </span>
                                          </td>
                                          <td>
                                            {isValidated ? (
                                              <span className="validation-check validated">✓ Validé</span>
                                            ) : (
                                              <span className="validation-check not-validated">✗ Non validé</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Formation 2 */}
                              <div className="period-section">
                                <h4 className="period-title">
                                  <span className="period-badge period-2">Formation 2</span>
                                  <span className="period-weeks">(Semaines 9-16)</span>
                                </h4>
                                <table className="subjects-table period-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note</th>
                                      <th>Statut</th>
                                      <th>Validation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const periodGrade = note.periods?.period2?.grade;
                                      const isValidated = note.periods?.period2?.validated;
                                      const passed = periodGrade && periodGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            {periodGrade ? (
                                              <span className={`period-grade-badge ${passed ? 'pass' : 'fail'}`}>
                                                {periodGrade}%
                                              </span>
                                            ) : (
                                              <span className="no-grade">-</span>
                                            )}
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {periodGrade ? (passed ? '✓ Réussi' : '✗ Échoué') : '-'}
                                            </span>
                                          </td>
                                          <td>
                                            {isValidated ? (
                                              <span className="validation-check validated">✓ Validé</span>
                                            ) : (
                                              <span className="validation-check not-validated">✗ Non validé</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Formation 3 */}
                              <div className="period-section">
                                <h4 className="period-title">
                                  <span className="period-badge period-3">Formation 3</span>
                                  <span className="period-weeks">(Semaines 17-24)</span>
                                </h4>
                                <table className="subjects-table period-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note</th>
                                      <th>Statut</th>
                                      <th>Validation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const periodGrade = note.periods?.period3?.grade;
                                      const isValidated = note.periods?.period3?.validated;
                                      const passed = periodGrade && periodGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            {periodGrade ? (
                                              <span className={`period-grade-badge ${passed ? 'pass' : 'fail'}`}>
                                                {periodGrade}%
                                              </span>
                                            ) : (
                                              <span className="no-grade">-</span>
                                            )}
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {periodGrade ? (passed ? '✓ Réussi' : '✗ Échoué') : '-'}
                                            </span>
                                          </td>
                                          <td>
                                            {isValidated ? (
                                              <span className="validation-check validated">✓ Validé</span>
                                            ) : (
                                              <span className="validation-check not-validated">✗ Non validé</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Formation 4 */}
                              <div className="period-section">
                                <h4 className="period-title">
                                  <span className="period-badge period-4">Formation 4</span>
                                  <span className="period-weeks">(Semaines 25-32)</span>
                                </h4>
                                <table className="subjects-table period-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note</th>
                                      <th>Statut</th>
                                      <th>Validation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const periodGrade = note.periods?.period4?.grade;
                                      const isValidated = note.periods?.period4?.validated;
                                      const passed = periodGrade && periodGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            {periodGrade ? (
                                              <span className={`period-grade-badge ${passed ? 'pass' : 'fail'}`}>
                                                {periodGrade}%
                                              </span>
                                            ) : (
                                              <span className="no-grade">-</span>
                                            )}
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {periodGrade ? (passed ? '✓ Réussi' : '✗ Échoué') : '-'}
                                            </span>
                                          </td>
                                          <td>
                                            {isValidated ? (
                                              <span className="validation-check validated">✓ Validé</span>
                                            ) : (
                                              <span className="validation-check not-validated">✗ Non validé</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Formation 5 */}
                              <div className="period-section">
                                <h4 className="period-title">
                                  <span className="period-badge period-5">Formation 5</span>
                                  <span className="period-weeks">(Semaines 33-40)</span>
                                </h4>
                                <table className="subjects-table period-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note</th>
                                      <th>Statut</th>
                                      <th>Validation</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const periodGrade = note.periods?.period5?.grade;
                                      const isValidated = note.periods?.period5?.validated;
                                      const passed = periodGrade && periodGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            {periodGrade ? (
                                              <span className={`period-grade-badge ${passed ? 'pass' : 'fail'}`}>
                                                {periodGrade}%
                                              </span>
                                            ) : (
                                              <span className="no-grade">-</span>
                                            )}
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {periodGrade ? (passed ? '✓ Réussi' : '✗ Échoué') : '-'}
                                            </span>
                                          </td>
                                          <td>
                                            {isValidated ? (
                                              <span className="validation-check validated">✓ Validé</span>
                                            ) : (
                                              <span className="validation-check not-validated">✗ Non validé</span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* Final Summary */}
                              <div className="period-section final-summary">
                                <h4 className="period-title">
                                  <span className="period-badge final">Résumé Final</span>
                                </h4>
                                <table className="subjects-table final-table">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Matière</th>
                                      <th>Seuil</th>
                                      <th>Formation</th>
                                      <th>Note Finale</th>
                                      <th>Statut Final</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {student.notes.map((note, index) => {
                                      const subject = subjects.find(s => s.code === note.code);
                                      const finalGrade = note.finalGrade || note.grade;
                                      const passed = finalGrade >= note.threshold;
                                      
                                      return (
                                        <tr key={index}>
                                          <td className="subject-code">{note.code}</td>
                                          <td className="subject-name">{note.subject}</td>
                                          <td>{note.threshold}%</td>
                                          <td>
                                            <span className="formation-badge">F{subject?.formation || 1}</span>
                                          </td>
                                          <td>
                                            <span className={`final-grade ${passed ? 'pass' : 'fail'}`}>
                                              {finalGrade}%
                                            </span>
                                          </td>
                                          <td>
                                            <span className={`status ${passed ? 'pass' : 'fail'}`}>
                                              {passed ? '✓ Réussi' : '✗ Échoué'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <p className="no-notes">Aucune note disponible pour cet étudiant</p>
                          )}
                          
                          <div className="all-subjects-section">
                            <h4>Toutes les Matières Disponibles</h4>
                            <div className="subjects-grid">
                              {subjects.map(subject => {
                                const grade = getStudentGrade(student, subject.code);
                                const status = getStudentNoteStatus(student, subject.code);
                                
                                return (
                                  <div key={subject.code} className={`subject-card ${status || 'not-taken'}`}>
                                    <div className="subject-card-header">
                                      <span className="subject-code">{subject.code}</span>
                                      <span className={`subject-grade ${status || ''}`}>
                                        {grade !== '-' ? `${grade}%` : 'Non évalué'}
                                      </span>
                                    </div>
                                    <div className="subject-card-body">
                                      <p className="subject-name">{subject.name}</p>
                                      <p className="subject-threshold">Seuil: {subject.threshold}%</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherStudentsTable;
