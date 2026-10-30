/**
 * @file Course.js
 * @description Mongoose schema for the Core Course document. 
 * This model contains complete academic course metadata, objectives, outcomes (COs),
 * CO-PO/PSO mappings, unit syllabus content, lesson plans, textbook/reference listings,
 * assessment details, as well as SurviveMyDegree gamified elements.
 */

const mongoose = require('mongoose');

/**
 * @typedef {Object} Unit
 * @property {string} title - The title of the syllabus unit.
 * @property {number} hours - Number of hours dedicated to this unit.
 * @property {string[]} content - Bullet points or topics covered in this unit.
 */
const unitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hours: { type: Number, required: true },
  content: [String]
});

/**
 * @typedef {Object} Assessment
 * @property {string} type - Assessment type (e.g. CIE, SEE, Quiz, Assignment).
 * @property {number} marks - Maximum marks allotted for this component.
 * @property {string} description - Brief description of what the assessment evaluates.
 */
const assessmentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  marks: { type: Number, required: true },
  description: String
});

/**
 * @typedef {Object} LessonPlanRow
 * @property {number} weekNo - The week number (1-16 typically).
 * @property {string} lectureNo - The list of lecture numbers (e.g. L1-L3).
 * @property {string} topics - Topics planned for these lectures.
 * @property {string[]} cosMapped - List of Course Outcomes mapped to this lesson segment (e.g. CO1, CO2).
 * @property {string} teachingMethod - The pedagogical method used (e.g. Lecture, Active Learning, Lab).
 * @property {number} durationHours - Number of hours for this topic.
 */
const lessonPlanRowSchema = new mongoose.Schema({
  weekNo: { type: Number, required: true },
  lectureNo: { type: String, required: true },
  topics: { type: String, required: true },
  cosMapped: [String],
  teachingMethod: { type: String, default: 'Lecture' },
  durationHours: { type: Number, default: 1 }
});

/**
 * @typedef {Object} Course
 * @property {string} courseCode - Unique university course identifier (e.g. UE24CS2404).
 * @property {string} courseTitle - Full academic title of the course.
 * @property {number} semester - The target semester (1 to 8).
 * @property {string} program - The academic program name (e.g. B.Tech Computer Science).
 * @property {number} credits - Number of credits assigned to this course.
 * @property {number} hours - Total teaching hours.
 * @property {string} department - Offering academic department.
 * @property {string[]} courseObjectives - List of educational objectives.
 * @property {Array} courseOutcomes - Detailed Course Outcomes with cognitive bloom levels.
 * @property {Array} coPoMapping - The mapping of each CO against 12 Program Outcomes (POs) and 2 Program Specific Outcomes (PSOs).
 * @property {Array} units - Array of Unit objects representing the physical syllabus structure.
 * @property {Array} lessonPlan - Chronological week-by-week lesson plan entries.
 * @property {Array} textbooks - Assigned textbooks.
 * @property {Array} references - Suggested reference books.
 * @property {Array} assessment - Distribution of marks (CIE, SEE).
 * @property {string} attainmentTargets - Expected student performance targets.
 * @property {string} gradingScheme - The grading methodology used.
 * @property {string} difficulty - Gamified course difficulty level (Easy, Medium, Hard, Nightmare).
 * @property {string} emoji - Card visual emoji for front-end representations.
 * @property {string} funny_description - Meme description for SurviveMyDegree portal.
 */
