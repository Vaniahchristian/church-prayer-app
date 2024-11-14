import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrayerForm() {
  const [questions, setQuestions] = useState([]); // Store questions fetched from API
  const [answers, setAnswers] = useState({}); // Store user's answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [userLocation, setUserLocation] = useState(''); // Store user's location
  const [loading, setLoading] = useState(true); // Loading state for questions

  useEffect(() => {
    // Fetch questions from the backend (API)
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        setQuestions(response.data);
        setLoading(false); // Set loading to false once questions are fetched
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();

    // Request user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  }, []);

  const handleAnswerChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to submit answers and location
    const submissionData = {
      userId: 'user123', // Example user ID, can be dynamically set
      answers,           // Collect all answers
      location: userLocation, // Include user's location
    };

    try {
      const response = await axios.post('http://localhost:5000/api/submissions', submissionData);
      alert('Your responses have been submitted successfully!');
    } catch (error) {
      console.error('Error submitting responses:', error);
      alert('There was an error submitting your responses.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('You have answered all the questions!');
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No active questions available at the moment.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Prayer Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2" htmlFor="answer">
            {currentQuestion ? currentQuestion.questionText : 'Loading question...'}
          </label>
          <input
            type="text"
            name={`question_${currentQuestion ? currentQuestion.id : ''}`} // Dynamic question name
            value={answers[`question_${currentQuestion ? currentQuestion.id : ''}`] || ''}
            onChange={handleAnswerChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Your answer..."
            required
          />
        </div>

        <div className="flex justify-between items-center">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Next Question
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Submit Responses
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PrayerForm;
