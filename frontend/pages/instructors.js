import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch instructors from the database
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('http://localhost:3001/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch instructors');
        }

        const data = await response.json();
        // Filter instructors with the role of 'instructor'
        const filteredInstructors = data.filter(instructor => instructor.role === 'instructor');
        setInstructors(filteredInstructors);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching instructors.');
      }
    };

    fetchInstructors();
  }, []);

  const handleInstructorDetails = (instructorId) => {
    // Navigate to a detailed page for the instructor
    router.push(`/instructorDetails/${instructorId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (instructors.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Instructors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{instructor.name}</h2>
            <p className="text-gray-600 mt-2">Email: {instructor.email}</p>
            <p className="text-gray-600 mt-2">Id: {instructor.ID}</p>

            {/* Button to view details 
            <button
              onClick={() => handleInstructorDetails(instructor._id)}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>*/}
          </div>
        ))}
      </div>
    </div>
  );
}
