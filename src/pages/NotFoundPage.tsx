
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-textSecondary mt-2">Page Not Found</p>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/chats" className="mt-6 px-6 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
        Go to Chats
      </Link>
    </div>
  );
};

export default NotFoundPage;