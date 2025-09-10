import React from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { FaCheck, FaCrown, FaStar } from "react-icons/fa";

const SubscriptionPricing = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  // Check if user has premium subscription (check both fields like backend)
  const hasPremiumFromMetadata =
    user?.publicMetadata?.subscription === "premium";
  const hasPremiumFromPla = user?.pla === "u:premium";
  const hasPremium = hasPremiumFromMetadata || hasPremiumFromPla;

  const handleUpgrade = () => {
    if (!isSignedIn) {
      // Redirect to signup if not signed in
      window.location.href = "/signup";
      return;
    }

    // If signed in, redirect to subscription management
    // This will be handled by Clerk's subscription flow
    window.location.href = "/subscription";
  };

  const handleGetStarted = () => {
    if (!isSignedIn) {
      window.location.href = "/signup";
    } else {
      // User is signed in, redirect to home
      window.location.href = "/";
    }
  };

  return (
    <div className="py-20 bg-surface-light">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-text-light">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className={`card relative ${hasPremium ? "opacity-75" : ""}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-text mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text">$0</span>
                <span className="text-text-light">/month</span>
              </div>
              <p className="text-text-light mb-8">
                Perfect for getting started with Braggy
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Create and manage notes</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Basic tagging system</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Cloud synchronization</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Mobile access</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Up to 10 notes</span>
              </div>
            </div>

            {/* CTA Button */}
            {hasPremium ? (
              <div className="w-full btn-secondary text-center block py-3 opacity-50 cursor-not-allowed">
                Current Plan
              </div>
            ) : (
              <button
                onClick={handleGetStarted}
                className="w-full btn-secondary text-center block py-3"
              >
                {isSignedIn ? "Current Plan" : "Get Started Free"}
              </button>
            )}
          </div>

          {/* Premium Plan */}
          <div
            className={`card relative border-2 ${
              hasPremium ? "border-green-500" : "border-primary"
            }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div
                className={`${
                  hasPremium ? "bg-green-500" : "bg-primary"
                } text-white px-4 py-2 rounded-full text-sm font-medium flex items-center`}
              >
                <FaStar className="mr-1" />
                {hasPremium ? "Active Plan" : "Most Popular"}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaCrown
                  className={`${
                    hasPremium ? "text-green-500" : "text-primary"
                  } mr-2`}
                />
                <h3 className="text-2xl font-bold text-text">Premium</h3>
              </div>
              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${
                    hasPremium ? "text-green-500" : "text-primary"
                  }`}
                >
                  $1.99
                </span>
                <span className="text-text-light">/month</span>
              </div>
              <p className="text-text-light mb-8">
                For power users who need more features
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Everything in Free</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Unlimited notes</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">
                  Export to multiple formats{" "}
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                    Coming Soon
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">Priority support</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                <span className="text-text">
                  AI Summary{" "}
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                    Coming Soon
                  </span>
                </span>
              </div>
            </div>

            {/* CTA Button */}
            {hasPremium ? (
              <div className="w-full bg-green-500 text-white text-center block py-3 rounded-lg font-medium">
                ✓ Premium Active
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full btn-primary text-center block py-3"
              >
                {isSignedIn ? "Upgrade to Premium" : "Start Premium Plan"}
              </button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-text-light mb-4">
            Upgrade to Premium for unlimited notes and premium features
          </p>
          <p className="text-sm text-text-muted">
            Cancel anytime. No hidden fees. Secure payment processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPricing;
