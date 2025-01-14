import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading = false, error: errorMessage = '' } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
          <h2 className="mb-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-800 drop-shadow-lg">Sign In</h2>
          <p className="mt-2 text-black">Welcome back! Please sign in to continue.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              'Sign In'
            )}
          </Button>
          <OAuth />

<div className="flex flex-col gap-2 mt-4 text-sm text-black-300">
  <div className="flex gap-2">
    <span>Don't have an account?</span>
    <Link to="/sign-up" className="text-pink-800 hover:underline">
      Sign Up
    </Link>
  </div>
  <div className="flex gap-2">
    <span>Forgot your password?</span>
    <Link to="/forgotPassword" className="text-pink-800 hover:underline">
      Forgot Password
    </Link>
  </div>
</div>

{errorMessage && (
  <Alert
    className="flex items-center justify-center w-2/3 mx-auto mt-2 text-center text-white bg-gradient-to-br from-red-300 via-red-500 to-red-300"
  >
    {errorMessage}
  </Alert>
)}


        </form>
      </div>
    </section>
  );
}




