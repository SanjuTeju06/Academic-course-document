/**
 * @file AdminPanel.jsx
 * @description Admin panel dashboard layout adapted for Light Theme.
 * Focuses purely on showcasing a clean, structured list of all registered subjects in the database.
 * Removed the basic inline adding/editing template form.
 * Clicking the "Edit" action now redirects users to the advanced 6-step registration wizard (/admin/edit/:id)
 * so that they can modify all academic course outcomes, lesson plans, books, and metrics in full context!
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit, PlusCircle, Search } from 'lucide-react';

const AdminPanel = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch all registered courses on page load
  useEffect(() => {
    fetchSubjects();
  }, [search]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses?search=${search}`);
      setSubjects(res.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Immediate delete document operation
  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete ${code}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* ─── Header Info & Wizard entry point link ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-1 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">Review, register, or edit academic course functions.</p>
        </div>
        <Link to="/admin/add" className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold rounded-xl shadow-sm transition-all text-sm self-start md:self-auto">
          <PlusCircle className="w-5 h-5 mr-2" /> Register New Course (Wizard)
        </Link>
      </div>

      {/* ─── Filter & Search Control Panel ─── */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search code or subject name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
        <div className="text-slate-400 text-xs font-bold">
          Total Registered: <span className="text-slate-800 text-sm font-extrabold">{subjects.length}</span>
        </div>
      </div>

      {/* ─── Existing Course Database Listings Table ─── */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Subject Inventory</h2>
        {loading ? (
          <p className="text-center text-slate-500 py-12 animate-pulse font-medium">Loading subjects database...</p>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg font-medium mb-3">No registered subjects found.</p>
            <Link to="/admin/add" className="inline-flex items-center text-primary font-bold hover:underline">
              Add your first subject now →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/55 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Sem</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Hours</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => (
                  <tr key={sub._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="py-3.5 px-4 text-slate-500 font-bold">{sub.semester}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2 py-0.5 font-bold rounded-full border ${sub.branch === 'CS' ? 'bg-blue-50 text-blue-600 border-blue-200' : sub.branch === 'IS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : sub.branch === 'EC' ? 'bg-orange-50 text-orange-600 border-orange-200' : sub.branch === 'EEE' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {sub.branch || 'CS'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-primary font-extrabold">{sub.courseCode}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{sub.courseTitle}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{sub.credits} cr</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{sub.hours}h</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-0.5 font-bold rounded-full border ${sub.difficulty === 'Nightmare' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {sub.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {/* Clicking edit redirects to complete 6-step edit wizard mapping with :id parameter */}
                      <button 
                        onClick={() => navigate(`/admin/edit/${sub._id}`)} 
                        title="Edit course functions"
                        className="text-slate-400 hover:text-secondary p-2 transition-colors inline-block"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(sub._id, sub.courseCode)} 
                        title="Delete course record"
                        className="text-slate-400 hover:text-red-500 p-2 transition-colors inline-block"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
