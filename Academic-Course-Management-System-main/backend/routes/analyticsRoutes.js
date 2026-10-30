/**
 * @file analyticsRoutes.js
 * @description Routes for analytics, aggregation pipelines, and deep course content search.
 */

const express = require('express');
const router = express.Router();
const ac = require('../controllers/analyticsController');

router.get('/dashboard-stats', ac.getDashboardStats);
router.get('/semester-count', ac.getSemesterCount);
router.get('/po3-courses', ac.getPO3Courses);
router.get('/bloom/apply', ac.getBloomApply);
router.get('/bloom-distribution', ac.getBloomDistribution);
router.get('/unit-count', ac.getUnitCount);
router.get('/co-highest-marks', ac.getCoHighestMarks);
router.get('/po-strength', ac.getPoStrength);
router.get('/branch-comparison', ac.getBranchComparison);
router.get('/search-content', ac.searchCourseContent);

module.exports = router;
