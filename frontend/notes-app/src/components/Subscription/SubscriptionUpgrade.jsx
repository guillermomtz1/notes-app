import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const SubscriptionUpgrade = () => {
  const { isSignedIn } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  // Handle subscription upgrade
  const handleUpgrade = async () => {
    if (!isSignedIn) {
      setUpgradeError("Please sign in to upgrade your subscription");
      return;
    }

    setIsUpgrading(true);
    setUpgradeError(null);
    setUpgradeSuccess(false);

    try {
      // Use Clerk's built-in subscription management
      if (window.Clerk && window.Clerk.openSubscriptionModal) {
        // Clerk's built-in subscription modal
        await window.Clerk.openSubscriptionModal();
        setUpgradeSuccess(true);
        return;
      }

      // Fallback: Redirect to Clerk's subscription management
      if (window.Clerk && window.Clerk.openUserProfile) {
        // Open user profile where they can manage subscriptions
        await window.Clerk.openUserProfile();
        return;
      }

      // Final fallback: Show instructions
      throw new Error(
        "Please configure your subscription plans in the Clerk dashboard first. Go to Plans section and create Free ($0) and Premium ($1.99) plans."
      );
    } catch (error) {
      console.error("Upgrade error:", error);
      setUpgradeError(
        error.message || "Failed to start upgrade process. Please try again."
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  if (upgradeSuccess) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <FaCheck className="text-green-500 text-3xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Upgrade Initiated!
        </h3>
        <p className="text-green-600 text-sm">
          You'll be redirected to complete your payment. Once confirmed, you'll
          have access to all premium features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upgradeError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Upgrade Failed</h4>
            <p className="text-red-600 text-sm mt-1">{upgradeError}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          className="btn-primary w-full flex items-center justify-center"
          onClick={handleUpgrade}
          disabled={isUpgrading}
        >
          {isUpgrading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Start Premium - $1.99/month"
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-text-muted">
            🔒 Secure payment processing • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;
