import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
        const response = await fetch('http://localhost:4006/users/instructor', {
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

  const handleAddCourse = async () => {
    try {
      const response = await fetch('http://localhost:4006/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      const data = await response.json();
      alert('Course added successfully');
      setNewCourse({ courseTitle: '', courseDescription: '' }); // Reset form
      setIsAddingCourse(false); // Close the "Add Course" form
      router.push('/admindashboard');
      console.log('Course Added:', data);
    } catch (err) {
      alert(err.message || 'An error occurred while adding the course.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setUpdatedCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setUpdatedStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://localhost:4006/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        throw new Error('Failed to add new student');
      }

      const data = await response.json();
      alert('New student added successfully');
      setNewStudent({
        studentName: '',
        studentEmail: '',
      });
      setIsAddingStudent(false); // Close the add student form
      router.push('/admindashboard');
      console.log("Student Added:", data);
    } catch (err) {
      alert(err.message || 'An error occurred while adding the student.');
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4006/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const data = await response.json();
      alert('Course updated successfully');

      // Reset the form and close the update course form
      setUpdatedCourse({
        courseTitle: '',
        courseDescription: '',
      });
      setIsUpdatingCourse(false);
      setSelectedCourse(null);  // Optionally, reset the selected course
      router.push('/instructordashboard');
      console.log("Course Updated:", data);
    } catch (err) {
      alert(err.message || 'An error occurred while updating the course.');
    }
  };

  const handleUpdateStudent = async () => {
    // Assume there's logic to get the correct student data to update
    try {
      const response = await fetch(`http://localhost:4006/users/${newStudent.studentEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(updatedStudent),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const data = await response.json();
      alert('Student updated successfully');

      // Reset the form and close the update student form
      setUpdatedStudent({
        studentName: '',
        studentEmail: '',
      });
      setIsUpdatingStudent(false);
      console.log("Student Updated:", data);
    } catch (err) {
      alert(err.message || 'An error occurred while updating the student.');
    }
  };

  const handleAssignStudentToCourse = () => {
    if (!selectedCourse) {
      alert("Please select a course first");
      return; // Prevent further execution if no course is selected
    }

    // Navigate to the assignstudentTocourse page with the selected course details
    router.push({
      pathname: '/addstudentTocourse',
      query: {
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.courseTitle,  // Make sure courseTitle is passed correctly
      },
    });
  };


  const handleRetrieveGrades = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4006/courses/${selectedCourse.id}/grades`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve grades');
      }

      const data = await response.json();
      setGrades(data.grades);  // Store grades in the state
      alert('Grades retrieved successfully');
    } catch (err) {
      alert(err.message || 'An error occurred while retrieving grades.');
    }
  };


  const handleDeleteQuiz = async () => {
    // Assuming you have the quiz ID available, either from the UI or state
    const quizId = "example-quiz-id"; // Replace with dynamic quiz ID
    
    try {
      const response = await fetch(`http://localhost:4006/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert('Quiz deleted successfully');
        // Optionally, you can redirect the user or update the state to reflect the deletion
        router.push('/instructorDashboard'); // Redirect to the instructor dashboard
      } else {
        const errorData = await response.json();
        alert(`Error deleting quiz: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting quiz');
    }
  };
  


  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Loading...</div>;

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
            onClick={() => router.push('/addstudentTocourse')}
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
            {/* Personal Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          <p className="text-gray-600 mt-4">View your personal information and track completed courses.</p>
          <div className="flex space-x-4 mt-4">
            <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400">
              View Personal Info
            </button>
            <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400">
              View Enrolled Courses
            </button>
            <button className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400">
              Track Completed Courses
            </button>
            {/* New Button for "Courses I Teach" */}
            <button
              className="bg-black text-white py-2 px-4 rounded-full hover:bg-pink-400"
              onClick={() => {/* Implement the logic to view courses taught */}}
            >
              Courses I Teach
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

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        <p className="text-gray-600 mt-4">No new notifications.</p>
      </div>
    </div>
    
  );
}
