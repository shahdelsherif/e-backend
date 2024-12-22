import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchQuizByCourse() {
  const [searchId, setSearchId] = useState(''); // Course ID to search for quizzes
  const [quizzes, setQuizzes] = useState([]); // List of quizzes related to the course
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isQuizzesFound, setIsQuizzesFound] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // For selecting a quiz to update
  const [updatedQuiz, setUpdatedQuiz] = useState({
    id: '',
    title: '',
    description: '',
    questions: [], // Initialize questions as an empty array
  }); // For handling quiz updates
  const router = useRouter();

  // Handles input change for search
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchId(value);
  };

  const fetchQuizzesByCourse = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!searchId) {
        setError('Please provide a course ID to search.');
        return;
      }

      // Updated URL to match backend path for fetching quizzes by course ID
      const response = await fetch(`http://localhost:3001/quizzes/course/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to fetch quizzes');
        return;
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setQuizzes(data);
        setIsQuizzesFound(true);
      } else {
        setError('No quizzes found for this course');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching quizzes.');
    }
  };

  // Handles input change for the update form
  const handleQuizUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedQuiz((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handles input change for updating questions
  const handleQuestionInputChange = (index, e) => {
    const { name, value } = e.target;
  
    // Ensure the question at the given index exists and has the required properties
    const updatedQuestions = [...updatedQuiz.questions];
  
    if (!updatedQuestions[index]) {
      updatedQuestions[index] = { questionText: '', answers: [] }; // Initialize if not defined
    }
  
    updatedQuestions[index][name] = value;
  
    setUpdatedQuiz((prevState) => ({
      ...prevState,
      questions: updatedQuestions,
    }));
  };
  

  // Update the quiz details
  const handleUpdateQuiz = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No token found. Please log in.');
        router.push('/login');
        return;
      }

      if (!updatedQuiz.id) {
        setError('Quiz ID is missing. Cannot update quiz.');
        return;
      }

      const response = await fetch(`http://localhost:3001/quizzes/${updatedQuiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedQuiz),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        setError(responseBody.message || 'Failed to update quiz');
        return;
      }

      setSuccess(true);
      alert('Quiz updated successfully');
      router.push('/instructorDashboard');
    } catch (err) {
      setError(err.message || 'An error occurred while updating the quiz.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search and Update Quiz by Course</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search for Quizzes by Course ID</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Search Course by ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            name="searchId"
            value={searchId}
            onChange={handleSearchInputChange}
            className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
            placeholder="Enter course ID"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={fetchQuizzesByCourse}
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
          >
            Search Quizzes
          </button>
        </div>

        {/* Display Found Quizzes */}
        {isQuizzesFound && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quizzes Found</h2>

            {/* Display quiz details */}
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz.id} className="mb-4">
                  <div className="border-b py-2">
                    <h3 className="text-lg font-semibold">{quiz.title}</h3>
                    <p className="text-sm">{quiz.description}</p>
                    <button
                      className="mt-2 bg-black text-white py-1 px-4 rounded-full hover:bg-pink-400"
                      onClick={() => setSelectedQuiz(quiz)}
                    >
                      Edit Quiz
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Update Quiz Form */}
        {selectedQuiz && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Quiz Details</h2>

            {/* Editable Quiz ID */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Quiz ID</label>
              <input
                type="text"
                name="id"
                value={updatedQuiz ? updatedQuiz.id : selectedQuiz.id}
                onChange={handleQuizUpdateInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter quiz ID"
              />
            </div>

            {/* Quiz Title */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
              <input
                type="text"
                name="title"
                value={updatedQuiz ? updatedQuiz.title : selectedQuiz.title}
                onChange={handleQuizUpdateInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter quiz title"
              />
            </div>

            {/* Quiz Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Quiz Description</label>
              <input
                type="text"
                name="description"
                value={updatedQuiz ? updatedQuiz.description : selectedQuiz.description}
                onChange={handleQuizUpdateInputChange}
                className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                placeholder="Enter quiz description"
              />
            </div>

            {/* Questions */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              {selectedQuiz.questions && selectedQuiz.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
                    <textarea
                      name="questionText"
                      value={question.questionText}
                      onChange={(e) => handleQuestionInputChange(index, e)}
                      className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                      placeholder="Enter question text"
                    />
                  </div>

                  {/* Possible Answers */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">Possible Answers</label>
                    <input
                      type="text"
                      name="answers"
                      value={question.answers}
                      onChange={(e) => handleQuestionInputChange(index, e)}
                      className="mt-1 p-2 w-full border border-purple-300 rounded-md text-black"
                      placeholder="Enter possible answers"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="mt-6">
              <button
                onClick={handleUpdateQuiz}
                className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
              >
                Update Quiz
              </button>
              <button
                onClick={() => router.push('/instructorDashboard')} // Redirect to Admin Dashboard if canceled
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
