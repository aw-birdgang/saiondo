import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface AuthHeaderProps {
  title: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title }) => {
  const { logout } = useAuth();

  return (
    <div className='flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
      <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
        {title}
      </h1>
      <button
        onClick={logout}
        className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
      >
        Logout
      </button>
    </div>
  );
};

export default AuthHeader;
