import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'; // ✅ Ensure correct path
import OAuth from '../components/OAuth';

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Ensure `state.user` exists in the Redux store
  const { error } = useSelector((state) => state.user || { error: null });

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

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return dispatch(signInFailure(data.message || 'Login failed!'));
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error); // ✅ Debugging
      dispatch(signInFailure(error.message || 'An error occurred!'));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-green-700 flex flex-col justify-center items-center text-white p-10">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <BsTrash className="text-7xl drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Zero Waste Management
          </h1>
          <p className="text-lg mb-8 font-light tracking-wide">
            Revolutionizing waste disposal with AI-powered technology for a cleaner, greener future.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-600">Login to Your Account</h2>
            <p className="text-gray-600 mt-2">Welcome back! Please enter your details</p>
          </div>

          {/* ✅ Display error message */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaLock />
                </span>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-green-600 hover:text-green-800">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
            >
              Login
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mt-6">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="absolute bg-white px-3 text-sm text-gray-500">or continue with</div>
            </div>

            {/* Google Login Button */}
         
            <OAuth />

            {/* Signup Redirect */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?
                <Link to="/sign-up" className="ml-1 text-green-600 hover:text-green-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
