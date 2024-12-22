// pages/courses/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CourseDetails() {

  const router = useRouter();
  const { id } = router.query; // Get course ID from the URL
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [enrollmentMessage, setEnrollmentMessage] = useState('');

  // Fetch course details
  useEffect(() => {
    if (!id) return; // Prevent fetching if `id` is undefined

    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include access token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching course details.');
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnrollment = async () => {
    try {

      const token = localStorage.getItem('access_token');

      // not login
      if(token == null){
        throw new Error ('Login to be able to enrolled in this course.')
      }

      const response = await fetch(`http://localhost:3001/courses/${id}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('You are already enrolled in this course.');
      }

      setEnrollmentMessage('Successfully enrolled in the course!');
    } catch (err) {
      setEnrollmentMessage(err.message || 'An error occurred during enrollment.');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{course.title}</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="text-gray-600 mt-2">Course Code : {course.courseId}</p>
        <p className="text-gray-600 mt-2">Instructor : {course.instructorName}</p>
        <p className="text-gray-600 mb-2">Duration: 12 Week</p>

        <button
          onClick={handleEnrollment}
          className="mt-4 bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
        >
          Enroll Now
        </button>

        {enrollmentMessage && (
          <p className={`mt-4 ${enrollmentMessage.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {enrollmentMessage}
          </p>
        )}
      </div>
    </div>
  );
}
