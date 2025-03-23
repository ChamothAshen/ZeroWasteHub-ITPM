import React from "react";
import { motion } from "framer-motion";
import { FaRecycle, FaLeaf, FaLightbulb } from "react-icons/fa";
import homeImage from "../assets/Homepic.png";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-green-100 to-white min-h-screen flex flex-col items-center px-6">
      {/* Hero Section */}
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Revolutionize Your <span className="text-green-700">Waste Management</span>
          </h1>
          <p className="mt-6 text-xl text-gray-700 leading-relaxed">
            ZeroWasteHub integrates smart technology with efficient management solutions to help organizations
            reduce their environmental footprint while improving operational efficiency.
          </p>
          <div className="mt-10 flex gap-6">
            <button className="bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-green-800 transition text-lg font-semibold">
              Get Started →
            </button>
            <button className="border-2 border-gray-700 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition text-lg font-semibold">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Section (Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -top-4 -left-4 w-full h-full bg-green-200 rounded-xl -z-10 shadow-xl"></div>
          <img
            src={homeImage}
            alt="Waste Management Bins"
            className="rounded-xl shadow-2xl w-full"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="text-center py-20">
        <h2 className="text-5xl font-bold text-gray-900">Our Cutting-Edge Features</h2>
        <p className="mt-5 text-xl text-gray-600 leading-relaxed">
          Discover how our integrated solutions can transform your waste management operations.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition">
            <FaRecycle className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Smart Recycling</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              Automated sorting and tracking for better recycling efficiency.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Eco-Friendly Practices</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              Sustainable strategies to reduce carbon footprint.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition">
            <FaLightbulb className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Innovative Solutions</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              AI-driven insights for optimized waste management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;