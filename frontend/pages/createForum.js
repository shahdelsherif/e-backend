import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateForum() {
  const [courseId, setCourseId] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !topic) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/forums/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create forum');
      }

      const data = await response.json();
      setSuccess('Forum created successfully!');
      // Optionally, navigate to the forum list or the newly created forum
      setTimeout(() => {
        router.push(`/forums`);
      }, 1500); // Redirect after 1.5 seconds
    } catch (err) {
      setError(err.message || 'An error occurred while creating the forum.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Forum</h1>

      {/* Error or Success message */}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      {/* Forum Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="courseId" className="block text-gray-700 font-semibold mb-2">
            Course ID
          </label>
          <input
            type="text"
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Enter Course ID"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="topic" className="block text-gray-700 font-semibold mb-2">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Forum Topic"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Forum
          </button>
          <button
            type="button"
            onClick={() => router.push('/forums')}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
