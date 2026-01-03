import React from 'react';
import './StudentDetail.css';

function StudentDetail({ student }) {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="student-detail">
      <h2>{student.name}</h2>
      <p className="email">{student.email}</p>
      
      <div className="info-section">
        <div className="info-card">
          <h3>Validation Status</h3>
          <p className={student.isValidated ? 'validated' : 'not-validated'}>
            {student.isValidated ? '✓ Validated' : '✗ Not Validated'}
          </p>
        </div>
        
        <div className="info-card">
          <h3>Time Used</h3>
          <p>{formatTime(student.timeUsed)}</p>
        </div>
      </div>

      <div className="notes-section">
        <h3>Notes</h3>
        {student.notes && student.notes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {student.notes.map((note, index) => (
                <tr key={index}>
                  <td>{note.subject}</td>
                  <td>{note.grade}</td>
                  <td>{new Date(note.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </div>
  );
}

export default StudentDetail;
