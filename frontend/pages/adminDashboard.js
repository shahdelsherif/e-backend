import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch logged-in admin's data
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('No token found. Please log in.');
          router.push('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await fetch('http://localhost:3001/users/admin', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include Authorization header
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
  
        const data = await response.json();
        setAdminData(data);
  
        // Debugging: Log the response to check the structure
        console.log("Fetched Admin Data:", data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching admin data.');
      }
    };
  
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/logs');
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }

        const logsData = await response.json();
        setLogs(logsData); // Update logs state
      } catch (err) {
        setError(err.message || 'An error occurred while fetching logs.');
      }
    };

    fetchAdminData();
    fetchLogs();
  }, [router]);
  

  const handleLogout = () => {
    // Clear any session data if necessary (e.g., localStorage)
    localStorage.removeItem('access_token');
    // Redirect to the login page
    router.push('/login');
  };

  if (error) return <div>Error: {error}</div>;
  if (!adminData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4">
      {/* Top bar for admin info */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">Welcome, {adminData.name}!</p>
          <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Admin Info Bar */}
      <div className="bg-black text-white py-2 px-4 rounded-md shadow-md mb-6 flex justify-between items-center">
        <p className="text-lg">Email: {adminData.email}</p>
        <p className="text-lg">Role: {adminData.role}</p>
      </div>

        {/* Manage Students Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Students</h2>
        <p className="text-gray-600 mt-4">View students' accounts and add new students.</p>
        <div className="flex space-x-4 mt-4">
          {/* View All Students Button */}
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/students')} // Navigate to Students Page
          >
            View All Students
          </button>

          {/* Add New Student Button */}
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/registerbyadmin')} // Navigate to the Add New Student page
          >
            Add New Student
          </button>

          {/* Search & Update Student Button */}
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/searchstudent')} // Navigate to Search & Update Student page
          >
            Search & Update Student
          </button>

          {/* Delete Student Button */}
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
            onClick={() => router.push('/deletestudent')} // Navigate to Delete Student page
          >
            Delete Student
          </button>
        </div>
      </div>
   
    {/* Manage Courses Section */}
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Manage Courses</h2>
    <p className="text-gray-600 mt-4">Oversee course , add new courses, or update existing ones.</p>

  {/* Courses List */}
  {adminData.courses && adminData.courses.length > 0 && (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Existing Courses:</h3>
      <ul className="list-disc pl-6">
        {adminData.courses.map((course) => (
          <li key={course._id} className="text-gray-600 flex justify-between items-center">
            <span>{course.title} ({course.courseId})</span>

            {/* Action Buttons */}
            <div className="space-x-4">
              {/* Update Button */}
              <button
                className="bg-yellow-500 text-white py-1 px-4 rounded-full"
                onClick={() => router.push(`/updateCourse?id=${course._id}`)} // Navigate to Update Course page
              >
                Update Course
              </button>

              {/* Delete Button */}
              <button
                className="bg-red-600 text-white py-1 px-4 rounded-full"
                onClick={() => handleDeleteCourse(course._id)} // Call the delete function
              >
                Delete Course
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}

{/* Action Buttons for Viewing All Courses, Adding a New Course, Updating, and Deleting a Course */}
<div className="flex space-x-4 mt-4">
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/courses')} // View all courses page
  >
    View All Courses
  </button>
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/addcourse')} // Navigate to the Add New Course page
  >
    Add New Course
  </button>

  {/* Update Course Button (you may need to adjust the URL or logic as per your app's routing) */}
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/searchcourse')} // Navigate to the Update Course page
  >
    Search to Update Course
  </button>

  {/* Delete Course Button (you may need to add a confirmation or action handling logic) */}
  <button
    className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
    onClick={() => router.push('/deletecourse')}
  >
    Delete Course
  </button>
</div>
</div>


      {/* Manage Instructor Accounts Section */}
<div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-xl font-semibold text-gray-800">Manage Instructor Accounts</h2>
  <p className="text-gray-600 mt-4">Add instructors or manage existing instructors.</p>
  <div className="flex space-x-4 mt-4">
  </div>


{/* Action Buttons for Viewing, Adding, Searching & Updating, and Deleting Instructors */}
<div className="flex space-x-4 mt-4">
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/instructors')} // View all instructors page
  >
    View All Instructors
  </button>
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/registerbyadmin')} // Navigate to the Add New Instructor page
  >
    Add New Instructor
  </button>

  {/* Search & Update Instructor Button */}
  <button
    className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
    onClick={() => router.push('/searchinstructor')} // Navigate to Search & Update Instructor page
  >
    Search & Update Instructor
  </button>

  {/* Delete Instructor Button */}
  <button
    className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
    onClick={() => router.push('/deleteinstructor')} // Navigate to Delete Instructor page
  >
    Delete Instructor
  </button>
</div>
</div>
      
    {/* Logs Section */}
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Logs</h2>
        {logs.length > 0 ? (
          <div className="mt-4">
            {logs.map((log, index) => (
              <div key={index} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">{log.type}:</p>
                <p className="text-gray-600 mt-2">{log.message}</p>
                <p className="text-gray-400 text-sm mt-1">Logged by: {log.email || 'N/A'}</p>
                <p className="text-gray-400 text-sm mt-1">Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No new logs.</p>
        )}
      </div>
    </div>
  );
}
