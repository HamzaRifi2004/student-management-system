import React from 'react';
import './StudentList.css';

function StudentList({ students, onSelectStudent, selectedStudent }) {
  return (
    <div className="student-list">
      <h2>Students</h2>
      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <ul>
          {students.map(student => (
            <li 
              key={student._id}
              className={selectedStudent?._id === student._id ? 'active' : ''}
              onClick={() => onSelectStudent(student)}
            >
              <div className="student-item">
                <h3>{student.name}</h3>
                <span className={`status ${student.isValidated ? 'validated' : 'not-validated'}`}>
                  {student.isValidated ? '✓ Validé' : '✗ Non Validé'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentList;
