import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';

function ResponseViewer() {
  const [responses, setResponses] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get('https://church-prayer-app.onrender.com/api/submissions');
        setResponses(response.data);
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
        return answerObj ? answerObj.answerText : 'N/A';
      },
      sortable: true,
      wrap: true, // Wrap text within columns for better display
      hide: 'sm', // Optional: Hide certain columns on smaller screens
    })),
  ];

  // Prepare data for Excel export
  const handleExportToExcel = () => {
    const excelData = responses.map((response) => {
      const row = {
        'User ID': response.userId,
        Location: response.location,
      };
      uniqueQuestions.forEach((question) => {
        const answerObj = response.answers.find((answer) => answer.questionText === question);
        row[question] = answerObj ? answerObj.answerText : 'N/A';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');
    XLSX.writeFile(workbook, 'responses.xlsx');
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200'} rounded`}
        >
          Table View
        </button>
        <button
          onClick={handleExportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export to Excel
        </button>
      </div>

      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <DataTable
            title="Responses Table"
            columns={columns}
            data={responses}
            pagination
            responsive
            highlightOnHover
            customStyles={{
              headCells: {
                style: {
                  fontSize: '0.9rem',
                  '@screen sm': { fontSize: '1rem' },
                },
              },
              cells: {
                style: {
                  fontSize: '0.8rem',
                  '@screen sm': { fontSize: '0.9rem' },
                },
              },
            }}
          />
        </div>
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
