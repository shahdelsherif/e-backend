import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 

export default function InstructorDashboard() {
  const [userData, setUserData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);  // State to store the retrieved grades
  const [error, setError] = useState('');
  const [newCourse, setNewCourse] = useState({
    courseTitle: '',
    courseDescription: '',
  });
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isUpdatingStudent, setIsUpdatingStudent] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState({
    courseTitle: '',
    courseDescription: '',
  });
  const router = useRouter();
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/instructor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch instructor data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching instructor data.');
      }
    };

    fetchInstructorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

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
            <Link href={`/instructorCourseContent/${course._id}`} passHref>
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


const handleCourseNavigation = () => {
  router.push('/courses');
};

const handleEnrolledCourse = () => {
  router.push('/courses');
};

const handleInfoUpdate = (stuId) => {
  router.push(`/studentUpdate/${stuId}`);
};

const handleContactsNavigation = () => {
  router.push('/contacts'); 
};

const handleForums = () => {
  router.push('/forums'); 
};

const handleChats = (userId) => {
  router.push(`/chats/${userId}`); 
};


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
        <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Instructor Info */}
      <div className="bg-black text-white py-2 px-4 rounded-md shadow-md mb-6 flex justify-between items-center">
        <p>Email: {userData.email}</p>
        <p>Role: {userData.role}</p>
      </div>

      {/* Course Navigation and Info Update Buttons */}
      <div className="flex py-4 px-4 mb-6 space-x-4">
        {/* Courses Button */}
        <button
          onClick={handleCourseNavigation}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Navigate Courses
        </button>

        {/* Enrolled Courses Button */}
        <button
          onClick={handleEnrolledCourse}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Enrolled Courses
        </button>
  

        {/* Contacts Button */}
        <button
          onClick={handleContactsNavigation}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Contacts
        </button>

        {/* Forums Button */}
        <button
          onClick={handleForums}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Forums
        </button>

         {/* Chats Button */}
         <button
          onClick={()=>handleChats(userData._id)}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Chats 
        </button>

        {/* Info Update Button */}
        <button
          onClick={() => handleInfoUpdate(userData._id)}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors"
        >
          Update Info
        </button>

      </div>

     {/* Manage Courses Section */}
<div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-xl font-semibold text-gray-800">Manage Courses</h2>
  <div className="flex space-x-4 mt-4">
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/addcourseinstructor')} // Navigate to the Add New Course page
    >
      Add New Course
    </button>
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/searchbyinstructorcourse')}
    >
      Search & Update Course
    </button>
    {/* Add Material Button */}
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/creatematerial')} // Navigate to the Add Material page
    >
      Add Material
    </button>
  </div>
</div>

      {/* Manage Student Accounts Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manage Student Accounts</h2>
        <p className="text-gray-600 mt-4">Create and manage student accounts, and assign them to courses.</p>
        <div className="flex space-x-4 mt-4">
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/registerbyinstructor')} // Navigate to the Add New Student page
          >
            Add New Student
          </button>
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/instructorDashboard')}
          >
            Assign Students to Course
          </button>
          {/* Update Student Button */}
          <button
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
            onClick={() => router.push('/searchbyinstructorstudent')} // Open Update Student form
          >
            Search & Update Student
          </button>
        </div>
        </div>

      {/* Manage Quizzes Section */}
<div className="bg-white p-6 rounded-lg shadow-md mb-6">
  <h2 className="text-xl font-semibold text-gray-800">Manage Quizzes</h2>
  <div className="flex space-x-4 mt-4">
    {/* Add New Quiz Button */}
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/createquiz')} // Navigate to the Add New Quiz page
    >
      Add New Quiz
    </button>

    {/* Search & Update Quiz Button */}
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/searchquizinstructor')} // Navigate to Search & Update Quiz page
    >
      Search & Update Quiz
    </button>

    {/* Retrieve Grade Button */}
    <button
      className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
      onClick={() => router.push('/retrivegrade')} // Trigger the function to fetch grades
    >
      Retrieve Grade
    </button>

    {/* Delete Quiz Button */}
    <button
      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
      onClick={() => router.push('/deletequiz')} // Add your delete quiz logic here
    >
      Delete Quiz
    </button>
  </div>
</div>

    {/* Main Content Section */}
    <div className="w-[950px]">
      {/* Enrolled Courses Section */}
      <EnrolledCourses enrolledCoures={userData.enrolledCourses} />
      
      {/* Notifications Section */}
      <NotificationsSection />
    </div>
</div>
    
  );
}
