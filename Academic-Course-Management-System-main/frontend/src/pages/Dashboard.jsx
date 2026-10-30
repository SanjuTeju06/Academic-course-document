import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book, Layers, BarChart, Clock } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    po3Count: 0,
    semStats: [],
    recentUpdates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  const chartData = stats.semStats.map(stat => ({
    name: `Sem ${stat._id}`,
    courses: stat.count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Courses</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.totalCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Book className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Mapped to PO3</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.po3Count}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Semesters Active</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.semStats.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Recent Updates</p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.recentUpdates.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Courses per Semester</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="courses" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recently Updated Syllabi</h3>
          <div className="space-y-4">
            {stats.recentUpdates.map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{course.courseCode}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{course.courseTitle}</p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {stats.recentUpdates.length === 0 && (
              <p className="text-slate-500 text-center py-4">No recent updates.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
