import React, { useState } from 'react';

export default function QuizResults() {
  const [quizId, setQuizId] = useState('');
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState({ average: 0, min: 0, max: 0 });
  const [error, setError] = useState('');

  const calculateStats = (gradesArray) => {
    if (gradesArray.length === 0) {
      return { average: 0, min: 0, max: 0 };
    }

    const gradesOnly = gradesArray.map((grade) => grade.grade);
    const average = (gradesOnly.reduce((sum, grade) => sum + grade, 0) / gradesOnly.length).toFixed(2);
    const min = Math.min(...gradesOnly);
    const max = Math.max(...gradesOnly);

    return { average, min, max };
  };

  const fetchGrades = async () => {
    if (!quizId) {
      setError('Quiz ID is required');
      return;
    }

    setError('');

    try {
      const response = await fetch(`http://localhost:3001/quizzes/${quizId}`);
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to fetch grades. Server responded with: ${responseText}`);
      }

      const data = await response.json();
      if (data.grades) {
        setGrades(data.grades);
        setStats(calculateStats(data.grades));
      } else {
        setGrades([]);
        setStats({ average: 0, min: 0, max: 0 });
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Error fetching grades');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Results</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Quiz ID</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Quiz ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Quiz ID</label>
          <input
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter quiz ID"
          />
        </div>

        {/* Fetch Grades Button */}
        <button
          onClick={fetchGrades}
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Get Results
        </button>

        {/* Grades Table */}
        {grades.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Grades</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Student ID</th>
                  <th className="border px-4 py-2 text-left">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{grade.studentId}</td>
                    <td className="border px-4 py-2">{grade.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Statistics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
              <p className="mt-2">Average Grade: {stats.average}</p>
              <p>Minimum Grade: {stats.min}</p>
              <p>Maximum Grade: {stats.max}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
