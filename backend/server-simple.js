const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const dataFile = path.join(__dirname, 'students-data.json');
const subjectsFile = path.join(__dirname, 'subjects-data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  const initialData = [
    {
      _id: '1',
      name: 'Ahmed Ben Ali',
      email: 'ahmed@example.com',
      password: 'password123',
      notes: [
        { code: '001', subject: 'Analyser la fonction de travail', grade: 80, threshold: 75, date: new Date() },
        { code: '002', subject: 'Modéliser et interpréter des résultats mathématiques', grade: 85, threshold: 80, date: new Date() },
        { code: '025', subject: 'Anglais', grade: 55, threshold: 50, date: new Date() },
        { code: '037', subject: 'Gestion', grade: 65, threshold: 50, date: new Date() }
      ],
      timeUsed: 120,
      isValidated: true,
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Fatima Mansour',
      email: 'fatima@example.com',
      password: 'password123',
      notes: [
        { code: '005', subject: 'Analyser les circuits électroniques', grade: 78, threshold: 75, date: new Date() },
        { code: '011', subject: 'Exploiter les logiciels appliqués aux télécommunications', grade: 92, threshold: 90, date: new Date() },
        { code: '026', subject: 'Communicative English', grade: 65, threshold: 60, date: new Date() }
      ],
      timeUsed: 90,
      isValidated: false,
      createdAt: new Date()
    }
  ];
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// Helper functions
const readData = () => {
  const data = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Routes

// Get all students
app.get('/api/students', (req, res) => {
  try {
    const students = readData();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by ID
app.get('/api/students/:id', (req, res) => {
  try {
    const students = readData();
    const student = students.find(s => s._id === req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new student
app.post('/api/students', (req, res) => {
  try {
    const students = readData();
    
    // Check if email already exists
    const existingStudent = students.find(s => s.email === req.body.email);
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newStudent = {
      _id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Store password
      notes: req.body.notes || [],
      timeUsed: req.body.timeUsed || 0,
      isValidated: req.body.isValidated || false,
      createdAt: new Date()
    };

    students.push(newStudent);
    writeData(students);
    
    // Don't send password back to client
    const { password, ...studentWithoutPassword } = newStudent;
    res.status(201).json(studentWithoutPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  try {
    const students = readData();
    const { email, password } = req.body;
    
    // Find student by email
    const student = students.find(s => s.email === email);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check password
    if (student.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // Don't send password back to client
    const { password: pwd, ...studentWithoutPassword } = student;
    res.json(studentWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student
app.put('/api/students/:id', (req, res) => {
  try {
    const students = readData();
    const index = students.findIndex(s => s._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = students[index];
    
    if (req.body.name) student.name = req.body.name;
    if (req.body.email) student.email = req.body.email;
    if (req.body.notes) student.notes = req.body.notes;
    if (req.body.timeUsed !== undefined) student.timeUsed = req.body.timeUsed;
    if (req.body.isValidated !== undefined) student.isValidated = req.body.isValidated;

    students[index] = student;
    writeData(students);
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  try {
    const students = readData();
    const index = students.findIndex(s => s._id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    students.splice(index, 1);
    writeData(students);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subjects
app.get('/api/subjects', (req, res) => {
  try {
    const subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Student Management API - Simple Version' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using JSON file storage (no MongoDB required)');
});
