import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

function ResponseViewer() {
  const [responses, setResponses] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'

  useEffect(() => {
    // Fetch responses from the backend API
    const fetchResponses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/submissions');
        setResponses(response.data); // Assuming the API response is an array of response objects
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };
    fetchResponses();
  }, []);

  // Extract unique questions to form columns
  const uniqueQuestions = Array.from(
    new Set(responses.flatMap((response) => response.answers.map((answer) => answer.questionText)))
  );

  // Define columns with dynamic question columns
  const columns = [
    { name: 'User ID', selector: (row) => row.userId, sortable: true },
    { name: 'Location', selector: (row) => row.location, sortable: true },
    ...uniqueQuestions.map((question) => ({
      name: question,
      selector: (row) => {
        const answerObj = row.answers.find((answer) => answer.questionText === question);
        return answerObj ? answerObj.answerText : 'N/A'; // Display 'N/A' if the question wasn't answered
      },
      sortable: true,
    })),
  ];

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 ml-2 ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded`}
        >
          Table View
        </button>
      </div>

      {viewMode === 'table' && (
        <DataTable
          title="Responses Table"
          columns={columns}
          data={responses}
          pagination
        />
      )}

      {viewMode === 'list' && (
        <ul className="space-y-4">
          {responses.map((response, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded shadow">
              <p><strong>User ID:</strong> {response.userId}</p>
              <p><strong>Location:</strong> {response.location}</p>
              {response.answers.map((answer, idx) => (
                <p key={idx}>
                  <strong>{answer.questionText}:</strong> {answer.answerText}
                </p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResponseViewer;
