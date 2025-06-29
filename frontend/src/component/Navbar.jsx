import React, { useState } from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({name="RucoBank"}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-400">{name}</div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li className="hover:text-blue-400 cursor-pointer">Home</li>
          <li className="hover:text-blue-400 cursor-pointer">Accounts</li>
          <li className="hover:text-blue-400 cursor-pointer">Transfers</li>
          <li className="hover:text-blue-400 cursor-pointer">Support</li>
        </ul>

        {/* User Icon */}
        <div className="hidden md:flex items-center space-x-2">
          <FaUserCircle className="text-2xl" />
          <span className="text-sm">My Profile</span>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-sm font-medium">
          <div className="flex flex-col space-y-2">
            <span className="hover:text-blue-400 cursor-pointer">Home</span>
            <span className="hover:text-blue-400 cursor-pointer">Accounts</span>
            <span className="hover:text-blue-400 cursor-pointer">Transfers</span>
            <span className="hover:text-blue-400 cursor-pointer">Support</span>
          </div>
          <div className="flex items-center space-x-2 mt-4 border-t pt-4">
            <FaUserCircle className="text-2xl" />
            <span>My Profile</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
