import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrayerForm() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [locationAnswered, setLocationAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        setQuestions(response.data);
        setLoading(false);
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
    const formattedAnswers = questions.map((question) => ({
      questionText: question.questionText,
      answerText: answers[question.id] || '',
    }));
    const submissionData = {
      userId: 'user123',
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

  const locationQuestion = (
    <div className="mb-8">
      <label className="block text-lg font-medium mb-4" htmlFor="location">
        Please enter your location
      </label>
      <input
        type="text"
        name="location"
        value={userLocation}
        onChange={(e) => setUserLocation(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        placeholder="Your location..."
        required
      />
      <button
        type="button"
        onClick={() => {
          setLocationAnswered(true);
          setCurrentQuestionIndex(0);
        }}
        className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
      >
        Next
      </button>
    </div>
  );

  const getQuestionToDisplay = () => {
    if (!locationAnswered) return locationQuestion;
    return (
      <div className="mb-6">
        <label
          className="block text-lg font-medium mb-4"
          htmlFor={questions[currentQuestionIndex].id}
        >
          {questions[currentQuestionIndex].questionText}
        </label>
        <input
          type="text"
          name={questions[currentQuestionIndex].id}
          value={answers[questions[currentQuestionIndex].id] || ''}
          onChange={handleAnswerChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Your answer..."
          required
        />
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Prayer Form</h2>

      <form onSubmit={handleSubmit}>
        {getQuestionToDisplay()}

        {locationAnswered && questions.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={prevQuestion}
              className={`px-4 py-2 rounded-md font-semibold ${
                currentQuestionIndex === 0 ? 'bg-gray-300 text-gray-600' : 'bg-gray-600 text-white'
              }`}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <span className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button
              type="button"
              onClick={nextQuestion}
              className={`px-4 py-2 rounded-md font-semibold ${
                currentQuestionIndex === questions.length - 1
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-indigo-600 text-white'
              }`}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        )}

        {locationAnswered && currentQuestionIndex === questions.length - 1 && (
          <button
            type="submit"
            className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-md font-semibold"
          >
            Submit Responses
          </button>
        )}
      </form>
    </div>
  );
}

export default PrayerForm;
