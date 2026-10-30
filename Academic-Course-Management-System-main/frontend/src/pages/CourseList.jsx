import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, FileText, Download } from 'lucide-react';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses?search=${search}`);
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                    Sem {course.semester}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {course.credits} Credits
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">
                  {course.courseCode}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium line-clamp-2 h-12">
                  {course.courseTitle}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex items-center text-sm font-medium text-primary hover:text-blue-700 dark:text-secondary dark:hover:text-blue-400"
                  >
                    <FileText className="w-4 h-4 mr-1" /> View Details
                  </Link>
                  <a
                    href={`http://localhost:5000/api/pdf/full/${course.courseCode}`}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                    title="Download Syllabus PDF"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No courses found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
