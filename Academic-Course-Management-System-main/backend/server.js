/**
 * ============================================================
 *  server.js  —  Application Entry Point
 * ============================================================
 *
 *  This file bootstraps the Express.js server for the
 *  "Academic Course Repository / SurviveMyDegree" project.
 *
 *  Responsibilities:
 *    1. Load environment variables from .env
 *    2. Create and configure the Express application
 *       - Enable CORS so the React frontend (port 5173) can
 *         call the API (port 5000) without browser errors
 *       - Parse incoming JSON request bodies
 *    3. Mount the three main API route groups:
 *       /api/courses   – CRUD for course/syllabus documents
 *       /api/analytics – MongoDB aggregation statistics
 *       /api/pdf       – Professional PDF generation
 *    4. Connect to MongoDB via Mongoose, then start listening
 *       on the configured PORT (default 5000)
 * ============================================================
 */

require('dotenv').config(); // Load MONGO_URI, PORT, JWT_SECRET from .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Cross-Origin Resource Sharing

// ── Route modules ──────────────────────────────────────────────
const courseRoutes    = require('./routes/courseRoutes');    // /api/courses
const analyticsRoutes = require('./routes/analyticsRoutes'); // /api/analytics
const pdfRoutes       = require('./routes/pdfRoutes');       // /api/pdf

// ── App setup ──────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000; // Fallback to 5000 if not in .env

// Allow requests from any origin (important for Vite dev server)
app.use(cors());

// Parse JSON bodies in POST/PUT requests
app.use(express.json());

// ── Mount routes ───────────────────────────────────────────────
app.use('/api/courses',   courseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pdf',       pdfRoutes);

// Health-check root route
app.get('/', (req, res) => {
  res.send('Academic Course Repository API is running...');
});

// ── Database connection → Start server ─────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // If MongoDB is unreachable, log the error and exit
    console.error('Failed to connect to MongoDB', err);
  });
