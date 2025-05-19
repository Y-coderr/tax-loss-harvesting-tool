const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  jobType: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },
  salary: {
    type: String
  },
  experience: {
    type: String
  },
  applicationLink: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);