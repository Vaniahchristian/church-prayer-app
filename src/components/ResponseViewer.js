import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResponseViewer() {
  const [responses, setResponses] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  // Group responses by location
  const groupedResponses = responses.reduce((acc, response) => {
    const { location } = response;
    if (!acc[location]) acc[location] = [];
    acc[location].push(response);
    return acc;
  }, {});

  return (
    <div>
      <ul className="space-y-4">
        {Object.keys(groupedResponses).map((location) => (
          <li key={location}>
            <button
              onClick={() => setSelectedLocation(location)}
              className="text-indigo-600 underline"
            >
              {location} ({groupedResponses[location].length} responses)
            </button>
          </li>
        ))}
      </ul>

      {selectedLocation && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-indigo-600">
            Responses from {selectedLocation}
          </h3>
          <ul className="space-y-2 mt-2">
            {groupedResponses[selectedLocation].map((response, index) => (
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
        </div>
      )}
    </div>
  );
}

export default ResponseViewer;
