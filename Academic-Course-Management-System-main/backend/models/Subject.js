/**
 * @file Subject.js
 * @description Legacy Subject schema model. Previously used to represent basic academic subjects
 * in the simple website prototype. Retained for database structure backwards compatibility or
 * potential side features.
 */

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  // Target college semester (1 to 8)
  semester: { type: Number, required: true },
  // Unique identification code (e.g., UE24CS2404)
  subject_code: { type: String, required: true, unique: true },
  // Title or name of the subject
  subject_name: { type: String, required: true },
  // Primary professor or instructor name
  faculty_name: { type: String, default: 'TBD' },
  // Total academic credit points
  credits: { type: Number, required: true },
  // Difficulty scale for SurviveMyDegree navigation
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Nightmare'], required: true },
  // Card visual icon
  emoji: { type: String, required: true },
  // Humorous, engaging tagline/joke about the subject
  funny_description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
