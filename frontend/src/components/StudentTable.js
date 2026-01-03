import React from 'react';
import './StudentTable.css';

function StudentTable({ students, subjects = [] }) {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getValidationStatus = (student) => {
    const notes = student.notes || [];
    const withKnownSubjects = subjects.length ? notes.filter(n => subjects.find(s => s.code === n.code)) : notes;
    const totalSubjects = withKnownSubjects.length;

    const subjectsPassed = withKnownSubjects.every(note => {
      const subject = subjects.find(s => s.code === note.code);
      if (!subject) return true;
      const finalGrade = note.finalGrade ?? note.grade ?? null;
      if (finalGrade === null || finalGrade === undefined) return false;
      return finalGrade >= subject.threshold;
    });

    const periodChecks = subjects.length ? [1, 2, 3, 4, 5].map(period => {
      const periodNotes = withKnownSubjects.filter(n => n.periods?.[`period${period}`]?.grade !== undefined);
      if (periodNotes.length === 0) return null; // ignore periods without grades
      return periodNotes.every(note => {
        const subject = subjects.find(s => s.code === note.code);
        if (!subject) return false;
        const periodGrade = note.periods?.[`period${period}`]?.grade;
        return typeof periodGrade === 'number' && periodGrade >= subject.threshold;
      });
    }).filter(v => v !== null) : [];

    const hasAnyGrade = withKnownSubjects.some(n => n.grade !== undefined || n.finalGrade !== undefined || Object.values(n.periods || {}).some(p => p.grade !== undefined));
    const periodsPassed = periodChecks.length === 0 ? true : periodChecks.every(Boolean);
    const isValidatedDerived = hasAnyGrade && totalSubjects > 0 && subjectsPassed && periodsPassed;
    const isRefusedDerived = hasAnyGrade && totalSubjects > 0 && !isValidatedDerived;

    return { isValidatedDerived, isRefusedDerived };
  };

  return (
    <div className="table-container">
      {students.length === 0 ? (
        <div className="no-data">No students found</div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Date d'entrée au centre</th>
              <th>Validation</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const { isValidatedDerived, isRefusedDerived } = getValidationStatus(student);
              return (
                <tr key={student._id}>
                  <td className="student-name">{student.name}</td>
                  <td className="student-email">{student.email}</td>
                  <td className="date">{student.centerEntryDate ? formatDate(student.centerEntryDate) : 'N/A'}</td>
                  <td className="validation">
                    <span className={`status-badge ${isRefusedDerived ? 'not-validated refused' : isValidatedDerived ? 'validated' : 'not-validated'}`}>
                      {isRefusedDerived ? '✗ Refusé (auto)' : isValidatedDerived ? '✓ Validé (auto)' : '✗ Non Validé (auto)'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentTable;
