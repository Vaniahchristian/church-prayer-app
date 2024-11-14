import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrayerForm() {
  const [questions, setQuestions] = useState([]); // Store questions fetched from API
  const [answers, setAnswers] = useState({}); // Store user's answers
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

  if (loading) return <div>Loading questions...</div>;
  if (questions.length === 0) return <div>No active questions available at the moment.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Prayer Form</h2>

      <form onSubmit={handleSubmit}>
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
        </div>

        {questions.map((question) => (
          <div key={question.id} className="mb-4">
            <label className="block text-lg font-medium mb-2" htmlFor={question.id}>
              {question.questionText}
            </label>
            <input
              type="text"
              name={question.id}
              value={answers[question.id] || ''}
              onChange={handleAnswerChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your answer..."
              required
            />
          </div>
        ))}

        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
          Submit Responses
        </button>
      </form>
    </div>
  );
}

export default PrayerForm;
