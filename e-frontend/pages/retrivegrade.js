import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function QuizResults() {
  const [quizResults, setQuizResults] = useState([]);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState('');
  const router = useRouter();

  // Fetch the student information when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:4006/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data && data.studentId) {
          setStudentId(data.studentId); // Store studentId if available
        } else {
          setError('Student not authenticated');
        }
      } catch (err) {
        setError('Failed to fetch student data');
      }
    };

    fetchStudentData();
  }, []);

  // Fetch the quiz results after the student is authenticated
  useEffect(() => {
    if (studentId) {
      fetchQuizResults(studentId); // Fetch quiz results based on the studentId
    }
  }, [studentId]);

  const fetchQuizResults = async (studentId) => {
    try {
      // Fetch quiz results for the student's enrolled courses
      const response = await fetch(`http://localhost:4006/quizResults?studentId=${studentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }

      const data = await response.json();
      setQuizResults(data); // Store quiz results
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching quiz results');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Results</h1>

      {/* Display error if any */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Results</h2>

        {/* Loop through quizResults and display student data */}
        {quizResults.length > 0 ? (
          quizResults.map((result, index) => (
            <div key={index} className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Student {index + 1}</h3>
                <p className="text-sm text-gray-600">Name: {result.student.name}</p>
                <p className="text-sm text-gray-600">Student ID: {result.student.id}</p>
                <p className="text-sm text-gray-600">Course: {result.student.course}</p>
                <p className="text-sm text-gray-600">Grade: {result.grade}</p>
              </div>

              {/* Mistakes */}
              <h4 className="text-lg font-semibold text-gray-700">Mistakes</h4>
              <ul className="list-disc pl-5">
                {result.mistakes.length > 0 ? (
                  result.mistakes.map((mistake, mistakeIndex) => (
                    <li key={mistakeIndex} className="text-sm text-gray-600">
                      <strong>Question {mistake.questionIndex + 1}:</strong> {mistake.error}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-600">No mistakes found.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div className="text-gray-600">No results available for this student.</div>
        )}
      </div>
    </div>
  );
}
