import { useState, useEffect } from 'react';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch instructors from the database
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/instructors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch instructors');
        }

        const data = await response.json();
        setInstructors(data);
        setFilteredInstructors(data); // Initially, show all instructors
      } catch (err) {
        setError(err.message || 'An error occurred while fetching instructors.');
      }
    };

    fetchInstructors();
  }, []);

  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredInstructors(instructors); // Show all if search term is empty
    } else {
      const filtered = instructors.filter((instructor) =>
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstructors(filtered); // Filter instructors based on search term
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Update the search term
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (instructors.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Instructors Contacts</h1>

      {/* Search Section */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          className="py-2 px-4 border border-gray-300 rounded-md w-full md:w-1/2 mb-4 md:mb-0"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor) => (
              <tr key={instructor._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{instructor.name}</td>
                <td className="border border-gray-300 px-4 py-2">{instructor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
