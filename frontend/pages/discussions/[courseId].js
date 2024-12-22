// pages/forums.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Forums() {
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]); // State for filtered forums
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [error, setError] = useState('');
  const router = useRouter();
  const { courseId } = router.query;

  // Fetch forums from the database
  useEffect(() => {
    const fetchForums = async () => {

      try {
        const response = await fetch(`http://localhost:3001/forums/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch forums');
        }

        const data = await response.json();
        setForums(data);
        setFilteredForums(data); // Initialize filtered forums with all forums
      } catch (err) {
        setError(err.message || 'An error occurred while fetching forums.');
      }
    };

    fetchForums();
  }, []);

  const handleForumDetails = (forumId) => {
    router.push(`/forumDetails/${forumId}`);
  };

  const handleSearch = () => {
    const filtered = forums.filter((forum) =>
      forum.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForums(filtered);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (forums.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Forums</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search forums..."
          className="flex-1 border border-gray-300 py-2 px-4 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white py-2 px-6 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForums.map((forum) => (
          <div
            key={forum._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800">{forum.topic}</h2>
            <p className="text-gray-600 mt-2">{forum.description}</p>

            <button
              onClick={() => handleForumDetails(forum._id)}
              className="mt-4 bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              View Forum
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
