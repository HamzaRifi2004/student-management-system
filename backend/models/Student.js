const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  notes: [{
    code: String,
    subject: String,
    threshold: Number,
    formation: Number,
    periods: {
      period1: {
        grade: Number,
        date: String,
        validated: Boolean,
        weeks: String
      },
      period2: {
        grade: Number,
        date: String,
        validated: Boolean,
        weeks: String
      },
      period3: {
        grade: Number,
        date: String,
        validated: Boolean,
        weeks: String
      },
      period4: {
        grade: Number,
        date: String,
        validated: Boolean,
        weeks: String
      },
      period5: {
        grade: Number,
        date: String,
        validated: Boolean,
        weeks: String
      }
    },
    finalGrade: Number,
    validated: Boolean,
    // Backward compatibility
    grade: Number,
    date: String
  }],
  profilePicture: {
    type: String,
    default: ''
  },
  timeUsed: {
    type: Number,
    default: 0,
    comment: 'Time in minutes'
  },
  isValidated: {
    type: Boolean,
    default: false
  },
  accountActive: {
    type: Boolean,
    default: false
  },
  centerEntryDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);
