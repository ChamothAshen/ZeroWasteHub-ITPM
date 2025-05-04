import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white shadow-lg">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info Section */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight">Zero Waste</h2>
            <div className="w-20 h-1 bg-green-400 mx-auto md:mx-0 my-3"></div>
            <p className="text-sm mt-4 text-gray-200 leading-relaxed">
              Empowering communities with innovative waste management solutions for a sustainable future. Together we can make our planet cleaner and greener.
            </p>
            
            {/* Location */}
            <div className="mt-6 flex items-center justify-center md:justify-start">
              <FaMapMarkerAlt className="text-green-300 mr-2" />
              <span className="text-sm text-gray-200">123 Green Street, Eco City, 10001</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold tracking-wide">Quick Links</h3>
            <div className="w-16 h-1 bg-green-400 mx-auto md:mx-0 my-3"></div>
            <div className="mt-2 space-y-3">
              <Link to="/" className="block hover:text-green-300 transition-colors duration-300 transform hover:translate-x-1">Home</Link>
              <Link to="/about" className="block hover:text-green-300 transition-colors duration-300 transform hover:translate-x-1">About Us</Link>
              <Link to="/sign-in" className="block hover:text-green-300 transition-colors duration-300 transform hover:translate-x-1">Sign In</Link>
              <Link to="/sign-up" className="block hover:text-green-300 transition-colors duration-300 transform hover:translate-x-1">Sign Up</Link>
              <Link to="/wastebot" className="block hover:text-green-300 transition-colors duration-300 transform hover:translate-x-1">Waste Guide</Link>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold tracking-wide">Contact Us</h3>
            <div className="w-16 h-1 bg-green-400 mx-auto md:ml-auto md:mr-0 my-3"></div>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-center md:justify-end">
                <FaEnvelope className="text-green-300 mr-2" />
                <a href="mailto:support@zerowaste.com" className="text-sm hover:text-green-300 transition-colors">support@zerowaste.com</a>
              </div>
              
              <div className="flex items-center justify-center md:justify-end">
                <FaPhone className="text-green-300 mr-2" />
                <a href="tel:+18001234567" className="text-sm hover:text-green-300 transition-colors">+1 (800) 123-4567</a>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="mt-6">
              <div className="flex space-x-4 justify-center md:justify-end">
                <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors">
                  <FaFacebookF className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors">
                  <FaTwitter className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors">
                  <FaInstagram className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors">
                  <FaLinkedinIn className="text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="w-full bg-green-900 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">© {new Date().getFullYear()} Zero Waste. All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <a href="#" className="text-xs text-gray-300 hover:text-white mx-2">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-300 hover:text-white mx-2">Terms of Service</a>
            <a href="#" className="text-xs text-gray-300 hover:text-white mx-2">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;