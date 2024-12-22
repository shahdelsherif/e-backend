import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [questionsShown, setQuestionsShown] = useState(0);
  const [grade, setGrade] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:3001/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        setQuiz(data);
        setCurrentQuestion(data.easyQuestions[0]); // Start with the first easy question
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (selectedAnswer) => {
    if (!currentQuestion) return;

    // save the answer
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.question]: isCorrect,
    }));

    // update question
    setQuestionHistory((prevHistory) => [
      ...prevHistory,
      { question: currentQuestion, isCorrect },
    ]);

    setNextEnabled(true);
  };

  const [nextEnabled, setNextEnabled] = useState(false);

  const handleNextQuestion = () => {
    setNextEnabled(false);
    adjustDifficulty(answers[currentQuestion.question]);
  };

  const adjustDifficulty = (isCorrect) => {
    if (!quiz) return;

    const totalQuestions = quiz.numOfQuestions;

    if (questionsShown + 1 >= totalQuestions) {
      handleSubmit();
      return;
    }

    // determine the difficulty
    let nextDifficulty = difficulty;
    if (isCorrect) {
      if (difficulty === "easy") nextDifficulty = "medium";
      else if (difficulty === "medium") nextDifficulty = "hard";
    } else {
      if (difficulty === "medium") nextDifficulty = "easy";
      else if (difficulty === "hard") nextDifficulty = "medium";
    }
    setDifficulty(nextDifficulty);


    // next question
    const nextQuestionPool = quiz[`${nextDifficulty}Questions`];
    const unusedQuestions = nextQuestionPool.filter(
      (q) => !questionHistory.some((history) => history.question.question === q.question)
    );
    const nextQuestion = unusedQuestions[0]; // Pick the first unused question

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuestionsShown((prev) => prev + 1);
    } else {
      // If no more questions in the pool, fallback to random selection
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setQuizCompleted(true);

    const correctAnswers = Object.values(answers).filter((ans) => ans).length;
    const studentGrade = (correctAnswers / quiz.numOfQuestions) * 100;
    setGrade(studentGrade);

    if (studentGrade >= 90) {
      setFeedback("Excellent work! You did an amazing job!");
    } else if (studentGrade >= 70) {
      setFeedback(" Very Good job! Keep practicing to improve further.");
    } else if (studentGrade >= 60){
      setFeedback("Good job! But you need to study well next timw.");
    } else{
      setFeedback("Don't give up! Keep Studying and you will be improved next time.");
    }

    const incorrectQs = questionHistory.filter((entry) => !entry.isCorrect);
    setIncorrectQuestions(incorrectQs);

    try {
      const response = await fetch(`http://localhost:3001/quizzes/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          studentId: localStorage.getItem("student_id"),
          grade: Math.round(studentGrade),
        }),
      });

      if (!response.ok) throw new Error("Failed to save grade");

      //alert("Your grade has been saved!");
      await new Promise(r => setTimeout(r, 20000));
      window.location.href = "/studentDashboard";
    } catch (err) {
      console.error("Error saving grade:", err);
    }
  };

  if (!quiz || !currentQuestion) return <div>Loading quiz...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{quiz.title}</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h3>
        <div className="mt-4">
          {currentQuestion.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${currentQuestion.question}`}
                value={option}
                onChange={() => handleAnswerChange(option)}
                className="h-4 w-4 text-blue-600"
                disabled={quizCompleted}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4">
        {questionsShown + 1 < quiz.numOfQuestions && (
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={!nextEnabled}
            className={`px-4 py-2 rounded ${
              nextEnabled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            Next Question
          </button>
        )}
        {questionsShown + 1 === quiz.numOfQuestions && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!nextEnabled}
            className={`px-4 py-2 rounded ${
              nextEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            Submit Quiz
          </button>
        )}
      </div>

      {grade !== null && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Grade</h2>
          <p className="text-gray-600">You scored: {Math.round(grade)}%</p>
          <p className="text-gray-800 font-medium mt-4">{feedback}</p>

          {incorrectQuestions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Incorrect Questions:</h3>
              <ul className="list-disc list-inside">
                {incorrectQuestions.map((entry, index) => (
                  <li key={index} className="mt-2">
                    <p><strong>Question:</strong> {entry.question.question}</p>
                    <p><strong>Correct Answer:</strong> {entry.question.correctAnswer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
          
    </div>
  );
};

export default QuizPage;
