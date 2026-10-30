/**
 * @file CourseDetail.jsx
 * @description Dynamic page displaying single-course academic syllabus details in premium light theme.
 * Contains dual views:
 * 1. "Survival Mode" (Simple, clean, extremely user friendly view focused on units and basic books).
 * 2. "Academic Mode" (Complete technical tables for CO-PO, Lesson Plans, and Bloom levels).
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, ChevronLeft, BookOpen, Target, LayoutGrid, Calendar, Table, Sparkles, BookOpenCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @component Section
 * @description Collapsible accordion module featuring smooth height and opacity
 * animation toggles for complex content lists.
 */
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden mb-6 border border-slate-200 bg-white shadow-sm"
    >
      {/* Header Button Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center text-lg font-bold text-slate-800">
          <Icon className="w-5 h-5 mr-3 text-secondary" />
          {title}
        </div>
        <div className="text-secondary font-bold text-lg">{isOpen ? '−' : '+'}</div>
      </button>

      {/* Collapsible Content with Framer Motion Height Transition */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CourseDetail = () => {
  const { id } = useParams(); // Retrieves course MongoDB document Object ID from route parameters
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('survival'); // 'survival' (simple) or 'academic' (detailed)

  // Load single course details from backend Express API upon initial component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-xl text-secondary animate-pulse font-bold">Loading survival details...</div>;
  if (!course) return <div className="p-12 text-center text-red-500 font-bold text-xl">Course not found. Maybe you dropped it?</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ─── Header Card ─── */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden shadow-sm">
        
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 text-sm transition-colors mb-6 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Survival List
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">
                {course.courseCode}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                Semester {course.semester}
              </span>
              {course.branch && (
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${course.branch === 'CS' ? 'bg-blue-50 text-blue-600 border-blue-200' : course.branch === 'IS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : course.branch === 'EC' ? 'bg-orange-50 text-orange-600 border-orange-200' : course.branch === 'EEE' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {course.branch}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">{course.courseTitle}</h1>
            <p className="text-lg text-slate-600 italic">"{course.funny_description || 'Surviving engineering one day at a time.'}"</p>
          </div>
          
          {/* Direct download handler routed to backend PDF Kit renderer */}
          <a
            href={`http://localhost:5000/api/pdf/full/${course.courseCode}`}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white font-bold rounded-xl shadow-sm transition-all text-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" /> Download Syllabus PDF
          </a>
        </div>
        
        {/* Course Core Stat Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-150 relative z-10">
          <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-0.5">Credits</p>
            <p className="text-xl font-bold text-slate-800">{course.credits}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-0.5">Hours</p>
            <p className="text-xl font-bold text-slate-800">{course.hours}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-0.5">Difficulty</p>
            <p className="text-lg font-bold text-accent">{course.difficulty || 'Medium'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl text-center border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-0.5">Assessment</p>
            <p className="text-sm font-bold text-slate-800 truncate">{course.assessment?.map(a => a.type).join(' + ') || 'CIE + SEE'}</p>
          </div>
        </div>
      </div>

      {/* ─── Simple View / Detailed View Mode Switcher ─── */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode('survival')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'survival' ? 'bg-secondary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles className="w-4 h-4" /> Simple Survival Guide
          </button>
          <button
            onClick={() => setViewMode('academic')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'academic' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpenCheck className="w-4 h-4" /> Academic Syllabus Details
          </button>
        </div>
      </div>

      {/* ─── Dual-Mode Dynamic Panels ─── */}
      <div className="grid grid-cols-1 gap-6">

        {viewMode === 'survival' ? (
          // ─── SURVIVAL MODE (Simple, clean, and highly user-friendly) ───
          <>
            {/* Quick Survival Checklist / Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-secondary/20 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-secondary mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Back-to-Basics Summary
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                This course is rated <strong className="text-accent font-bold">{course.difficulty}</strong>. Here is the simplified breakdown of what you actually need to learn to clear the exams without losing sleep.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-500 block mb-0.5">Target Hours Needed</span>
                  <span className="text-base font-bold text-slate-800">{course.hours} Hours of study prep</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-500 block mb-0.5">Exams Weights</span>
                  <span className="text-base font-bold text-slate-800">CIE: 50%  |  SEE: 50%</span>
                </div>
              </div>
            </motion.div>

            {/* Simplified units list */}
            <Section title="What you'll study (Syllabus Units)" icon={LayoutGrid}>
              <div className="space-y-4">
                {course.units?.map((unit, idx) => (
                  <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200/55 hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-base font-bold text-slate-800">
                        <span className="text-secondary mr-2">Unit {idx + 1}:</span> {unit.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                        {unit.hours} Hours
                      </span>
                    </div>
                    {/* Simplified tag bubble container */}
                    <div className="flex flex-wrap gap-1.5">
                      {unit.content?.map((item, i) => (
                        <span key={i} className="bg-white text-slate-700 px-3 py-1 rounded-lg text-xs border border-slate-200/80 shadow-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Quick clean textbooks card list */}
            <Section title="Required Books (Materials)" icon={BookOpen}>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Textbooks list */}
                {course.textbooks?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-secondary text-sm flex items-center gap-1">📚 Core Textbook</h4>
                    {course.textbooks.map((tb, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="font-bold text-slate-800 text-sm">{tb.title}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{tb.author} • {tb.publisher}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reference list */}
                {course.references?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary text-sm flex items-center gap-1">📖 Reference Guide</h4>
                    {course.references.map((ref, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="font-bold text-slate-800 text-sm">{ref.title}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{ref.author} • {ref.publisher}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          </>
        ) : (
          // ─── ACADEMIC MODE (Formal formatted University specifications and matrix tables) ───
          <>
            {/* Objectives and Course Outcomes list */}
            <Section title="Course Objectives & Course Outcomes (COs)" icon={Target}>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Academic Objectives</h4>
                  <ul className="space-y-2">
                    {course.courseObjectives?.map((obj, i) => (
                      <li key={i} className="flex items-start text-slate-700 text-sm">
                        <span className="text-primary mr-3 font-bold">•</span> {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Course Outcomes Mapping</h4>
                  <div className="grid gap-3">
                    {course.courseOutcomes?.map((co) => (
                      <div key={co.coId} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center text-sm">
                          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold mr-3">{co.coId}</span>
                          <span className="text-slate-700 font-medium">{co.description}</span>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 self-start sm:self-auto whitespace-nowrap font-bold">
                          {co.bloomLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* CO-PO Grid Map matrix */}
            {course.coPoMapping?.length > 0 && (
              <Section title="CO-PO Weight Matrix Map" icon={Table} defaultOpen={true}>
                <p className="text-xs text-slate-500 mb-3 font-medium">Scale: 3 = High, 2 = Medium, 1 = Low, — = Not Mapped</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2 text-left text-slate-700 border border-slate-200">CO</th>
                        {['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'].map(po=>(
                          <th key={po} className="p-2 text-center text-slate-700 border border-slate-200">{po}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {course.coPoMapping.map((row,i)=>(
                        <tr key={i} className={i%2===0?'bg-white':'bg-slate-50/50'}>
                          <td className="p-2 font-bold text-secondary border border-slate-200">{row.coId}</td>
                          {['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12','PSO1','PSO2'].map(po=>(
                            <td key={po} className="p-2 text-center border border-slate-200">
                              <span className={`font-bold ${row.mappings?.[po]===3?'text-emerald-600':row.mappings?.[po]===2?'text-amber-500':row.mappings?.[po]===1?'text-orange-500':'text-slate-300'}`}>
                                {row.mappings?.[po] || '—'}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Lesson Plan chronological schedule */}
            {course.lessonPlan?.length > 0 && (
              <Section title="Detailed Lecture Lesson Plan" icon={Calendar} defaultOpen={true}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        {['Week','Lecture','Topics','COs Mapped','Method','Hours'].map(h=>(
                          <th key={h} className="p-2 text-left text-slate-700 border border-slate-200">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {course.lessonPlan.map((lp,i)=>(
                        <tr key={i} className={i%2===0?'bg-white':'bg-slate-50/50'}>
                          <td className="p-2 text-center font-bold text-primary border border-slate-200">{lp.weekNo}</td>
                          <td className="p-2 text-slate-600 border border-slate-200">{lp.lectureNo}</td>
                          <td className="p-2 text-slate-800 border border-slate-200 font-medium">{lp.topics}</td>
                          <td className="p-2 border border-slate-200">
                            {(lp.cosMapped||[]).map(co=>(
                              <span key={co} className="inline-block bg-sky-50 text-primary text-xs px-1.5 py-0.5 rounded mr-1 border border-sky-100 font-bold">{co}</span>
                            ))}
                          </td>
                          <td className="p-2 text-slate-600 border border-slate-200">{lp.teachingMethod}</td>
                          <td className="p-2 text-center text-slate-500 border border-slate-200 font-bold">{lp.durationHours}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Assessment, Attainment and Grading Scheme Details */}
            <Section title="Assessment Scheme & Grading System" icon={BookOpen} defaultOpen={true}>
              <div className="space-y-8">
                {/* 3.1 Assessment weight Distribution */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider text-primary border-b pb-2">3.1 Assessment Weight Distribution</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="p-2.5 border-r border-slate-200 text-left">Weights/ Course Outcomes</th>
                          <th className="p-2.5 border-r border-slate-200 text-center">Quiz</th>
                          <th className="p-2.5 border-r border-slate-200 text-center">Test</th>
                          <th className="p-2.5 border-r border-slate-200 text-center">Assignment/PBL/PrBL</th>
                          <th className="p-2.5 border-r border-slate-200 text-center">SEE</th>
                          <th className="p-2.5 text-center">Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Top Weights Row */}
                        <tr className="bg-primary/5 border-b border-slate-200 font-extrabold text-primary">
                          <td className="p-2.5 border-r border-slate-200">Weights</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">{course.assessmentWeights?.quiz ?? 15}</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">{course.assessmentWeights?.test ?? 25}</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">{course.assessmentWeights?.assignment ?? 20}</td>
                          <td className="p-2.5 border-r border-slate-200 text-center">{course.assessmentWeights?.see ?? 40}</td>
                          <td className="p-2.5 text-center">{course.assessmentWeights?.total ?? 100}</td>
                        </tr>
                        {/* CO Breakdown Rows */}
                        {(course.assessmentCoDistribution || [
                          { coId: 'CO1', quiz: 10, test: 0, assignment: 0, see: 8, totalMarks: 18 },
                          { coId: 'CO2', quiz: 5, test: 9, assignment: 0, see: 12, totalMarks: 26 },
                          { coId: 'CO3', quiz: 0, test: 8, assignment: 0, see: 10, totalMarks: 18 },
                          { coId: 'CO4', quiz: 0, test: 8, assignment: 0, see: 6, totalMarks: 14 },
                          { coId: 'CO5', quiz: 0, test: 0, assignment: 10, see: 4, totalMarks: 14 },
                          { coId: 'CO6', quiz: 0, test: 0, assignment: 10, see: 0, totalMarks: 10 }
                        ]).map((co, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800">{co.coId}</td>
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-600">{co.quiz || ''}</td>
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-600">{co.test || ''}</td>
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-600">{co.assignment || ''}</td>
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-600">{co.see || ''}</td>
                            <td className="p-2.5 text-center font-bold text-slate-700">{co.totalMarks || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3.2 Schedule of Assessment */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider text-secondary border-b pb-2">3.2 Schedule of Assessment</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="p-2.5 border-r border-slate-200 text-left">Assessment Type</th>
                          <th className="p-2.5 border-r border-slate-200 text-left">Dates</th>
                          <th className="p-2.5 border-r border-slate-200 text-center">Marks</th>
                          <th className="p-2.5 border-r border-slate-200 text-left">COs</th>
                          <th className="p-2.5 text-left">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(course.assessmentSchedule || [
                          { assessmentType: 'Quiz-1', date: '5th week', marks: 5, cos: 'CO1', duration: '30 min' },
                          { assessmentType: 'Quiz-2', date: '10th week', marks: 5, cos: 'CO2', duration: '30 min' },
                          { assessmentType: 'Quiz-3', date: '15th week', marks: 5, cos: 'CO1', duration: '30 min' },
                          { assessmentType: 'Test-1', date: '5th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
                          { assessmentType: 'Test-2', date: '10th week', marks: 10, cos: 'CO2, CO3, CO4', duration: '60 min' },
                          { assessmentType: 'Test-3', date: '15th week', marks: 5, cos: 'CO2, CO3, CO4', duration: '60 min' },
                          { assessmentType: 'Assignment-1', date: '7th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
                          { assessmentType: 'Assignment-2', date: '14th week', marks: 10, cos: 'CO5, CO6', duration: '6 weeks' },
                          { assessmentType: 'SEE', date: '18th week', marks: 40, cos: 'CO1 - CO5', duration: '3 hours' }
                        ]).map((sch, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-2.5 border-r border-slate-200 font-bold text-primary">{sch.assessmentType}</td>
                            <td className="p-2.5 border-r border-slate-200 text-slate-700">{sch.date}</td>
                            <td className="p-2.5 border-r border-slate-200 text-center font-semibold text-slate-800">{sch.marks}</td>
                            <td className="p-2.5 border-r border-slate-200 text-slate-700 font-medium whitespace-pre-line">{sch.cos}</td>
                            <td className="p-2.5 text-slate-600">{sch.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3.3 Grading Criterion */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-accent border-b pb-2">3.3 Grading Criterion & Attainment</h4>
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase">Grading Criteria / Rules</h5>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm whitespace-pre-line">
                      {course.gradingScheme || '91 and above: O (outstanding); 81-90: A+ (Excellent); 71-80: A (Very Good); 61-70: B+ (Good); 51-60: B (Above Average); 40-50: C (Average); below 40: D (Not satisfactory). If one scores D grade, required to re-register.'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase">Attainment Targets</h5>
                    <p className="text-sm text-slate-800 font-semibold bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      {course.attainmentTargets || '80% of students scoring > 60%'}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
