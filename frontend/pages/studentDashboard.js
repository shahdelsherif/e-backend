// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 

// Function to fetch user data
const fetchUserData = async (setUserData, setError) => {
  try {
    const response = await fetch('http://localhost:3001/users/student', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
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
          <p className="text-gray-600">Welcome, {userData.name}</p>
          <button
            className="bg-black hover:bg-blue-600 text-white py-2 px-4 rounded-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Student Info Bar */}
      <div className="bg-black text-white py-2 px-4 rounded-md shadow-md mb-6 flex justify-between items-center">
        <p className="text-lg">Email: {userData.email}</p>
        <p className="text-lg">Role: Student</p>
      </div>
    </div>
  );
};

// Component to display student metrics (right section)
const StudentMetrics = ({ studentMetrics }) => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6 ">
    <h2 className="text-2xl font-semibold text-gray-800">Performance Metrics</h2>
    <div className="space-y-2">
      <p className="text-2xl text-green-600"> Completion Rate </p>
        <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out">
          {studentMetrics.completionRate}%
          </button>
          
          <p className="text-2xl text-green-600"> Average Score </p>      
            <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out">
            {studentMetrics.averageScore}
          </button>
          
          <p className="text-2xl text-green-600"> Engagement Trend </p>    
            <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out">
            {studentMetrics.engagementTrends}
            </button>
          
</div>
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
            const response = await fetch(`http://localhost:3001/courses/${courseId}`);
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
      <h2 className="text-2xl font-semibold text-gray-800">Enrolled Courses</h2>
      {courseDetails.length > 0 ? (
        <ul className="list-disc list-inside text-gray-600">
          {courseDetails.map((course, index) => (
            <li key={course._id}>
            <Link href={`/courseContent/${course._id}`} passHref>
            <span className="text-2xl font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300 ease-in-out">{course.title}</span>
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

// notifications
const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {

    try {
      const response = await fetch(`http://localhost:3001/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
      {loading ? (
        <p className="text-gray-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-600">No new notifications.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <li key={notification._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {!notification.isRead && (
                  <span className="text-sm text-blue-600 font-semibold">New</span>
                )}
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="bg-black text-white px-1 py-1 rounded-lg hover:bg-blue-700"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


// suggestions
const SuggestionsSection = () => (
  <div className="mt-6 bg-white shadow-md rounded-lg p-6">
    <h2 className="text-2xl font-semibold text-gray-800">Suggestions</h2>
    <p className="text-gray-600">No suggestions available.</p>
  </div>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserData(setUserData, setError);
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!userData) return <div>Loading...</div>;

  const handleCourseNavigation = () => {
    router.push('/courses');
  };

  const handleInfoUpdate = (stuId) => {
    router.push(`/studentUpdate/${stuId}`);
  };

  const handleContactsNavigation = () => {
    router.push('/contacts'); 
  };

  const handleProgressGuid = () => {
    router.push('/progressGuid'); 
  };

  const handleChats = (userId) => {
    router.push(`/chats/${userId}`); 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Student Info Bar */}
      <StudentInfoBar userData={userData} />
  
      {/* Course Navigation and Info Update Buttons */}
      <div className="flex py-4 px-4 mb-6 space-x-4">
        {/* Courses Button */}
        <button
          onClick={handleCourseNavigation}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Go to Courses
        </button>
  
        {/* Info Update Button */}
        <button
          onClick={() => handleInfoUpdate(userData._id)}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Update Info
        </button>

        {/* Contacts Button */}
        <button
          onClick={handleContactsNavigation}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Contacts
        </button>

        {/* Progress Guid Button */}
        <button
          onClick={handleProgressGuid}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Progress Guid
        </button>

         {/* Chats Button */}
         <button
          onClick={()=>handleChats(userData._id)}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Chats 
        </button>

      </div>
  
      <div className="flex bg-gray-50 py-4 px-8 space-x-12 h-auto">
        {/* Student Metrics Section */}
        <StudentMetrics studentMetrics={userData.studentMetrics} />
  
        {/* Main Content Section */}
        <div className="w-[950px]">
          {/* Enrolled Courses Section */}
          <EnrolledCourses enrolledCoures={userData.enrolledCourses} />
  
          {/* Notifications Section */}
          <NotificationsSection />
  
          {/* Suggestions Section */}
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
}
