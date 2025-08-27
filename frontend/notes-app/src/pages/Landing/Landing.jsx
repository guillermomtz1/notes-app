import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaPenFancy,
  FaJournalWhills,
  FaShieldAlt,
  FaSync,
  FaMobile,
} from "react-icons/fa";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky-navbar">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <FaBookOpen className="text-black text-lg" />
              </div>
              <span className="text-xl font-bold text-text">BragJournal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-text-light hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary px-6 py-2 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-gradient py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-text mb-6">
              Organize Your
              <span className="text-primary"> Career Acomplishments</span>
            </h1>
            <p className="text-xl text-text-light mb-8 leading-relaxed">
              A beautiful, secure, and intuitive journal app that helps you
              capture ideas, organize your thoughts, and stay productive across
              all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary px-8 py-4 text-lg font-semibold transform hover:scale-105 whitespace-nowrap text-center"
              >
                Start Writing Today
              </Link>
              <Link
                to="/login"
                className="btn-secondary px-8 py-4 text-lg font-semibold whitespace-nowrap text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">
              Why Choose BragJournal?
            </h2>
            <p className="text-xl text-text-light">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card hover:bg-surface-light transition-all duration-300 hover:glow-effect">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPenFancy className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2 text-center">
                Beautiful Notes
              </h3>
              <p className="text-text-light text-center">
                Create and organize notes with a clean, intuitive interface
              </p>
            </div>

            <div className="card hover:bg-surface-light transition-all duration-300 hover:glow-effect">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2 text-center">
                Secure & Private
              </h3>
              <p className="text-text-light text-center">
                Your notes are encrypted and protected with enterprise-grade
                security
              </p>
            </div>

            <div className="card hover:bg-surface-light transition-all duration-300 hover:glow-effect">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSync className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2 text-center">
                Real-time Sync
              </h3>
              <p className="text-text-light text-center">
                Access your notes anywhere with automatic cloud synchronization
              </p>
            </div>

            <div className="card hover:bg-surface-light transition-all duration-300 hover:glow-effect">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMobile className="text-2xl text-black" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2 text-center">
                Cross-platform
              </h3>
              <p className="text-text-light text-center">
                Works seamlessly across desktop, tablet, and mobile devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="futuristic-gradient rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-black mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              Start organizing your accomplishments today.
            </p>
            <Link
              to="/signup"
              className="bg-black text-primary hover:bg-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FaBookOpen className="text-black text-sm" />
              </div>
              <span className="text-lg font-bold text-text">BragJournal</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <Link
                to="/privacy-policy"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <div className="text-text-muted">
                © 2024 BragJournal. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
