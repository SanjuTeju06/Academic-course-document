/**
 * @file courseRoutes.js
 * @description Defines Express routes for Course / Syllabus management operations.
 * Maps HTTP verbs to corresponding controller functions in courseController.js.
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Retrieve all course details (accepts optional 'search', 'semester', 'program' query params)
router.get('/', courseController.getAllCourses);

// Retrieve full syllabus details of a single course by its MongoDB Document ID
router.get('/:id', courseController.getCourseById);

// Add a brand new course record with full syllabus arrays (objectives, outcomes, mapping, units, lessonPlan)
router.post('/', courseController.createCourse);

// Modify properties or arrays of an existing course record
router.put('/:id', courseController.updateCourse);

// Remove a course record from the collection completely
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
