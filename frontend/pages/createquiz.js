import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateQuiz() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState({
    easy: [{ question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 1 }],
    medium: [{ question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 3 }],
    hard: [{ question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 5 }],
  });

  const router = useRouter();

  const handleQuestionChange = (difficulty, index, field, value) => {
    const updatedQuestions = { ...questions };
    updatedQuestions[difficulty][index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = (difficulty) => {
    setQuestions((prev) => ({
      ...prev,
      [difficulty]: [
        ...prev[difficulty],
        { question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5 },
      ],
    }));
  };

  const validateQuiz = () => {
    if (!title || !description || !courseId) {
      setError('All fields (Title, Description, Course ID) are required.');
      return false;
    }

    for (const difficulty in questions) {
      for (let i = 0; i < questions[difficulty].length; i++) {
        const { question, options, correctAnswer } = questions[difficulty][i];
        if (!question || !correctAnswer || options.some((opt) => !opt)) {
          setError(`All fields for ${difficulty} question ${i + 1} must be filled out.`);
          return false;
        }
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateQuiz()) {
      return;
    }

    const quizData = {
      courseId,
      title,
      description,
      numOfQuestions:
        questions.easy.length + questions.medium.length + questions.hard.length,
      easyQuestions: questions.easy,
      mediumQuestions: questions.medium,
      hardQuestions: questions.hard,
    };

    try {
      const response = await fetch('http://localhost:3001/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to create quiz. Server responded with: ${responseText}`);
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

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Course ID */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Course ID</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter course ID"
          />
        </div>

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

        {/* Questions by Difficulty */}
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <div key={difficulty} className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 capitalize">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Questions
            </h3>
            {questions[difficulty].map((question, index) => (
              <div key={index} className="mt-4">
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(difficulty, index, 'question', e.target.value)
                  }
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
                      handleQuestionChange(difficulty, index, 'options', updatedOptions);
                    }}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(difficulty, index, 'correctAnswer', e.target.value)
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Correct Answer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addQuestion(difficulty)}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Add {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Question
            </button>
          </div>
        ))}

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => addQuestion('easy')}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Questions
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
