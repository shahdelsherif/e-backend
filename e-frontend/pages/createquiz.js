import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 1 },
  ]);
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { courseId } = router.query;

  // Effect to handle courseId from the URL
  useEffect(() => {
    if (courseId && !course) {
      setCourse(courseId); // Set course state if courseId exists in URL
    }
  }, [courseId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 1 },
    ]);
  };

  // Function to validate the quiz inputs before submission
  const validateQuiz = () => {
    if (!title || !description || !course) {
      setError('All fields (Title, Description, Course) are required.');
      return false;
    }
    for (let i = 0; i < questions.length; i++) {
      const { question, options, correctAnswer, difficulty } = questions[i];
      if (!question || !correctAnswer || !difficulty || options.some((opt) => !opt)) {
        setError(`All fields for question ${i + 1} must be filled out.`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate quiz data
    if (!validateQuiz()) {
      return;
    }

    const quizData = {
      title,
      description,
      questions,
      courseId: course,
    };

    try {
      const response = await fetch('http://localhost:4006/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (err) {
          responseData = { message: responseText };
        }
        throw new Error(`Failed to create quiz. Server responded with: ${responseData.message || responseText}`);
      }

      const result = await response.json();
      router.push(`/instructorDashboard`);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error creating quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Quiz</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Quiz Details</h2>

        {/* Display error if any */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Course Identification */}
        {!course && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Course Name or Course ID</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)} // Allow user input for course name/ID
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter course name or course ID"
            />
          </div>
        )}
        {course && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <input
              type="text"
              value={course} // Locked to the `course` state
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              disabled
            />
          </div>
        )}

        {/* Quiz Title */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter quiz title"
          />
        </div>

        {/* Quiz Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Quiz Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter quiz description"
          />
        </div>

        {/* Questions */}
        {questions.map((question, index) => (
          <div key={index} className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Question {index + 1}</h3>
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter question"
            />
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...question.options];
                  updatedOptions[optionIndex] = e.target.value;
                  handleQuestionChange(index, 'options', updatedOptions);
                }}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder={`Option ${optionIndex + 1}`}
              />
            ))}
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Correct Answer"
            />
            <input
              type="number"
              value={question.difficulty}
              onChange={(e) => handleQuestionChange(index, 'difficulty', e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Difficulty (1-5)"
              min={1}
              max={5}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Add Question
        </button>

        <button
          onClick={handleSubmit}
          className="mt-4 ml-4 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}
