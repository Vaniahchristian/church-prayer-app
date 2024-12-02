import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  // Fetch questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://church-prayer-app.onrender.com/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  // Add a new question
  const addQuestion = async () => {
    if (newQuestion.trim() === "") return;

    try {
      const response = await axios.post('https://church-prayer-app.onrender.com/api/questions', {
        questionText: newQuestion,
        status: 'active', // Example status, can be modified as needed
      });
      setQuestions([...questions, response.data]);
      setNewQuestion("");
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Delete a question
  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`https://church-prayer-app.onrender.com/api/questions/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter new question"
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addQuestion}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>{question.questionText}</span>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionManager;
