import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Frontend is Working!
        </h1>
        <p className="text-gray-600 mb-4">
          The React application is rendering correctly.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Status Check</h2>
          <ul className="text-left space-y-2">
            <li>React: Working</li>
            <li>Vite: Working</li>
            <li>TypeScript: Working</li>
            <li>Tailwind CSS: Working</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
