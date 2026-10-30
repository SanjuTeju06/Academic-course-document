/**
 * @file courseController.js
 * @description Controller implementation for all Academic Course operations.
 * Handles course listing (with optional search regex, semester filter, and program filter),
 * single course retrieval, insertion/registration of new courses, dynamic field updates,
 * and deletion operations.
 */

const Course = require('../models/Course');

/**
 * @route GET /api/courses
 * @desc Retrieve a list of courses matching search query or filters.
 * @access Public
 */
exports.getAllCourses = async (req, res) => {
  try {
    const { search, semester, program, branch } = req.query;
    let query = {};

    // Apply regex search on Course Code or Course Title (case-insensitive)
    if (search) {
      query.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Apply optional exact matches on semester, program, and branch
    if (semester) query.semester = semester;
    if (program) query.program = program;
    if (branch) query.branch = branch;

    // Retrieve courses sorted by target semester, then course code alphabetically
    const courses = await Course.find(query).sort({ semester: 1, courseCode: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses: ' + error.message });
  }
};

/**
 * @route GET /api/courses/:id
 * @desc Retrieve a single course document by its Mongo ID.
 * @access Public
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course details: ' + error.message });
  }
};

/**
 * @route POST /api/courses
 * @desc Create and save a new course with comprehensive educational syllabus details.
 * @access Admin
 */
exports.createCourse = async (req, res) => {
  try {
    // Instantiate new model from request payload containing full unit content, mappings, and lesson plan
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Validation/Database Error creating course: ' + error.message });
  }
};

/**
 * @route PUT /api/courses/:id
 * @desc Find a course by Mongo ID and apply requested schema updates.
 * @access Admin
 */
exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course details: ' + error.message });
  }
};

/**
 * @route DELETE /api/courses/:id
 * @desc Remove a course by Mongo ID.
 * @access Admin
 */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course: ' + error.message });
  }
};
