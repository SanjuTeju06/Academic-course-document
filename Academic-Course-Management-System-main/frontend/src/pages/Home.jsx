/**
 * @file Home.jsx
 * @description Landing page / course exploration portal for "SurviveMyDegree" adapted to Light Theme.
 * Offers real-time search filtering, dynamic tab-selection for semesters 1-8,
 * automated quote-cycling, and animated subject discovery grids using Framer Motion.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertTriangle, Coffee, Clock } from 'lucide-react';

// Humorous quotes shown at top of the page
const quotes = [
  "Engineering: Turning coffee into assignments since forever.",
  "Sleep? Never heard of it.",
  "Your GPA and mental health cannot both survive.",
  "Internal marks are processing… panic initiated.",
  "Attendance below 75%. May God help you."
];

/**
 * @component SubjectCard
 * @description Small card display showing quick stats, funny descriptions,
 * code badges, credits, and interactive hover effects in light theme.
 */
const SubjectCard = ({ subject }) => {
  // Return different style combinations depending on course difficulty state
  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      case 'Medium': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'Hard': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'Nightmare': return 'text-red-600 border-red-200 bg-red-50 shadow-sm';
      default: return 'text-slate-500 border-slate-200 bg-slate-50';
    }
  };

  return (
    <Link to={`/courses/${subject._id}`}>
      {/* framer-motion container animate on hover */}
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        className="glass-card rounded-2xl p-6 glow-hover transition-all duration-300 relative overflow-hidden group h-full cursor-pointer bg-white border border-slate-200 shadow-sm"
      >
        {/* Header containing Code and Difficulty badges */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="text-xs font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200/60">
            {subject.courseCode}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getDifficultyColor(subject.difficulty || 'Medium')}`}>
            {subject.difficulty || 'Medium'}
          </span>
        </div>
        
        {/* Subject title */}
        <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10 group-hover:text-primary transition-colors">
          {subject.courseTitle}
        </h3>
        
        {/* Witty joke description */}
        <p className="text-sm text-slate-600 italic mb-4 relative z-10 line-clamp-2">
          "{subject.funny_description || 'Surviving engineering one day at a time.'}"
        </p>
        
        {/* Card Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 relative z-10">
          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {subject.credits} Credits</span>
          <span className="text-primary font-bold flex items-center group-hover:text-accent transition-colors">
            View Details →
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [activeSem, setActiveSem] = useState('All');
  const [activeBranch, setActiveBranch] = useState('CS');
  const [quote, setQuote] = useState(quotes[0]);

  // Handle live queries from backend database with 300ms debounce
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const branchParam = activeBranch !== 'All' ? `&branch=${activeBranch}` : '';
        const res = await axios.get(`http://localhost:5000/api/courses?search=${search}${branchParam}`);
        setSubjects(res.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    const timer = setTimeout(fetchSubjects, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line
  }, [search, activeBranch]);

  // Rotates high-spirited quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter local results based on active tab select
  const filteredSubjects = activeSem === 'All' 
    ? subjects 
    : subjects.filter(s => s.semester === activeSem);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-12">
      {/* ─── Hero Heading Panel ─── */}
      <section className="text-center pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary mb-4 tracking-tight">
            SurviveMyDegree
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-6">
            The ultimate survival guide to engineering semesters.
          </p>
          
          {/* Quote Container featuring smooth transition animations */}
          <div className="glass-card inline-block p-4 rounded-xl border border-slate-200 bg-white max-w-lg mx-auto shadow-sm">
            <div className="flex items-center text-primary font-bold text-sm">
              <Coffee className="w-4 h-4 mr-2 animate-pulse text-secondary" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={quote}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="italic"
                >
                  {quote}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Filter controls (Sticky on scroll) ─── */}
      {/* ─── Branch Selector Tabs ─── */}
      <section className="flex justify-center">
        <div className="glass-card p-1.5 rounded-2xl flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm">
          {[
            { key: 'CS', label: 'Computer Science', color: 'from-blue-500 to-indigo-600' },
            { key: 'IS', label: 'Information Science', color: 'from-emerald-500 to-teal-600' },
            { key: 'EC', label: 'Electronics & Comm', color: 'from-orange-500 to-red-500' },
            { key: 'EEE', label: 'Electrical & Electronics', color: 'from-amber-500 to-yellow-600' },
            { key: 'All', label: 'All Branches', color: 'from-slate-600 to-slate-800' },
          ].map(b => (
            <button
              key={b.key}
              onClick={() => setActiveBranch(b.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeBranch === b.key
                  ? `bg-gradient-to-r ${b.color} text-white shadow-md`
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {b.key === 'All' ? '🌐 All' : b.key}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Filter controls (Sticky on scroll) ─── */}
      <section className="sticky top-24 z-40 glass-card p-3.5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between bg-white/95 border border-slate-200 shadow-sm">
        {/* Live-Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search subjects (e.g. Mathematics)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>
        
        {/* Semester Tab Scroller */}
        <div className="flex space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveSem('All')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${activeSem === 'All' ? 'bg-primary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            All Semesters
          </button>
          {semesters.map(sem => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all text-xs font-bold ${activeSem === sem ? 'bg-secondary text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Subjects Section Grid ─── */}
      <section>
        {activeSem === 'All' ? (
          semesters.map(sem => {
            const semSubjects = filteredSubjects.filter(s => s.semester === sem);
            if (semSubjects.length === 0) return null;
            return (
              <div key={sem} className="mb-10">
                <h2 className="text-2xl font-bold mb-5 text-slate-800 flex items-center">
                  <span className="text-slate-800 mr-3">
                    Semester {sem}
                  </span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {semSubjects.map(subject => (
                    <SubjectCard key={subject._id} subject={subject} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(subject => (
                <SubjectCard key={subject._id} subject={subject} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                No subjects found. Maybe you graduated?
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
