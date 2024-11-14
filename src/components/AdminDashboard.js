import React from 'react';
import QuestionManager from './QuestionManager';
import ResponseViewer from './ResponseViewer';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Church Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Manage Questions</h2>
          <QuestionManager />
        </section>
        <section className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">View Responses</h2>
          <ResponseViewer />
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
