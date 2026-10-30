/**
 * @file App.jsx
 * @description Main React frontend component. Configures react-router-dom,
 * wraps all routes with a responsive dark-themed global Layout,
 * and handles top-level routing mapping.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import CourseDetail from './pages/CourseDetail';
import AddCourse from './pages/AddCourse';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      {/* Global page wrapper containing custom animated background & floating header nav */}
      <Layout>
        <Routes>
          {/* Main landing discovery portal (SurviveMyDegree homepage) */}
          <Route path="/" element={<Home />} />

          {/* Admin panel managing direct list delete/operations */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Multi-step progressive registration wizard page */}
          <Route path="/admin/add" element={<AddCourse />} />

          {/* Dynamic multi-step edit wizard page */}
          <Route path="/admin/edit/:id" element={<AddCourse />} />

          {/* Academic details page with expandable accordion panels */}
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Analytics and deep course content analysis dashboard */}
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
