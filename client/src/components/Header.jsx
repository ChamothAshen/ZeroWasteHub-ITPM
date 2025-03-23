import React, { useState } from 'react';
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Dropdown, Button } from 'flowbite-react';
import { getAuth } from "firebase/auth";
// Fix 1: Change the import statement to use default imports instead of named imports


function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const auth = getAuth();

  const handleSignout = () => {
    console.log("User signed out");
    // You can add dispatch(logoutAction()) if using Redux for auth
  };

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
        <nav className="hidden md:flex space-x-6 text-green-700 font-semibold text-lg">
          <Link className="hover:text-green-500" to="/">Home</Link>
          <Link className="hover:text-green-500" to="/about">About Us</Link>

        </nav>

        {/* Profile Dropdown */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="relative flex items-center space-x-2">
                <Avatar alt="user" img={currentUser.profilePicture} rounded className="w-10 h-10 border-2 border-green-500 shadow-md hover:shadow-xl transition duration-300" />
              </div>
            } >
            <Dropdown.Header>
              <span className="block text-sm text-green-700">@{currentUser.username}</span>
              <span className="block text-sm font-medium text-gray-500 truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item className="text-green-700 hover:bg-green-100">Dashbord</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} className="text-red-600 hover:bg-red-100">Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline className="hover:text-green-500">
              Sign In
            </Button>
          </Link>
        )}

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
            <Link className="hover:text-green-500" to="/pages/CollectRequestForm">Waste Collect Request Form</Link>
            <Link className="hover:text-green-500" to="/pages/RequestSmartBinForm">Smart Bin Request Form</Link>
            <Link className="hover:text-green-500" to="/about">About Us</Link>
            <Link className="hover:text-green-500" to="/EmployeeDashboard">Employee Dashboard</Link>
            <Link className="hover:text-green-500" to="/sign-in">Sign In</Link>
            <Link className="hover:text-green-500" to="/sign-up">Sign Up</Link>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;