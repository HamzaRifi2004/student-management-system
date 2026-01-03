const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find student by email
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    
    // Check password
    if (student.password !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    
    // Return student data (excluding password)
    const studentData = student.toObject();
    delete studentData.password;
    res.json(studentData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new student
router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    notes: req.body.notes || [],
    timeUsed: req.body.timeUsed || 0,
    isValidated: req.body.isValidated || false,
    accountActive: req.body.accountActive || false,
    centerEntryDate: req.body.centerEntryDate || null,
    createdAt: req.body.createdAt || new Date()
  });

  try {
    const newStudent = await student.save();
    const studentData = newStudent.toObject();
    delete studentData.password;
    res.status(201).json(studentData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (req.body.name) student.name = req.body.name;
    if (req.body.email) student.email = req.body.email;
    if (req.body.notes) student.notes = req.body.notes;
    if (req.body.timeUsed !== undefined) student.timeUsed = req.body.timeUsed;
    if (req.body.isValidated !== undefined) student.isValidated = req.body.isValidated;
    if (req.body.profilePicture !== undefined) student.profilePicture = req.body.profilePicture;
    if (req.body.accountActive !== undefined) student.accountActive = req.body.accountActive;
    if (req.body.centerEntryDate !== undefined) student.centerEntryDate = req.body.centerEntryDate;
    if (req.body.createdAt) student.createdAt = req.body.createdAt;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    await student.deleteOne();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
