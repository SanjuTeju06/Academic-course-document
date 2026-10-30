/**
 * @file subjectController.js
 * @description Controller for the legacy Subject model.
 * Retained for backwards compatibility of Subject collection CRUD workflows.
 */

const Subject = require('../models/Subject');

/**
 * @route GET /api/subjects
 * @desc Retrieve legacy subjects based on query parameters.
 * @access Public
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const { search, semester, difficulty } = req.query;
    let query = {};
    if (search) query.subject_name = { $regex: search, $options: 'i' };
    if (semester) query.semester = parseInt(semester);
    if (difficulty) query.difficulty = difficulty;

    const subjects = await Subject.find(query).sort({ semester: 1, subject_code: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subjects: ' + error.message });
  }
};

/**
 * @route GET /api/subjects/:id
 * @desc Retrieve a single legacy subject record.
 * @access Public
 */
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving subject: ' + error.message });
  }
};

/**
 * @route POST /api/subjects
 * @desc Register a new legacy subject object.
 * @access Admin
 */
exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({ message: 'Error registering subject: ' + error.message });
  }
};

/**
 * @route PUT /api/subjects/:id
 * @desc Modify an existing legacy subject object.
 * @access Admin
 */
exports.updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: 'Error modifying subject: ' + error.message });
  }
};

/**
 * @route DELETE /api/subjects/:id
 * @desc Remove a legacy subject.
 * @access Admin
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject: ' + error.message });
  }
};
