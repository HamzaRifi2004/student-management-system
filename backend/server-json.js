const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const STUDENTS_FILE = path.join(__dirname, 'students-data.json');
const SUBJECTS_FILE = path.join(__dirname, 'subjects-data.json');

// Helper functions
async function readStudents() {
  const data = await fs.readFile(STUDENTS_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeStudents(students) {
  await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2));
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const students = await readStudents();
    
    // Find student by email
    const student = students.find(s => s.email === email);
    
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    
    // Check password
    if (!student.password || student.password !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    
    // Return student data (excluding password)
    const { password: _, ...studentData } = student;
    res.json(studentData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    console.log('Reading students from:', STUDENTS_FILE);
    const students = await readStudents();
    console.log('Students found:', students.length);
    // Remove passwords from response
    const studentsWithoutPasswords = students.map(({ password, ...student }) => student);
    res.json(studentsWithoutPasswords);
  } catch (error) {
    console.error('Error reading students:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const student = students.find(s => s._id === req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const { password, ...studentData } = student;
    res.json(studentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new student (register)
app.post('/api/students', async (req, res) => {
  try {
    const students = await readStudents();
    
    // Check if email already exists
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
    res.status(201).json(studentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const index = students.findIndex(s => s._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    students[index] = { ...students[index], ...req.body };
    await writeStudents(students);
    
    const { password, ...studentData } = students[index];
    res.json(studentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const students = await readStudents();
    const filteredStudents = students.filter(s => s._id !== req.params.id);
    
    if (students.length === filteredStudents.length) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await writeStudents(filteredStudents);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const data = await fs.readFile(SUBJECTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Student Management API - JSON Database',
    timestamp: new Date().toISOString(),
    version: '1.0.1'
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    studentsFile: STUDENTS_FILE,
    timestamp: new Date().toISOString()
  });
});

// Export the app for Vercel
module.exports = app;

// Only listen when running locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using JSON files as database`);
  });
}
