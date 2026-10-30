/**
 * @file analyticsController.js
 * @description Controller for all analytics, metrics, deep course content analysis.
 * Includes CO analysis, assessment weight insights, branch comparisons,
 * Bloom's taxonomy breakdowns, and PO mapping strength queries.
 */

const Course = require('../models/Course');

/**
 * @route GET /api/analytics/semester-count
 */
exports.getSemesterCount = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $group: { _id: "$semester", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/po3-courses
 */
exports.getPO3Courses = async (req, res) => {
  try {
    const courses = await Course.find({ 'coPoMapping.mappings.PO3': { $gte: 1 } })
                                .select('courseCode courseTitle semester branch');
    res.json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/bloom/apply
 */
exports.getBloomApply = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $unwind: "$courseOutcomes" },
      { $match: { "courseOutcomes.bloomLevel": { $regex: /apply/i } } },
      { $group: { _id: "$courseCode", courseTitle: { $first: "$courseTitle" }, count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/unit-count
 */
exports.getUnitCount = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $project: { courseCode: 1, courseTitle: 1, unitCount: { $size: "$units" } } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/dashboard-stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const po3Count = await Course.countDocuments({ 'coPoMapping.mappings.PO3': { $gte: 1 } });
    
    const semStats = await Course.aggregate([
      { $group: { _id: "$semester", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const branchStats = await Course.aggregate([
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const difficultyStats = await Course.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUpdates = await Course.find()
      .sort({ updatedAt: -1 }).limit(5)
      .select('courseCode courseTitle branch updatedAt');

    res.json({ totalCourses, po3Count, semStats, branchStats, difficultyStats, recentUpdates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/bloom-distribution
 * @desc Full Bloom's taxonomy level distribution across all courses
 */
exports.getBloomDistribution = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $unwind: "$courseOutcomes" },
      { $group: { _id: "$courseOutcomes.bloomLevel", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/co-highest-marks
 * @desc Find COs with highest marks in quiz/test/assignment/SEE across all courses
 */
exports.getCoHighestMarks = async (req, res) => {
  try {
    const { type } = req.query; // quiz, test, assignment, see
    const field = type || 'quiz';
    const courses = await Course.find({ 'assessmentCoDistribution': { $exists: true, $ne: [] } })
      .select('courseCode courseTitle branch assessmentCoDistribution');
    
    const results = [];
    courses.forEach(c => {
      (c.assessmentCoDistribution || []).forEach(co => {
        if (co[field] > 0) {
          results.push({
            courseCode: c.courseCode,
            courseTitle: c.courseTitle,
            branch: c.branch,
            coId: co.coId,
            marks: co[field],
            totalMarks: co.totalMarks
          });
        }
      });
    });
    
    results.sort((a, b) => b.marks - a.marks);
    res.json(results.slice(0, 30));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/po-strength
 * @desc Find which PO has highest average mapping weight across all courses
 */
exports.getPoStrength = async (req, res) => {
  try {
    const courses = await Course.find().select('coPoMapping');
    const poKeys = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'];
    const poTotals = {};
    const poCounts = {};
    poKeys.forEach(k => { poTotals[k] = 0; poCounts[k] = 0; });

    courses.forEach(c => {
      (c.coPoMapping || []).forEach(m => {
        poKeys.forEach(k => {
          const v = m.mappings?.[k] || 0;
          if (v > 0) { poTotals[k] += v; poCounts[k]++; }
        });
      });
    });

    const result = poKeys.map(k => ({
      po: k,
      totalWeight: poTotals[k],
      mappedCOs: poCounts[k],
      avgWeight: poCounts[k] ? +(poTotals[k] / poCounts[k]).toFixed(2) : 0
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/branch-comparison
 * @desc Compare branches by avg credits, avg hours, difficulty distribution
 */
exports.getBranchComparison = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      { $group: {
        _id: "$branch",
        totalCourses: { $sum: 1 },
        avgCredits: { $avg: "$credits" },
        avgHours: { $avg: "$hours" },
        totalCredits: { $sum: "$credits" },
        courses: { $push: { code: "$courseCode", title: "$courseTitle", difficulty: "$difficulty" } }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route GET /api/analytics/search-content
 * @desc Search inside course content — unit topics, lesson plan topics, CO descriptions
 */
exports.searchCourseContent = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');
    const courses = await Course.find({
      $or: [
        { 'units.content': regex },
        { 'units.title': regex },
        { 'lessonPlan.topics': regex },
        { 'courseOutcomes.description': regex },
        { 'courseObjectives': regex }
      ]
    }).select('courseCode courseTitle branch semester units lessonPlan courseOutcomes courseObjectives');

    const results = courses.map(c => {
      const matches = [];
      (c.units || []).forEach(u => {
        if (regex.test(u.title)) matches.push({ type: 'Unit Title', text: u.title });
        (u.content || []).forEach(t => { if (regex.test(t)) matches.push({ type: 'Unit Topic', text: t }); });
      });
      (c.lessonPlan || []).forEach(lp => {
        if (regex.test(lp.topics)) matches.push({ type: 'Lesson Plan', text: `W${lp.weekNo}: ${lp.topics}` });
      });
      (c.courseOutcomes || []).forEach(co => {
        if (regex.test(co.description)) matches.push({ type: 'Course Outcome', text: `${co.coId}: ${co.description}` });
      });
      (c.courseObjectives || []).forEach(obj => {
        if (regex.test(obj)) matches.push({ type: 'Objective', text: obj });
      });
      return { courseCode: c.courseCode, courseTitle: c.courseTitle, branch: c.branch, semester: c.semester, matches };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
