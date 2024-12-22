import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchAndUpdateInstructorStudent() {
  const [searchId, setSearchId] = useState(''); // ID to search for user (student)
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    ID: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isUserFound, setIsUserFound] = useState(false);
  const router = useRouter();

  // Handles input change for search
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchId(value);
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!searchId) {
        setError('Please provide a user ID to search.');
        return;
      }

      // Updated URL to match backend path for a user
      const response = await fetch(`http://localhost:3001/users/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to fetch user details');
        return;
      }

      const data = await response.json();
      if (data) {
        setUser({
          ...data,
          id: data.id || '', // Ensure `id` is set correctly
        });
        setIsUserFound(true);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching user details.');
    }
  };

  // Handles input change for the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update the user details
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!user.ID) {
        setError('User ID is missing. Cannot update user.');
        return;
      }

      const response = await fetch(`http://localhost:3001/users/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to update user');
        return;
      }

      setSuccess(true);
      alert('User updated successfully');
      router.push('/instructorDashboard');  // Redirect to Instructor Dashboard
    } catch (err) {
      setError(err.message || 'An error occurred while updating the user.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search and Update Student</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search for a Student by ID</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Search User by ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Student ID</label>
          <input
            type="text"
            name="searchId"
            value={searchId}
            onChange={handleSearchInputChange}
            className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
            placeholder="Enter student ID"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={fetchUserDetails}
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
          >
            Search User
          </button>
        </div>

        {/* Update User Form */}
        {isUserFound && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Student Details</h2>

            {/* User Name */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter student name"
              />
            </div>

            {/* User Email */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Student Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter student email"
              />
            </div>

            {/* Role */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                value={user.role}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter user role"
              />
            </div>

            {/* ID */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Student ID</label>
              <input
                type="text"
                name="ID"
                value={user.ID}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter student id"
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-6">
              <button
                onClick={handleUpdateUser}
                className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
              >
                Update User
              </button>
              <button
                onClick={() => router.push('/instructorDashboard')} // Redirect to Instructor Dashboard if canceled
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
