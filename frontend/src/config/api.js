import axios from 'axios';

// For demo purposes, use a mock API that works with local storage
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://projet-ayoub.vercel.app/api' 
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Mock API for production demo
if (process.env.NODE_ENV === 'production') {
  // Mock data
  const mockStudents = [
    {
      "_id": "1765027206331",
      "name": "hamza Rifi",
      "email": "hmizrifi2004@gmail.com",
      "notes": [
        {
          "code": "001",
          "subject": "Analyser la fonction de travail",
          "threshold": 75,
          "formation": 1,
          "periods": {
            "period1": { "grade": 85, "date": "2024-02-15", "validated": true, "weeks": "1-8" },
            "period2": { "grade": 88, "date": "2024-04-15", "validated": true, "weeks": "9-16" },
            "period3": { "grade": 90, "date": "2024-06-15", "validated": true, "weeks": "17-24" },
            "period4": { "grade": 92, "date": "2024-08-15", "validated": true, "weeks": "25-32" },
            "period5": { "grade": 95, "date": "2024-10-15", "validated": true, "weeks": "33-40" }
          },
          "finalGrade": 90,
          "validated": true
        }
      ],
      "timeUsed": 4231,
      "isValidated": true,
      "createdAt": "2024-01-15",
      "profilePicture": null,
      "accountActive": true
    },
    {
      "_id": "1765027206332",
      "name": "Test Student",
      "email": "test@student.com",
      "notes": [],
      "timeUsed": 0,
      "isValidated": false,
      "createdAt": "2024-01-15",
      "profilePicture": null,
      "accountActive": true
    }
  ];

  const mockSubjects = [
    {
      "code": "001",
      "name": "Analyser la fonction de travail",
      "threshold": 75,
      "moduleCode": "M01",
      "hours": 4,
      "hoursTheory": 2,
      "hoursPractical": 2,
      "totalHours": 60,
      "formation": "Formation 1"
    },
    {
      "code": "002",
      "name": "Modéliser et interpréter des résultats mathématiques",
      "threshold": 80,
      "moduleCode": "M02",
      "hours": 3,
      "hoursTheory": 2,
      "hoursPractical": 1,
      "totalHours": 45,
      "formation": "Formation 1"
    }
  ];

  // Override axios methods completely for production
  api.get = (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/api/students') {
          resolve({ data: mockStudents });
        } else if (url === '/api/subjects') {
          resolve({ data: mockSubjects });
        } else if (url.startsWith('/api/students/')) {
          const id = url.split('/').pop();
          const student = mockStudents.find(s => s._id === id);
          if (student) {
            resolve({ data: student });
          } else {
            resolve({ status: 404, data: { message: 'Student not found' } });
          }
        } else {
          resolve({ data: [] });
        }
      }, 300);
    });
  };

  api.post = (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/api/login') {
          const { email, password } = data;
          
          console.log('Mock API: Login attempt', { email, password });
          
          if (email === 'hmizrifi2004@gmail.com' && password === 'Hamzarifi2004') {
            console.log('Mock API: Login successful for Hamza');
            resolve({ data: mockStudents[0] });
          } else if (email === 'test@student.com' && password === 'test123') {
            console.log('Mock API: Login successful for Test Student');
            resolve({ data: mockStudents[1] });
          } else if ((email === 'teacher@atfp.tn' || email === 'teacher@gmail.com') && password === 'teacher123') {
            console.log('Mock API: Login successful for Teacher');
            resolve({ 
              data: { 
                _id: 'teacher1',
                name: 'Teacher', 
                email: email, // Use the email they entered
                role: 'teacher',
                isTeacher: true
              } 
            });
          } else {
            console.log('Mock API: Login failed - invalid credentials');
            const error = new Error('Invalid credentials');
            error.response = { status: 401, data: { message: 'Mot de passe incorrect' } };
            reject(error);
          }
        } else if (url === '/api/students') {
          // Create new student
          const newStudent = {
            _id: Date.now().toString(),
            ...data,
            notes: [],
            timeUsed: 0,
            isValidated: false,
            createdAt: new Date().toISOString(),
            accountActive: true
          };
          mockStudents.push(newStudent);
          resolve({ data: newStudent, status: 201 });
        } else {
          resolve({ data: { message: 'Success' } });
        }
      }, 300);
    });
  };

  api.put = (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/api/students/')) {
          const id = url.split('/').pop();
          const index = mockStudents.findIndex(s => s._id === id);
          if (index !== -1) {
            mockStudents[index] = { ...mockStudents[index], ...data };
            resolve({ data: mockStudents[index] });
          } else {
            resolve({ status: 404, data: { message: 'Student not found' } });
          }
        } else {
          resolve({ data: { message: 'Updated' } });
        }
      }, 300);
    });
  };

  api.delete = (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/api/students/')) {
          const id = url.split('/').pop();
          const index = mockStudents.findIndex(s => s._id === id);
          if (index !== -1) {
            mockStudents.splice(index, 1);
            resolve({ data: { message: 'Student deleted' } });
          } else {
            resolve({ status: 404, data: { message: 'Student not found' } });
          }
        } else {
          resolve({ data: { message: 'Deleted' } });
        }
      }, 300);
    });
  };
}

export default api;