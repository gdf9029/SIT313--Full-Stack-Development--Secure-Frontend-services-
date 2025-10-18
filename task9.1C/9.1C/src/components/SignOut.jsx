import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutUser } from '../services/authService';

const SignOut = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Sign out from Firebase
        await signOutUser();
        
        // Clear localStorage
        localStorage.removeItem('user');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'You have been signed out successfully!' }
          });
        }, 2000);
      } catch (error) {
        console.error('Sign-out error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    performSignOut();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border-2 border-red-500">
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-bold text-red-600">Sign Out Failed</h2>
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/');
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DEV@Deakin</h1>
          <h2 className="text-xl text-gray-600">Signing you out...</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border-2 border-blue-500">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Please wait while we sign you out...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
