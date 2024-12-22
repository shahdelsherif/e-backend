import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddMaterial() {
  const [courseId, setCourseId] = useState(''); // Track course ID
  const [description, setDescription] = useState(''); // Track description
  const [driveURL, setDriveUrl] = useState(''); // Track drive URL
  const [title, setTitle] = useState(''); // Track title
  const [type, setType] = useState(''); // Track type (e.g., video, pdf)
  const [rate, setRate] = useState(''); // Track rate
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Handle input changes for each field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'courseId':
        setCourseId(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'driveURL':
        setDriveUrl(value);
        break;
      case 'title':
        setTitle(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'rate':
        setRate(value);
        break;
      default:
        break;
    }
  };

  const handleAddMaterial = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }
  
      if (!courseId || !description || !driveURL || !title || !type || !rate) {
        setError('All fields are required.');
        return;
      }
  
      const materialData = {
        courseId,
        description,
        driveURL,
        title,
        type,  // Use type here
        rate: parseFloat(rate),
      };
  
      const response = await fetch('http://localhost:3001/multimedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(materialData),
      });
  
      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || 'Failed to add material');
      }
  
      setSuccess(true);
      alert('Material added successfully');
      router.push('/instructorDashboard'); // Redirect to Instructor Dashboard after success
    } catch (err) {
      setError(err.message || 'An error occurred while adding material.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Material</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Material Details</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Material added successfully!</div>}

        {/* Course ID Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            name="courseId"
            value={courseId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course ID"
          />
        </div>

        {/* Description Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter description"
          />
        </div>

        {/* Drive URL Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Drive URL</label>
          <input
            type="url"
            name="driveURL"
            value={driveURL}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter drive URL"
          />
        </div>

        {/* Title Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter material title"
          />
        </div>

        {/* Type Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={type}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="">Select type</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
          </select>
        </div>

{/* Rating Input */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Importance Rating</label>
  <input
    type="number"
    name="rate"
    value={rate || 3} // Default value set to 3
    onChange={handleInputChange}
    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
    placeholder="Rate the importance of this content (1-5)"
    min="1"
    max="5"
  />
</div>


        {/* Submit and Cancel Buttons */}
        <div className="mt-6">
          <button
            onClick={handleAddMaterial}
            className="bg-black text-white py-2 px-6 rounded-full hover:bg-pink-500 transition-colors"
          >
            Add Material
          </button>
          <button
            onClick={() => router.push('/instructorDashboard')} // Redirect to Instructor Dashboard if canceled
            className="ml-4 bg-gray-600 text-white py-2 px-6 rounded-full hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
