import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaPenFancy,
  FaJournalWhills,
  FaStar,
  FaCircle,
  FaHeart,
} from "react-icons/fa";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import SearchBar from "../SearchBar/SearchBar";
import braggyLogo from "../../assets/braggy-logo.png";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const onClearSearch = () => {
    onSearchChange("");
  };

  return (
    <nav className="sticky-navbar shadow-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={braggyLogo}
              alt="Braggy Logo"
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold text-text">Braggy</span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => {
                onSearchChange(target.value);
              }}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Authentication */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
