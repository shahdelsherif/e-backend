// pages/deleteCourse.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DeleteCourse() {
  const [courseId, setCourseId] = useState(''); // Track course ID to be deleted
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setCourseId(e.target.value);
  };

  const handleDeleteCourse = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!courseId) {
        setError('Course ID is required.');
        return;
      }

      const response = await fetch(`http://localhost:4006/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Failed to delete the course');
      }

      setSuccess(true);
      alert('Course deleted successfully');
      router.push('/adminDashboard'); // Redirect back to Admin Dashboard
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the course.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Delete Course</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Course ID to Delete</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Course deleted successfully!</div>}

        {/* Course ID Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            name="courseId"
            value={courseId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course ID to delete"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="mt-6">
          <button
            onClick={handleDeleteCourse}
            className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
          >
            Delete Course
          </button>
          <button
            onClick={() => router.push('/adminDashboard')} // Redirect to Admin Dashboard if canceled
            className="ml-4 bg-gray-600 text-white py-2 px-6 rounded-full hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
