import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaLock, FaEnvelope, FaBuilding, FaPhone } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        return setErrorMessage(data.message || 'Signup failed.');
      }
      navigate('/sign-in');
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - Brand/Logo */}
      <div className="w-full md:w-1/2 bg-green-600 flex flex-col justify-center items-center text-white p-8">
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center mb-6">
            <BsTrash className="text-6xl" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Zero Waste Management System</h1>
          <p className="text-lg mb-6">
            Revolutionizing waste management with smart technology for a cleaner environment.
          </p>
          <div className="hidden md:block">
            <div className="mb-6 p-4 bg-green-700 rounded-lg">
              <p className="italic">
                "The intelligent waste management solution that transformed our city's cleanliness and efficiency."
              </p>
              <p className="font-bold mt-2">- Happy Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-green-600">Register Your Company</h2>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </div>

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaBuilding />
                </span>
                <input
                  type="text"
                  id="username"
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your company name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                  onChange={handleChange}
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
                  id="password"
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
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
                Already have an account?{' '}
                <Link to="/sign-in" className="text-green-600 hover:text-green-800 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
