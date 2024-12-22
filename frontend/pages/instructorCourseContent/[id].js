import {useEffect } from 'react';
import React, { useState} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from 'next/router';



const CourseContent = () => {
  const router = useRouter();
  const { id } = router.query;

  const [courseDetails, setCourseDetails] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourseDetails = async () => {      
      try {
        // Fetch course details
        const courseResponse = await fetch(`http://localhost:3001/courses/${id}`);
        const courseData = await courseResponse.json();

        setCourseDetails(courseData);

        // Fetch instructor details
        const instructorResponse = await fetch(`http://localhost:3001/users/instructor/${courseData.instructorName}`);
        const instructorData = await instructorResponse.json();
        setInstructor(instructorData);

        // Fetch multimedia related to the course
        const multimediaData = await Promise.all(
          courseData.multimediaIds.map(async (mediaId) => {
            const response = await fetch(`http://localhost:3001/multimedia/${mediaId}`);
            return response.json();
          })
        );
        setMultimedia(multimediaData);

        // Fetch quizzes related to the course
        const quizzesData = await Promise.all(
          courseData.quizzesIds.map(async (quizId) => {
            const response = await fetch(`http://localhost:3001/quizzes/${quizId}`);
            return response.json();
          })
        );

        setQuizzes(quizzesData.filter(quiz => quiz.status === 'Available'));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return <p>Loading course details...</p>;
  }

  if (!courseDetails || !instructor) {
    return <p>Course not found or instructor data is missing.</p>;
  }

  const CourseMultimedia = ({ multimedia }) => {
    const onDragEnd = (result) => {
      if (!result.destination) return; // Item was dropped outside the list
  
      const items = Array.from(multimedia);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
  
      setMultimedia(items); // Update the state with the new order
    };

    const renderStars = (rate) => {
      const fullStars = Math.floor(rate); // Full stars based on the rate
      const maxStars = 5; // Total number of stars
    
      return (
        <span className="flex items-center">
          {Array.from({ length: maxStars }, (_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill={index < fullStars ? "gold" : "gray"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          ))}
        </span>
      );
    };
  
    const renderMultimediaLink = (item) => {
      const type = item.type;
  
      if (['pdf'].includes(type)) {
        return <a href={item.driveURL} target="_blank" rel="noopener noreferrer"><button className="px-4 py-2 w-40 bg-black text-white rounded hover:bg-blue-700 text-center">
        View PDF
      </button></a>;
      } else if (['video'].includes(type)) {
        return <a href={item.driveURL} target="_blank" rel="noopener noreferrer"><button className="px-4 py-2 w-40 bg-black text-white rounded hover:bg-blue-700 text-center">
        Watch Video
      </button></a>;
      } else if (['img','image'].includes(type)) {
        return <a href={item.driveURL} target="_blank" rel="noopener noreferrer"><button className="px-4 py-2 w-40 bg-black text-white rounded hover:bg-blue-700 text-center">
        View Image
      </button></a>;
      } else {
        return <a href={item.driveURL} target="_blank" rel="noopener noreferrer"><button className="px-4 py-2 w-40 bg-black text-white rounded hover:bg-blue-700 text-center">
        Download File
      </button></a>;
      }
    };
  
    return (
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">

        <h2 className="text-xl font-semibold text-gray-800">Course Multimedia</h2>
        {multimedia.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="multimedia-list">
              {(provided) => (
                <ul
                  className="list-disc list-inside text-gray-600"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {multimedia.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided) => (
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="flex justify-between items-center border-b py-2"
                        >
                          <span>{item.title}</span>
                          <span>{renderStars(item.rate)}</span>
                          <span>{renderMultimediaLink(item)}</span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <p className="text-gray-600">No multimedia available for this course.</p>
        )}
      </div>
    );
  };

  const handleDiscussions = (courseId) => {
    router.push(`/forums/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{courseDetails.title}</h1>

       {/* Discution Forums Button */}
       <div className="py-6 px-4 mt-6">
       <button
          onClick={()=>handleDiscussions(id)}
          className="bg-black text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors space-x-10"
        >
          Discussion Forums
        </button>
        </div>

      {/* Instructor Information */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Instructor Information</h2>
        <p className="text-gray-600">Instructor: {instructor.name}</p>
        <p className="text-gray-600">Email: {instructor.email}</p>
      </div>

      {/* Course Description */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Course Information</h2>
        <p className="text-gray-600 mt-2">{courseDetails.description}</p>
        <p className="text-gray-600 mt-2">Course ID: {courseDetails.courseId}</p>
        <p className={`mt-2 ${ courseDetails.completed==true ? 'text-green-500' : 'text-red-500'}`}>
          Completion: {courseDetails.completed == true ? 'Completed' : 'Not Completed'}
          </p>
      </div>

      {/* Multimedia */}
      <CourseMultimedia multimedia={multimedia} />

      {/* Quizzes */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Available Quizzes</h2>
        {quizzes.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {quizzes.map((quiz) => {
              // Check if the student has already taken the quiz and has a grade
              const studentGrade = quiz.grades.find((grade) => grade.studentId === localStorage.getItem('student_id'));

              return (
                <li key={quiz._id} className="flex justify-between items-center space-y-5">
                  <span>{quiz.title}</span>
                  <span>{quiz._id}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">No available quizzes for this course.</p>
        )}
      </div>
      </div>
  );
};

export default CourseContent;
