require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function createTestStudent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: 'test@student.com' });
    if (existingStudent) {
      console.log('Test student already exists!');
      console.log('Email: test@student.com');
      console.log('Password: test123');
      process.exit(0);
    }

    // Create test student
    const testStudent = new Student({
      name: 'Test Student',
      email: 'test@student.com',
      password: 'test123',
      notes: [],
      timeUsed: 0,
      isValidated: false,
      accountActive: true,
      createdAt: new Date()
    });

    await testStudent.save();
    console.log('✅ Test student created successfully!');
    console.log('📧 Email: test@student.com');
    console.log('🔑 Password: test123');
    console.log('');
    console.log('You can now log in with these credentials!');

  } catch (error) {
    console.error('❌ Error creating test student:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createTestStudent();