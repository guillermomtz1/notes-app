import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen, FaPenFancy, FaJournalWhills } from "react-icons/fa";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const Navigate = useNavigate;

  const onLogout = () => {
    Navigate("/login");
  };

  const handleSearch = () => {};

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <nav className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <FaBookOpen className="text-black text-lg" />
            </div>
            <span className="text-xl font-bold text-text">BragJournal</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                setSearchQuery(target.value);
              }}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
            {/* <Link
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
            </Link> */}
          </div>

          {/* Profile Info */}
          <div className="w-32"></div>

          <ProfileInfo onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