const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true, index: true },
  courseTitle: { type: String, required: true },
  semester: { type: Number, required: true, index: true },
  program: { type: String, required: true },
  credits: { type: Number, required: true },
  hours: { type: Number, required: true },
  department: { type: String, default: 'Computer Science & Engineering' },
  branch: { type: String, default: 'CS', index: true },
  courseObjectives: [String],
  courseOutcomes: [
    {
      coId: { type: String, required: true },
      description: { type: String, required: true },
      bloomLevel: { type: String, default: 'Understand' } // Bloom's Cognitive Level
    }
  ],
  coPoMapping: [
    {
      coId: { type: String, required: true },
      mappings: {
        PO1: { type: Number, default: 0 }, PO2: { type: Number, default: 0 }, PO3: { type: Number, default: 0 }, PO4: { type: Number, default: 0 },
        PO5: { type: Number, default: 0 }, PO6: { type: Number, default: 0 }, PO7: { type: Number, default: 0 }, PO8: { type: Number, default: 0 },
        PO9: { type: Number, default: 0 }, PO10: { type: Number, default: 0 }, PO11: { type: Number, default: 0 }, PO12: { type: Number, default: 0 },
        PSO1: { type: Number, default: 0 }, PSO2: { type: Number, default: 0 }
      }
    }
  ],
  units: [unitSchema],
  lessonPlan: [lessonPlanRowSchema],
  textbooks: [
    {
      title: String,
      author: String,
      publisher: String,
      year: String
    }
  ],
  references: [
    {
      title: String,
      author: String,
      publisher: String,
      year: String
    }
  ],
  assessment: [assessmentSchema],
  assessmentWeights: {
    quiz: { type: Number, default: 15 },
    test: { type: Number, default: 25 },
    assignment: { type: Number, default: 20 },
    see: { type: Number, default: 40 },
    total: { type: Number, default: 100 }
  },
  assessmentCoDistribution: {
    type: [
      {
        coId: { type: String, required: true },
        quiz: { type: Number, default: 0 },
        test: { type: Number, default: 0 },
        assignment: { type: Number, default: 0 },
        see: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 0 }
      }
    ],
    default: [
      { coId: 'CO1', quiz: 10, test: 0, assignment: 0, see: 8, totalMarks: 18 },
      { coId: 'CO2', quiz: 5, test: 9, assignment: 0, see: 12, totalMarks: 26 },
      { coId: 'CO3', quiz: 0, test: 8, assignment: 0, see: 10, totalMarks: 18 },
      { coId: 'CO4', quiz: 0, test: 8, assignment: 0, see: 6, totalMarks: 14 },
      { coId: 'CO5', quiz: 0, test: 0, assignment: 10, see: 4, totalMarks: 14 },
      { coId: 'CO6', quiz: 0, test: 0, assignment: 10, see: 0, totalMarks: 10 }
    ]
  },
  assessmentSchedule: {
    type: [
      {
        assessmentType: { type: String, required: true },
        date: { type: String, default: '' },
        marks: { type: Number, default: 0 },
        cos: { type: String, default: '' },
        duration: { type: String, default: '' }
      }
    ],
    default: [
      { assessmentType: 'Quiz-1', date: '5th week', marks: 5, cos: 'CO1', duration: '30 min' },
      { assessmentType: 'Quiz-2', date: '10th week', marks: 5, cos: 'CO2', duration: '30 min' },
      { assessmentType: 'Quiz-3', date: '15th week', marks: 5, cos: 'CO1', duration: '30 min' },
      { assessmentType: 'Test-1', date: '5th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
      { assessmentType: 'Test-2', date: '10th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
      { assessmentType: 'Test-3', date: '15th week', marks: 5, cos: 'CO2, CO3, CO4', duration: '60 min' },
      { assessmentType: 'Assignment-1', date: '7th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
      { assessmentType: 'Assignment-2', date: '14th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
      { assessmentType: 'SEE', date: '18th week', marks: 40, cos: 'CO1 - CO5', duration: '3 hours' }
    ]
  },
  attainmentTargets: { type: String, default: '80% of students scoring > 60%' },
  gradingScheme: { type: String, default: '91 and above: O (outstanding); 81-90: A+ (Excellent); 71-80: A (Very Good); 61-70: B+ (Good); 51-60: B (Above Average); 40-50: C (Average); below 40: D (Not satisfactory). If one scores D grade, the candidate is required to re-register for the course if he/she wants to earn the credit at his/her own convenience.' },

  // --- SurviveMyDegree Gamified Elements ---
  difficulty: { type: String, default: 'Medium' },
  emoji: { type: String, default: '📚' },
  funny_description: { type: String, default: 'Another course to survive.' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
