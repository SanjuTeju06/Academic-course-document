import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

const SemesterView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading semester view...</div>;

  // Group by semester
  const semesterMap = courses.reduce((acc, course) => {
    if (!acc[course.semester]) acc[course.semester] = [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  const semesters = Object.keys(semesterMap).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="space-y-8">
      {semesters.map((sem) => (
        <div key={sem} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Semester {sem}</h2>
            <p className="text-sm text-slate-500">{semesterMap[sem].length} Courses</p>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {semesterMap[sem].map((course) => (
              <div key={course._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {course.courseCode.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{course.courseCode}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{course.courseTitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500 hidden md:inline-block">{course.credits} Credits</span>
                  <Link
                    to={`/courses/${course._id}`}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {semesters.length === 0 && (
        <div className="text-center py-12 text-slate-500">No courses available.</div>
      )}
    </div>
  );
};

export default SemesterView;
