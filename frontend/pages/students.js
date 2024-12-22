import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch students from the database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        // Filter students with the role of 'student'
        const filteredStudents = data.filter(student => student.role === 'student');
        setStudents(filteredStudents);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching students.');
      }
    };

    fetchStudents();
  }, []);

  const handleStudentDetails = (studentId) => {
    // Navigate to a detailed page for the student
    router.push(`/studentDetails/${studentId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (students.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Students</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-gray-600 mt-2">Email: {student.email}</p>
            <p className="text-gray-600 mt-2">Id: {student.ID}</p>

            {/* Button to view details 
            <button
              onClick={() => handleStudentDetails(student._id)}
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
