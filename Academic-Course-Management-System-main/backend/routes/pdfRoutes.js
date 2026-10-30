/**
 * @file pdfRoutes.js
 * @description Routes for triggering high-quality academic PDF document compilation and download.
 */

const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// Compiles and returns a beautifully structured multi-page PDF handbook for the given courseCode
router.get('/full/:courseCode', pdfController.getFullSyllabusPdf);

module.exports = router;
