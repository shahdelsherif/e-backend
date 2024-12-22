import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DeleteInstructor() {
  const [instructorId, setInstructorId] = useState(''); // Track instructor ID to be deleted
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setInstructorId(e.target.value);
  };

  const handleDeleteInstructor = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!instructorId) {
        setError('Instructor ID is required.');
        return;
      }

      const response = await fetch(`http://localhost:3001/users/${instructorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Failed to delete the instructor');
      }

      setSuccess(true);
      alert('Instructor deleted successfully');
      router.push('/adminDashboard'); // Redirect back to Admin Dashboard
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the instructor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Delete Instructor</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Instructor ID to Delete</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Instructor deleted successfully!</div>}

        {/* Instructor ID Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Instructor ID</label>
          <input
            type="text"
            name="instructorId"
            value={instructorId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter instructor ID to delete"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="mt-6">
          <button
            onClick={handleDeleteInstructor}
            className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
          >
            Delete Instructor
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
