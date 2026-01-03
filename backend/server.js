require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const studentRoutes = require('./routes/students');
const subjectRoutes = require('./routes/subjects');
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api', studentRoutes); // For login endpoint

app.get('/', (req, res) => {
  res.json({ message: 'Student Management API' });
});

// Export the app for Vercel
module.exports = app;

// Only listen when running locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
