// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 

// Function to fetch user data
const fetchUserData = async (setUserData, setError) => {
  try {
    const response = await fetch('http://localhost:4006/users/student', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    console.log(data.enrolledCourses);
    setUserData(data);
  } catch (err) {
    setError(err.message || 'An error occurred while fetching user data.');
  }
};

// Component to display student information (top bar)
const StudentInfoBar = ({ userData }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="bg-gray-50 py-15 px-4">
      {/* Top bar with welcome message and logout button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">Welcome, {userData.name}!</p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Student Info Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md mb-6 flex justify-between items-center">
        <p className="text-lg">Email: {userData.email}</p>
        <p className="text-lg">Role: Student</p>
      </div>
    </div>
  );
};

// Component to display student metrics (right section)
const StudentMetrics = ({ studentMetrics }) => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6 ">
    <h2 className="text-xl font-semibold text-gray-800">Performance Metrics</h2>
    <p className="text-gray-600">Completion Rate: {studentMetrics.completionRate}%</p>
    <p className="text-gray-600">Average Score: {studentMetrics.averageScore}</p>
    <p className="text-gray-600">Engagement Trends: {studentMetrics.engagementTrends}</p>
  </div>
);

// Component to display enrolled courses
const EnrolledCourses = ({ enrolledCoures = [] }) => {
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await Promise.all(
          enrolledCoures.map(async (courseId) => {
            const response = await fetch(`http://localhost:4006/courses/${courseId}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch course with ID: ${courseId}`);
            }
            return response.json(); // Assuming the API returns course details as JSON
          })
        );
        setCourseDetails(fetchedCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    if (enrolledCoures.length > 0) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [enrolledCoures]);

  if (loading) {
    return <p className="text-gray-600">Loading enrolled courses...</p>;
  }

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800">Enrolled Courses</h2>
      {courseDetails.length > 0 ? (
        <ul className="list-disc list-inside text-gray-600">
          {courseDetails.map((course, index) => (
            <li key={course.id}>
            <Link href={`/courseDetails/${course.id}`} passHref>
              <span className="text-blue-600 hover:underline">{course.title}</span>
            </Link>
          </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">You are not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

// Empty section for notifications
const NotificationsSection = () => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
    <p className="text-gray-600">No new notifications.</p>
  </div>
);

// Empty section for suggestions
const SuggestionsSection = () => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6">
    <h2 className="text-xl font-semibold text-gray-800">Suggestions</h2>
    <p className="text-gray-600">No suggestions available.</p>
  </div>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch logged-in user's data on component mount
    fetchUserData(setUserData, setError);
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  const handleCourseNavigation = () => {
    router.push('/courses');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Student Info Bar */}
      <StudentInfoBar userData={userData} />

      <div className="flex mt-8 space-x-6">
        {/* Student Metrics Section */}
        <StudentMetrics studentMetrics={userData.studentMetrics} />

        {/* Main Content Section */}
        <div className="w-2/3">
          {/* Enrolled Courses Section */}
          <EnrolledCourses enrolledCoures={userData.enrolledCourses} />

          {/* Notifications Section */}
          <NotificationsSection />

          {/* Suggestions Section */}
          <SuggestionsSection />
        </div>
      </div>

      {/* Course Navigation Button */}
      <div className="mt-6">
        <button
          onClick={handleCourseNavigation}
          className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
        >
          Go to Courses
        </button>
      </div>
    </div>
  );
}
