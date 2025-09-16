import React from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaCrown, FaStar } from "react-icons/fa";
import { useAuth, useClerk } from "@clerk/clerk-react";

const PricingSection = () => {
  const { user } = useAuth();
  const { openSignUp } = useClerk();

  const handleSubscribe = async (planId) => {
    if (!user) {
      // Open Clerk's signup modal if not logged in
      openSignUp();
      return;
    }

    try {
      // This will open Clerk's billing modal for the specific plan
      await user.createSubscription({ planId });
    } catch (error) {
      console.error("Subscription error:", error);
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
            Get started with a 30-day free trial
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          <div className="card relative border-2 border-primary max-w-md w-full">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                <FaStar className="mr-1" />
                30-Day Free Trial!
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaCrown className="text-primary mr-2" />
                <h3 className="text-2xl font-bold text-text">Premium</h3>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl text-text-light line-through">
                    $1.99
                  </span>
                  <span className="text-4xl font-bold text-primary">$0</span>
                  <span className="text-text-light">/month</span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  30-day free trial! Then $1.99/month
                </div>
              </div>
              <p className="text-text-light mb-8">
                Everything you need to organize your notes
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
                <span className="text-text">Advanced tagging system</span>
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
                <span className="text-text">
                  AI Summary{" "}
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                    Coming Soon
                  </span>
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleSubscribe("premium")}
              className="w-full btn-primary text-center block py-3"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-text-light mb-4">
            Start your free trial today - no credit card required
          </p>
          <p className="text-sm text-text-muted">
            Cancel anytime. No hidden fees. Secure payment processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
