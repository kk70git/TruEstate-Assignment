import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard'; // We will create this next

function App() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;