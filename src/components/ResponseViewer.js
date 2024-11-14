import React, { useState, useEffect } from 'react';
import { firestore } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function ResponseViewer() {
  const [responses, setResponses] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      const responseCollection = collection(firestore, "prayers");
      const responseSnapshot = await getDocs(responseCollection);
      const responseList = responseSnapshot.docs.map(doc => doc.data());
      setResponses(responseList);
    };
    fetchResponses();
  }, []);

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
                <p><strong>Name:</strong> {response.userName}</p>
                <p><strong>Prayer Content:</strong> {response.prayerContent}</p>
                <p><strong>Prayer Request:</strong> {response.prayerRequest}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ResponseViewer;
