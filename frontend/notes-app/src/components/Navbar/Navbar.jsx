import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaPenFancy,
  FaJournalWhills,
  FaStar,
  FaCircle,
  FaHeart,
} from "react-icons/fa";
import { useAuth, SignOutButton, useUser } from "@clerk/clerk-react";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import braggyLogo from "../../assets/braggy-logo.png";

const Navbar = ({ searchQuery, onSearchChange }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, isSignedIn } = useAuth();
  const { user: userFromHook } = useUser();
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

          {/* Profile Info */}
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 text-text-light hover:text-primary transition-colors cursor-pointer"
            >
              {/* User Profile Image */}
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.firstName || "User"}
                  className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white">
                  {(userFromHook || user)?.firstName?.[0] ||
                    (
                      userFromHook || user
                    )?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                    (isSignedIn ? "S" : "U")}
                </div>
              )}

              {/* User Name */}
              <span className="text-sm">
                {(userFromHook || user)?.firstName ||
                  (userFromHook || user)?.emailAddresses?.[0]?.emailAddress}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text break-words">
                    {(userFromHook || user)?.firstName &&
                    (userFromHook || user)?.lastName &&
                    (userFromHook || user).firstName.trim() &&
                    (userFromHook || user).lastName.trim()
                      ? `${(userFromHook || user).firstName} ${
                          (userFromHook || user).lastName
                        }`
                      : ((userFromHook || user)?.firstName &&
                          (userFromHook || user).firstName.trim()) ||
                        ((userFromHook || user)?.fullName &&
                          (userFromHook || user).fullName.trim()) ||
                        ((userFromHook || user)?.username &&
                          (userFromHook || user).username.trim()) ||
                        ((userFromHook || user)?.emailAddresses?.[0]
                          ?.emailAddress &&
                        (
                          userFromHook || user
                        ).emailAddresses[0].emailAddress.trim()
                          ? (
                              userFromHook || user
                            ).emailAddresses[0].emailAddress.split("@")[0]
                          : isSignedIn
                          ? "Signed In User"
                          : "User")}
                  </p>
                  <p className="text-xs text-text-light">
                    {(userFromHook || user)?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>

                <div className="p-1">
                  <Link
                    to="/subscription"
                    className="w-full text-left px-3 py-2 text-sm text-text-light hover:text-primary hover:bg-surface-light rounded transition-colors cursor-pointer block"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Subscription & Billing
                  </Link>
                  <SignOutButton>
                    <button className="w-full text-left px-3 py-2 text-sm text-text-light hover:text-primary hover:bg-surface-light rounded transition-colors cursor-pointer">
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
