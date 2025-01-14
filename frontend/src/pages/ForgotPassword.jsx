import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [flashType, setFlashType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgotPassword', { email });
      setFlashMessage('A password reset link has been sent to your email address.');
      setFlashType('success');
      console.log(response);
    } catch (error) {
      console.error('Request error:', error);
      setFlashMessage(
        error.response?.data?.message || 'Email could not be sent. Please try again later.'
      );
      setFlashType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mt-4 mb-4 bg-white border-2 rounded-lg shadow-2xl shadow-black p-9">
        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src="/assets/logo4.png"
              className="h-16 mx-auto mb-4"
              alt="Logo"
            />
          </Link>
          <h2 className="mb-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-800 drop-shadow-lg">Forgot Password</h2>
          <p className="mt-2 text-black">Enter your email to receive a password reset link.</p>
        </div>

        {flashMessage && (
          <Alert
            className={`flex items-center justify-center w-2/3 mx-auto mt-2 text-center text-black bg-gradient-to-br from-${flashType === 'success' ? 'bg-gradient from-green-600 to-green-900' : 'bg-gradient-to-r from-pink-500 to-red-500'}-300 via-${flashType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-900' : 'bg-gradient-to-r from-pink-500 to-red-500'}-500 to-${flashType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-900' : 'bg-gradient-to-r from-pink-500 to-red-500'}-300`}
          >
            {flashMessage}
          </Alert>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="text-white">Your email</Label>
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 text-black"
              required
            />
          </div>

          <Button
            className="px-6 py-1 text-white rounded-lg bg-gradient-to-br from-black via-gray-900 to-gray-700"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
        <div className="flex flex-col gap-2 mt-4 text-sm text-black-300">
          <div className="flex gap-2">
            <span>Remembered your password?</span>
            <Link to="/sign-in" className="text-pink-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
