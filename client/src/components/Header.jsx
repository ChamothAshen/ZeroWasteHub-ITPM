import React from 'react'
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between h-20">
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">Z</span>
      </div>
      <span className="text-green-700 font-extrabold text-2xl">Zero Waste</span>
    </div>
    {/* Search Bar */}
    <div className="relative flex items-center mx-auto w-1/4">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-3 py-2 border border-green-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 pr-8 text-sm"
      />
      <FaSearch className="absolute right-3 text-green-600" />
    </div>
    
    {/* Navigation */}
    <nav className="ml-auto">
      <ul className="flex space-x-6 text-green-700 font-semibold text-lg">
        <li className="hover:text-green-500 cursor-pointer"><Link to="/">Home</Link></li>
        <li className="hover:text-green-500 cursor-pointer"><Link to= "/WasteCollection"> collection </Link></li>
        <li className="hover:text-green-500 cursor-pointer"><Link to="/SmartBin">smart bin </Link></li>
        <li className="hover:text-green-500 cursor-pointer whitespace-nowrap"><Link to= "/about">About Us </Link></li>
      </ul>
    </nav>
    
    {/* Buttons */}
    <div className="flex space-x-4 ml-6">
      <button className="px-4 py-2 text-green-700 bg-gray-200 rounded-full hover:bg-gray-300 text-md font-medium"><Link to="/sign-in">Signin </Link></button>
      <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-md font-medium"><Link to="/sign-up">SignUp</Link></button>
    </div>
  </header>
);
};


export default Header