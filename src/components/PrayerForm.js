import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrayerForm() {
  const [questions, setQuestions] = useState([]); // Store questions fetched from API
  const [answers, setAnswers] = useState({}); // Store user's answers
  const [userLocation, setUserLocation] = useState(''); // Store user's location
  const [loading, setLoading] = useState(true); // Loading state for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [locationAnswered, setLocationAnswered] = useState(false); // Track if location is answered

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

    // Convert answers to an array of objects with questionText and answerText
    const formattedAnswers = questions.map((question) => ({
      questionText: question.questionText,
      answerText: answers[question.id] || '', // Get the answer based on question ID
    }));

    const submissionData = {
      userId: 'user123', // Example user ID, can be dynamically set
      answers: formattedAnswers,
      location: userLocation,
    };

    try {
      await axios.post('http://localhost:5000/api/submissions', submissionData);
      alert('Your responses have been submitted successfully!');
    } catch (error) {
      console.error('Error submitting responses:', error);
      alert('There was an error submitting your responses.');
    }
  };

  // Show loading message while questions are being fetched
  if (loading) return <div>Loading questions...</div>;

  // Show message if no questions are available
  if (questions.length === 0) return <div>No active questions available at the moment.</div>;

  // Handle question navigation (Next/Previous)
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Location question will be shown first
  const locationQuestion = (
    <div className="mb-4">
      <label className="block text-lg font-medium mb-2" htmlFor="location">
        Location
      </label>
      <input
        type="text"
        name="location"
        value={userLocation}
        onChange={(e) => setUserLocation(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Your location..."
        required
      />
      <button
        type="button"
        onClick={() => {
          setLocationAnswered(true);
          setCurrentQuestionIndex(0); // Start from the first question after location
        }}
        className="px-4 py-2 bg-green-600 text-white rounded-md mt-4"
      >
        Next
      </button>
    </div>
  );

  // Show the rest of the questions after the location
  const getQuestionToDisplay = () => {
    if (!locationAnswered) {
      return locationQuestion; // Only show location question if it hasn't been answered yet
    } else {
      return (
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2" htmlFor={questions[currentQuestionIndex].id}>
            {questions[currentQuestionIndex].questionText}
          </label>
          <input
            type="text"
            name={questions[currentQuestionIndex].id}
            value={answers[questions[currentQuestionIndex].id] || ''}
            onChange={handleAnswerChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Your answer..."
            required
          />
        </div>
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Prayer Form</h2>

      <form onSubmit={handleSubmit}>
        {/* Location question will appear only once */}
        {getQuestionToDisplay()}

        {/* If location has been answered, show the rest of the questions */}
        {locationAnswered && questions.length > 0 && (
          <>
            <div className="flex justify-between mb-4">
              <button
                type="button"
                onClick={prevQuestion}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Submit button */}
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
          Submit Responses
        </button>
      </form>
    </div>
  );
}

export default PrayerForm;
