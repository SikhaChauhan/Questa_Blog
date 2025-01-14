import React, { useState } from 'react';
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [flashType, setFlashType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/resetPassword/${token}`,
        { password }
      );

      setFlashMessage(response.data.message);
      setFlashType(response.data.status ? 'success' : 'error');
      if (response.data.status) {
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      }
    } catch (error) {
      console.error('Request error:', error);
      setFlashMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      setFlashType('error');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen border">
      <div className="w-full max-w-2xl mt-4 mb-4 bg-white border-2 rounded-lg shadow-2xl shadow-black p-9">
        <div className="mb-8 text-center">
          <img
            src="/assets/logo4.png"
            className="h-16 mx-auto mb-4"
            alt="Logo"
          />
          <h2 className="mb-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-800 drop-shadow-lg">Reset Password</h2>
          <p className="mt-2 text-black">Enter your new password below.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password" className="text-white">New Password</Label>
            <TextInput
              type="password"
              placeholder="New Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 text-black"
              required
            />
          </div>
          <Button
            className="px-6 py-1 text-white rounded-lg bg-gradient-to-br from-black via-gray-900 to-gray-700"
            type="submit"
          >
            Reset Password
          </Button>

          {flashMessage && (
            <Alert
              className={`mt-2 text-center ${
                flashType === 'success'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {flashMessage}
            </Alert>
          )}
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;




