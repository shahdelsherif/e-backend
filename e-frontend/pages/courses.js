// pages/courses.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:4006/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching courses.');
      }
    };

    fetchCourses();
  }, []);

  const handleCourseDetails = (courseId) => {
    // Navigate to a detailed page for the course
    router.push(`/courseDetails/${courseId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (courses.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <p className="text-gray-600 mt-2">{course.courseId}</p>
            <p className="text-gray-600 mt-2">Instructor : {course.instructorName}</p>

            <button
              onClick={() => router.push('/viewcoursesdetails')}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
