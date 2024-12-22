// pages/courses.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch courses from the database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data); // Initialize filtered courses with all courses
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

  const handleSearch = () => {
    // Filter courses based on the search term
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
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

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses..."
          className="flex-1 border border-gray-300 py-2 px-4 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white py-2 px-6 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <p className="text-gray-600 mt-2">{course.courseId}</p>
            <p className="text-gray-600 mt-2">Instructor: {course.instructorName}</p>

            <button
              onClick={() => handleCourseDetails(course._id)}
              className="mt-4 bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}