import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddCourse() {
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    courseId:'',
    instructorName: '',
    instructorId: '', // Instructor ID field
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCourse = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      // Ensure that the instructor ID is provided
      if (!newCourse.instructorId || !newCourse.instructorName) {
        setError('Instructor ID and Instructor Name are required.');
        return;
      }

      const response = await fetch('http://localhost:3001/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Failed to add new course');
      }

      setSuccess(true);
      alert('New course added successfully');

      // Redirect to admin dashboard regardless of the user role
      router.push('/adminDashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the course.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Course</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Course Details</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Course added successfully!</div>}

        {/* Course Title */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            name="title"
            value={newCourse.title}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course title"
          />
        </div>

        {/* Course Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course Description</label>
          <textarea
            name="description"
            value={newCourse.description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course description"
          ></textarea>
        </div>

        {/* Instructor Name */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Instructor Name</label>
          <input
            type="text"
            name="instructorName"
            value={newCourse.instructorName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter instructor name"
          />
        </div>

         {/* Course ID */}
         <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            name="courseId"
            value={newCourse.courseId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course ID"
          />
        </div>

        {/* Instructor ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Instructor ID</label>
          <input
            type="text"
            name="instructorId"
            value={newCourse.instructorId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter instructor ID"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="mt-6">
          <button
            onClick={handleAddCourse}
            className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
          >
            Add Course
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
