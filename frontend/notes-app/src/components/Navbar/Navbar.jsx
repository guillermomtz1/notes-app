import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookOpen, FaPenFancy, FaJournalWhills } from "react-icons/fa";
import { useAuth, SignOutButton } from "@clerk/clerk-react";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user } = useAuth();
  const Navigate = useNavigate;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onClearSearch = () => {
    onSearchChange("");
  };

  return (
    <nav className="sticky-navbar shadow-sm border-b border-border">
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
                onSearchChange(target.value);
              }}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Profile Info */}
          <div className="w-32"></div>

          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 text-text-light hover:text-primary transition-colors"
            >
              {/* User Profile Image */}
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.firstName || "User"}
                  className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-black">
                  {user?.firstName?.[0] ||
                    user?.emailAddresses?.[0]?.emailAddress?.[0] ||
                    "U"}
                </div>
              )}

              {/* User Name */}
              <span className="text-sm">
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-text-light">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>

                <div className="p-1">
                  <SignOutButton>
                    <button className="w-full text-left px-3 py-2 text-sm text-text-light hover:text-primary hover:bg-surface-light rounded transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
