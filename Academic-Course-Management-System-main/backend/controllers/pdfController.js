/**
 * @file pdfController.js
 * @description Controller that routes dynamic PDF synthesis requests. 
 * Locates the target course by its courseCode and delegates construction to pdfGenerator.
 */

const Course = require('../models/Course');
const pdfGenerator = require('../utils/pdfGenerator');

/**
 * @route GET /api/pdf/full/:courseCode
 * @desc Retrieves course metadata, validates existence, and outputs a downloadable PDF stream.
 * @access Public
 */
exports.getFullSyllabusPdf = async (req, res) => {
  try {
    // Find the requested course by its unique alpha-numeric code
    const course = await Course.findOne({ courseCode: req.params.courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Requested syllabus course not found' });
    }
    
    // Pipe the dynamically compiled PDFKit document directly into the Express HTTP response stream
    pdfGenerator.generateCoursePdf(course, res);
  } catch (error) {
    res.status(500).json({ message: 'Error compiling course syllabus PDF: ' + error.message });
  }
};
