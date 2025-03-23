import React from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaHandshake, FaPeopleCarry } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-green-100 to-white min-h-screen flex flex-col items-center px-6">
      {/* About Us Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-20 max-w-4xl"
      >
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
          About <span className="text-green-700">ZeroWasteHub</span>
        </h1>
        <p className="mt-6 text-xl text-gray-700 leading-relaxed">
          ZeroWasteHub is dedicated to revolutionizing waste management by integrating smart technology with sustainable solutions. Our mission is to reduce environmental impact while optimizing efficiency.
        </p>
      </motion.div>

      {/* Our Values Section */}
      <div className="text-center py-10 max-w-6xl">
        <h2 className="text-5xl font-bold text-gray-900">Our Core Values</h2>
        <p className="mt-5 text-xl text-gray-600 leading-relaxed">
          We believe in sustainability, innovation, and collaboration to create a cleaner future.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {/* Value 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition"
          >
            <FaGlobe className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Sustainability</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              Our solutions promote eco-friendly practices to preserve the planet.
            </p>
          </motion.div>
          {/* Value 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition"
          >
            <FaHandshake className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Collaboration</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              Working together to build a cleaner, greener future.
            </p>
          </motion.div>
          {/* Value 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center hover:shadow-xl transition"
          >
            <FaPeopleCarry className="text-green-700 text-6xl" />
            <h3 className="text-2xl font-semibold mt-4">Innovation</h3>
            <p className="text-gray-600 mt-3 text-lg text-center">
              Pioneering smart waste management solutions for a better world.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
