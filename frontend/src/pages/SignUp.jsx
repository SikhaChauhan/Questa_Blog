import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen border">
      <div className="w-full max-w-2xl mt-4 mb-4 bg-white border-2 rounded-lg shadow-2xl shadow-black p-9">
        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src="/assets/logo4.png"
              className="h-16 mx-auto mb-4"
              alt="Logo"
            />
          </Link>
          <h2 className="mb-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-800 drop-shadow-lg">Sign Up</h2>
          <p className="mt-2 text-black">Create an account to get started!</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username" className="text-white">Your username</Label>
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
              className="mt-1 text-black"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Your email</Label>
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
              className="mt-1 text-black"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Your password</Label>
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className="mt-1 text-black"
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
              'Sign Up'
            )}
          </Button>
          <OAuth />
          <div className="flex gap-2 mt-1 text-sm text-black-300">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-pink-500 hover:underline">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </form>
      </div>
    </section>
  );
}
