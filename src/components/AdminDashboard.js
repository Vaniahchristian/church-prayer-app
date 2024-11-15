import React, { useState } from 'react';
import QuestionManager from './QuestionManager';
import ResponseViewer from './ResponseViewer';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('questions'); // Tracks the active section

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-72">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Church Admin Dashboard
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-6 mb-8 ">
        <button
          onClick={() => setActiveSection('questions')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeSection === 'questions'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-indigo-600'
          }`}
        >
          Manage Questions
        </button>
        <button
          onClick={() => setActiveSection('responses')}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeSection === 'responses'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-indigo-600'
          }`}
        >
          View Responses
        </button>
      </div>

      {/* Conditional Rendering for Sections */}
      <div className="bg-white shadow-lg p-6 rounded-lg">
        {activeSection === 'questions' && (
          <>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Manage Questions</h2>
            <QuestionManager />
          </>
        )}

        {activeSection === 'responses' && (
          <>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">View Responses</h2>
            <ResponseViewer />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
