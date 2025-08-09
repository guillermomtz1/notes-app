import React from "react";
import { Link } from "react-router-dom";
import { FaStickyNote } from "react-icons/fa";
import ProfileInfo from "../Cards/ProfileInfo";

const Navbar = () => {
  return (
    <nav className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FaStickyNote className="text-black text-lg" />
            </div>
            <span className="text-xl font-bold text-text">Notes App</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-text-light hover:text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-text-light hover:text-primary transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-text-light hover:text-primary transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-text-light hover:text-primary transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Profile Info */}
          <div className="w-32"></div>
          <ProfileInfo />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
