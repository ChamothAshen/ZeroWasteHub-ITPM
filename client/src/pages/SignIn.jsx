import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';

function SignIn() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - Brand/Logo */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-green-500 to-green-700 flex flex-col justify-center items-center text-white p-10">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <BsTrash className="text-7xl drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              Zero Waste management
          </h1>
          <p className="text-lg mb-8 font-light tracking-wide">
            Revolutionizing waste disposal with AI-powered technology for a cleaner, greener future.
          </p>
          <div className="hidden md:block">
            <div className="mb-6 p-6 bg-white text-green-800 rounded-2xl shadow-lg">
              <p className="italic text-lg">
                "This system transformed our city's cleanliness and efficiency!"
              </p>
              <p className="font-bold mt-3">- Satisfied Citizen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-600">Login to Your Account</h2>
            <p className="text-gray-600 mt-2">Welcome back! Please enter your details</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>
            </div>

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

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
            >
              Login
            </button>

            <div className="relative flex items-center justify-center mt-6">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="absolute bg-white px-3 text-sm text-gray-500">or continue with</div>
            </div>

            <button
              type="button"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              <span>Google</span>
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?
                <a href="/register" className="ml-1 text-green-600 hover:text-green-800 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
