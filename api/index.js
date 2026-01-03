const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File paths - adjust for Vercel structure
const STUDENTS_FILE = path.join(process.cwd(), 'backend', 'students-data.json');
const SUBJECTS_FILE = path.join(process.cwd(), 'backend', 'subjects-data.json');

// Helper functions
async function readStudents() {
  try {
    const data = await fs.readFile(STUDENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading students file:', error);
    return [];
  }
}

async function writeStudents(students) {
  try {
    await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2));
  } catch (error) {
    console.error('Error writing students file:', error);
  }
}

async function readSubjects() {
  try {
    const data = await fs.readFile(SUBJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subjects file:', error);
    return [];
  }
}

// Main handler for Vercel
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  
  try {
    // Root endpoint
    if (url === '/api' || url === '/api/') {
      return res.json({ 
        message: 'Student Management API - JSON Database',
        timestamp: new Date().toISOString(),
        version: '1.0.1'
      });
    }

    // Login endpoint
    if (url === '/api/login' && method === 'POST') {
      const { email, password } = req.body;
      const students = await readStudents();
      
      const student = students.find(s => s.email === email);
      
      if (!student) {
        return res.status(404).json({ message: 'Étudiant non trouvé' });
      }
      
      if (!student.password || student.password !== password) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      
      const { password: _, ...studentData } = student;
      return res.json(studentData);
    }

    // Get all students
    if (url === '/api/students' && method === 'GET') {
      const students = await readStudents();
      const studentsWithoutPasswords = students.map(({ password, ...student }) => student);
      return res.json(studentsWithoutPasswords);
    }

    // Create new student
    if (url === '/api/students' && method === 'POST') {
      const students = await readStudents();
      
      if (students.find(s => s.email === req.body.email)) {
        return res.status(400).json({ message: 'Cet email existe déjà' });
      }
      
      const newStudent = {
        _id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        notes: req.body.notes || [],
        timeUsed: req.body.timeUsed || 0,
        isValidated: req.body.isValidated || false,
        accountActive: req.body.accountActive || false,
        centerEntryDate: req.body.centerEntryDate || null,
        createdAt: req.body.createdAt || new Date().toISOString()
      };
      
      students.push(newStudent);
      await writeStudents(students);
      
      const { password, ...studentData } = newStudent;
      return res.status(201).json(studentData);
    }

    // Get all subjects
    if (url === '/api/subjects' && method === 'GET') {
      const subjects = await readSubjects();
      return res.json(subjects);
    }

    // Handle student by ID routes
    const studentIdMatch = url.match(/^\/api\/students\/(.+)$/);
    if (studentIdMatch) {
      const studentId = studentIdMatch[1];
      const students = await readStudents();
      
      if (method === 'GET') {
        const student = students.find(s => s._id === studentId);
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
        const { password, ...studentData } = student;
        return res.json(studentData);
      }
      
      if (method === 'PUT') {
        const index = students.findIndex(s => s._id === studentId);
        if (index === -1) {
          return res.status(404).json({ message: 'Student not found' });
        }
        
        students[index] = { ...students[index], ...req.body };
        await writeStudents(students);
        
        const { password, ...studentData } = students[index];
        return res.json(studentData);
      }
      
      if (method === 'DELETE') {
        const filteredStudents = students.filter(s => s._id !== studentId);
        if (students.length === filteredStudents.length) {
          return res.status(404).json({ message: 'Student not found' });
        }
        
        await writeStudents(filteredStudents);
        return res.json({ message: 'Student deleted' });
      }
    }

    // 404 for unmatched routes
    res.status(404).json({ message: 'Route not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};