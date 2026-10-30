/**
 * @file subjectRoutes.js
 * @description Routes for legacy Subject collection CRUD workflows.
 * Retained for backwards compatibility.
 */

const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// Retrieve legacy subjects list
router.get('/', subjectController.getAllSubjects);

// Retrieve legacy subject by ID
router.get('/:id', subjectController.getSubjectById);

// Insert a legacy subject record
router.post('/', subjectController.createSubject);

// Modify a legacy subject record
router.put('/:id', subjectController.updateSubject);

// Delete a legacy subject record
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
