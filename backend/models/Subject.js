const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  moduleCode: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  hours: Number,
  hoursTheory: Number,
  hoursPractical: Number,
  totalHours: Number,
  formation: Number
});

module.exports = mongoose.model('Subject', subjectSchema);
