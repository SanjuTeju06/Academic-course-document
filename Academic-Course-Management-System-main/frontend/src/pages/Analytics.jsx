/**
 * @file Analytics.jsx
 * @description Premium analytics dashboard with deep course content analysis.
 * Features: Bloom's distribution, CO marks finder, PO strength heatmap,
 * branch comparison, deep content search, and assessment insights.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Search, TrendingUp, Target, BookOpen, Layers, GraduationCap, Zap, Trophy, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
const API = 'http://localhost:5000/api/analytics';

const Card = ({ title, icon: Icon, children, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
      <Icon className="w-4.5 h-4.5 text-primary" />
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </motion.div>
);

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [bloomDist, setBloomDist] = useState([]);
  const [poStrength, setPoStrength] = useState([]);
  const [branchComp, setBranchComp] = useState([]);
  const [coResults, setCoResults] = useState([]);
  const [coType, setCoType] = useState('quiz');
  const [contentQuery, setContentQuery] = useState('');
  const [contentResults, setContentResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, bloomRes, poRes, branchRes, coRes] = await Promise.all([
          axios.get(`${API}/dashboard-stats`),
          axios.get(`${API}/bloom-distribution`),
          axios.get(`${API}/po-strength`),
          axios.get(`${API}/branch-comparison`),
          axios.get(`${API}/co-highest-marks?type=${coType}`)
        ]);
        setDashboard(dashRes.data);
        setBloomDist(bloomRes.data.map(d => ({ name: d._id || 'Unknown', value: d.count })));
        setPoStrength(poRes.data);
        setBranchComp(branchRes.data);
        setCoResults(coRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [coType]);

  const handleContentSearch = async () => {
    if (!contentQuery.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(`${API}/search-content?q=${encodeURIComponent(contentQuery)}`);
      setContentResults(res.data);
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  };

  const reloadCoMarks = async (type) => {
    setCoType(type);
    try {
      const res = await axios.get(`${API}/co-highest-marks?type=${type}`);
      setCoResults(res.data);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-12 text-center text-xl text-primary animate-pulse font-bold">Loading analytics engine...</div>;

  const branchColors = { CS: '#3b82f6', IS: '#10b981', EC: '#f97316', EEE: '#f59e0b' };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary tracking-tight mb-2">
          Course Analytics & Insights
        </h1>
        <p className="text-slate-500 font-medium text-sm">Deep analysis of course content, COs, PO mappings, and assessment patterns</p>
      </div>

      {/* ── Quick Stats Row ── */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Courses', value: dashboard.totalCourses, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
            { label: 'Branches', value: dashboard.branchStats?.length || 0, icon: Layers, color: 'from-emerald-500 to-teal-600' },
            { label: 'PO3 Mapped', value: dashboard.po3Count, icon: Target, color: 'from-orange-500 to-red-500' },
            { label: 'Semesters', value: dashboard.semStats?.length || 0, icon: GraduationCap, color: 'from-violet-500 to-purple-600' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10 -translate-y-4 translate-x-4`} />
              <s.icon className="w-5 h-5 text-slate-400 mb-2" />
              <p className="text-3xl font-extrabold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 font-bold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Row 1: Bloom's + Branch Comparison ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bloom's Taxonomy Distribution" icon={Zap}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bloomDist} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {bloomDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">Distribution of CO Bloom levels across all courses</p>
        </Card>

        <Card title="Branch Comparison" icon={BarChart3}>
          {branchComp.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchComp.map(b => ({ name: b._id, courses: b.totalCourses, avgCredits: +b.avgCredits.toFixed(1) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)', fontSize: '12px' }} />
                    <Bar dataKey="courses" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Courses" />
                    <Bar dataKey="avgCredits" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Credits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {branchComp.map(b => (
                  <div key={b._id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-center">
                    <span className="text-lg font-extrabold" style={{ color: branchColors[b._id] || '#64748b' }}>{b._id}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{b.totalCourses} courses · {b.totalCredits} total credits</p>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-slate-400 text-sm">No branch data available.</p>}
        </Card>
      </div>

      {/* ── Row 2: PO Strength Radar ── */}
      <Card title="Program Outcome (PO) Mapping Strength" icon={Target}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={poStrength.map(p => ({ po: p.po, weight: p.totalWeight, avg: p.avgWeight }))}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="po" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar name="Total Weight" dataKey="weight" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Avg Weight" dataKey="avg" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)', fontSize: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-y-auto max-h-80">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-2 text-left border border-slate-200">PO</th>
                  <th className="p-2 text-center border border-slate-200">Total Weight</th>
                  <th className="p-2 text-center border border-slate-200">Mapped COs</th>
                  <th className="p-2 text-center border border-slate-200">Avg Weight</th>
                </tr>
              </thead>
              <tbody>
                {poStrength.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-200 font-bold text-primary">{p.po}</td>
                    <td className="p-2 border border-slate-200 text-center font-semibold">{p.totalWeight}</td>
                    <td className="p-2 border border-slate-200 text-center">{p.mappedCOs}</td>
                    <td className="p-2 border border-slate-200 text-center">
                      <span className={`font-bold ${p.avgWeight >= 2.5 ? 'text-emerald-600' : p.avgWeight >= 1.5 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {p.avgWeight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* ── Row 3: CO Highest Marks Finder ── */}
      <Card title="CO Assessment Marks Finder" icon={Trophy}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Find highest COs in:</span>
            {[['quiz','Quiz'],['test','Test'],['assignment','Assignment'],['see','SEE']].map(([k,l]) => (
              <button key={k} onClick={() => reloadCoMarks(k)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${coType === k ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'}`}>
                {l}
              </button>
            ))}
          </div>
          {coResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="p-2.5 text-left border border-slate-200">#</th>
                    <th className="p-2.5 text-left border border-slate-200">Course</th>
                    <th className="p-2.5 text-left border border-slate-200">Branch</th>
                    <th className="p-2.5 text-center border border-slate-200">CO</th>
                    <th className="p-2.5 text-center border border-slate-200">{coType.charAt(0).toUpperCase() + coType.slice(1)} Marks</th>
                    <th className="p-2.5 text-center border border-slate-200">Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {coResults.map((r, i) => (
                    <tr key={i} className={`hover:bg-slate-50 ${i === 0 ? 'bg-amber-50/50' : ''}`}>
                      <td className="p-2.5 border border-slate-200 font-bold text-slate-400">{i + 1}</td>
                      <td className="p-2.5 border border-slate-200">
                        <span className="font-bold text-primary">{r.courseCode}</span>
                        <span className="text-slate-500 ml-2">{r.courseTitle}</span>
                      </td>
                      <td className="p-2.5 border border-slate-200">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${r.branch === 'CS' ? 'bg-blue-50 text-blue-600 border-blue-200' : r.branch === 'IS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : r.branch === 'EC' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          {r.branch}
                        </span>
                      </td>
                      <td className="p-2.5 border border-slate-200 text-center font-bold text-secondary">{r.coId}</td>
                      <td className="p-2.5 border border-slate-200 text-center font-extrabold text-slate-800">
                        {i === 0 && '🏆 '}{r.marks}
                      </td>
                      <td className="p-2.5 border border-slate-200 text-center text-slate-600">{r.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-sm py-4 text-center">No CO data found for {coType}. Courses may not have assessment distribution configured.</p>
          )}
        </div>
      </Card>

      {/* ── Row 4: Deep Content Search ── */}
      <Card title="Deep Course Content Search" icon={Search}>
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Search inside unit topics, lesson plans, course outcomes, and objectives across all courses.</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text" placeholder="e.g. Algorithm, Machine Learning, Fourier, Database..."
                value={contentQuery} onChange={e => setContentQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleContentSearch()}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
            <button onClick={handleContentSearch} disabled={searching}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl text-sm hover:opacity-95 shadow-sm disabled:opacity-50">
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {contentResults.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contentResults.map((cr, i) => (
                <div key={i} className="bg-slate-50 rounded-xl border border-slate-200/60 p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{cr.courseCode}</span>
                    <span className="text-sm font-bold text-slate-800">{cr.courseTitle}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cr.branch === 'CS' ? 'bg-blue-50 text-blue-600 border-blue-200' : cr.branch === 'IS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : cr.branch === 'EC' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {cr.branch}
                    </span>
                    <span className="text-xs text-slate-400">Sem {cr.semester}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cr.matches.map((m, j) => (
                      <span key={j} className="inline-flex items-center gap-1 bg-white text-slate-700 px-2.5 py-1 rounded-lg text-xs border border-slate-200 shadow-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.type === 'Unit Topic' ? 'bg-blue-500' : m.type === 'Lesson Plan' ? 'bg-emerald-500' : m.type === 'Course Outcome' ? 'bg-violet-500' : 'bg-amber-500'}`} />
                        <span className="font-bold text-slate-500 mr-1">{m.type}:</span>
                        {m.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {contentResults.length === 0 && contentQuery && !searching && (
            <p className="text-slate-400 text-sm text-center py-4">No matches found for "{contentQuery}". Try a broader search term.</p>
          )}
        </div>
      </Card>

      {/* ── Row 5: Recent Updates + Branch Stats ── */}
      {dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recently Updated Courses" icon={TrendingUp}>
            <div className="space-y-2">
              {(dashboard.recentUpdates || []).map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="font-bold text-primary text-sm">{c.courseCode}</span>
                    <span className="text-slate-600 text-sm ml-2">{c.courseTitle}</span>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(c.updatedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Difficulty Distribution" icon={Filter}>
            {dashboard.difficultyStats && (
              <div className="space-y-3">
                {dashboard.difficultyStats.map((d, i) => {
                  const total = dashboard.totalCourses;
                  const pct = total ? ((d.count / total) * 100).toFixed(0) : 0;
                  const color = d._id === 'Easy' ? '#10b981' : d._id === 'Medium' ? '#f59e0b' : d._id === 'Hard' ? '#f97316' : d._id === 'Nightmare' ? '#ef4444' : '#94a3b8';
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold" style={{ color }}>{d._id || 'Unknown'}</span>
                        <span className="text-slate-500">{d.count} courses ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
