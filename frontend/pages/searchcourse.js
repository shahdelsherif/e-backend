import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchAndUpdateCourse() {
  const [searchId, setSearchId] = useState(''); // ID to search for the course
  const [course, setCourse] = useState({
    title: '',
    description: '',
    instructorId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isCourseFound, setIsCourseFound] = useState(false);
  const router = useRouter();

  // Handles input change for search
  const handleSearchInputChange = (e) => {
    setSearchId(e.target.value);
  };

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!searchId) {
        setError('Please provide a course ID to search.');
        return;
      }

      const response = await fetch(`http://localhost:3001/courses/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to fetch course details');
        return;
      }

      const data = await response.json();
      if (data) {
        setCourse({
          title: data.title || '',
          description: data.description || '',
          instructorId: data.instructorId || '',
        });
        setIsCourseFound(true);
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching course details.');
    }
  };

  // Handles input change for the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update the course details
  const handleUpdateCourse = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!searchId) {
        setError('Search ID is missing. Cannot update course.');
        return;
      }

      const response = await fetch(`http://localhost:3001/courses/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to update course');
        return;
      }

      setSuccess(true);
      alert('Course updated successfully');
      router.push('/adminDashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while updating the course.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search and Update Course</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search for a Course by ID</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Search Course by ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            name="searchId"
            value={searchId}
            onChange={handleSearchInputChange}
            className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black "
            placeholder="Enter course ID"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={fetchCourseDetails}
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
          >
            Search Course
          </button>
        </div>

        {/* Update Course Form */}
        {isCourseFound && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Course Details</h2>

            {/* Course Title */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Course Title</label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter course title"
              />
            </div>

            {/* Course Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Course Description</label>
              <textarea
                name="description"
                value={course.description}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter course description"
              />
            </div>

            {/* Instructor ID */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Instructor ID</label>
              <input
                type="text"
                name="instructorId"
                value={course.instructorId}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter instructor ID"
              />
            </div>


            {/* Instructor Name */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Instructor Name</label>
              <input
                type="text"
                name="instructorName"
                value={course.instructorName}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter instructor Name"
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-6">
              <button
                onClick={handleUpdateCourse}
                className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
              >
                Update Course
              </button>
              <button
                onClick={() => router.push('/adminDashboard')}
                className="ml-4 bg-black text-white py-2 px-4 rounded-full hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
