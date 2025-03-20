import React, { useState } from 'react';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between h-20 w-full">
      {/* Left Section - Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">Z</span>
        </div>
        <span className="text-green-700 font-extrabold text-2xl">Zero Waste</span>
      </div>

      {/* Center Section - Search Bar */}
      <div className="relative hidden md:flex items-center w-1/4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 border border-green-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-8 text-sm"
        />
        <FaSearch className="absolute right-3 text-green-600" />
      </div>

      {/* Right Section - Navigation & Buttons */}
      <div className="flex items-center space-x-6">
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-green-700 font-semibold text-lg">
          <Link className="hover:text-green-500" to="/">Home</Link>
          <Link className="hover:text-green-500" to="/WasteCollection">Collection</Link>
          <Link className="hover:text-green-500" to="/RequestSmartBinForm">Smart Bin</Link>
          <Link className="hover:text-green-500" to="/about">About Us</Link>
          <Link className="hover:text-green-500" to="/EmployeeDashboard">Employee</Link>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex space-x-4">
          <button className="px-4 py-2 text-green-700 bg-gray-200 rounded-full hover:bg-gray-300 text-md font-medium">
            <Link to="/sign-in">Signin</Link>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-md font-medium">
            <Link to="/sign-up">SignUp</Link>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-green-700 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-white shadow-md p-4 md:hidden">
          <ul className="flex flex-col space-y-4 text-green-700 font-semibold text-lg">
            <Link className="hover:text-green-500" to="/">Home</Link>
            <Link className="hover:text-green-500" to="/WasteCollection">Collection</Link>
            <Link className="hover:text-green-500" to="/RequestSmartBinForm">Smart Bin</Link>
            <Link className="hover:text-green-500" to="/about">About Us</Link>
            <Link className="hover:text-green-500" to="/EmployeeDashboard">Employee Dashboard</Link>
            <Link className="hover:text-green-500" to="/sign-in">Signin</Link>
            <Link className="hover:text-green-500" to="/sign-up">SignUp</Link>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
