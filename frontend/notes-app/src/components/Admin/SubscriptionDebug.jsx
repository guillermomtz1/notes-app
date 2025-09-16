import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { API_ENDPOINTS } from "../../utils/api";

const SubscriptionDebug = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const checkSubscriptionStatus = async () => {
    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.ADMIN.CHECK_SUBSCRIPTION, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check subscription status");
      }

      const data = await response.json();
      setSubscriptionStatus(data.data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setUpdateError(error.message);
    }
  };

  const handleUpdateSubscription = async (subscriptionType) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.ADMIN.UPDATE_SUBSCRIPTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionType }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      setUpdateSuccess(true);

      // Force Clerk to refresh user data
      if (window.Clerk && window.Clerk.user) {
        console.log("🔄 Refreshing Clerk user data...");
        await window.Clerk.user.reload();
        console.log("✅ Clerk user data refreshed");
      }

      // Refresh the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      setUpdateError(error.message || "Failed to update subscription");
    } finally {
      setIsUpdating(false);
    }
  };

  // Check both possible fields for subscription status (same as backend)
  const hasPremiumFromMetadata = (() => {
    const metadata = user?.publicMetadata;
    if (metadata?.subscription === "premium") {
      // Check if subscription has expired
      if (metadata.subscriptionEndDate) {
        const endDate = new Date(metadata.subscriptionEndDate);
        const now = new Date();
        return now < endDate; // Still within paid period
      }
      // If no end date, assume it's still valid (legacy support)
      return true;
    }
    return false;
  })();

  const hasPremiumFromPla = user?.pla === "u:premium";
  const hasPremium = hasPremiumFromMetadata || hasPremiumFromPla;

  // Get subscription details for display
  const subscriptionDetails = user?.publicMetadata || {};
  const isCanceled = subscriptionDetails.isCanceled || false;
  const subscriptionEndDate = subscriptionDetails.subscriptionEndDate;

  const currentSubscription = hasPremium
    ? isCanceled
      ? `premium (canceled, expires ${
          subscriptionEndDate
            ? new Date(subscriptionEndDate).toLocaleDateString()
            : "unknown"
        })`
      : "premium"
    : user?.publicMetadata?.subscription || "free";

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <FaInfoCircle className="text-blue-500" />
          <h3 className="text-lg font-semibold text-blue-800">
            Subscription Debug Panel
          </h3>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Current Status:</strong> {currentSubscription}
          </p>
          <p>
            <strong>Has Premium:</strong> {hasPremium ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Canceled:</strong> {isCanceled ? "Yes" : "No"}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {subscriptionEndDate
              ? new Date(subscriptionEndDate).toLocaleString()
              : "Not set"}
          </p>
          <p>
            <strong>From Metadata:</strong>{" "}
            {user?.publicMetadata?.subscription || "undefined"}
          </p>
          <p>
            <strong>From PLA:</strong> {user?.pla || "undefined"}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id}
          </p>
        </div>

        <div className="mt-3 space-x-2">
          <button
            onClick={checkSubscriptionStatus}
            className="btn-secondary text-sm"
          >
            Check Server Status
          </button>
          <button
            onClick={async () => {
              if (window.Clerk && window.Clerk.user) {
                console.log("🔄 Manually refreshing Clerk user data...");
                await window.Clerk.user.reload();
                console.log("✅ Clerk user data refreshed");
                window.location.reload();
              }
            }}
            className="btn-primary text-sm"
          >
            Refresh User Data
          </button>
        </div>
      </div>

      {subscriptionStatus && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Server Response:</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(subscriptionStatus, null, 2)}
          </pre>
        </div>
      )}

      {updateError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-600 text-sm mt-1">{updateError}</p>
          </div>
        </div>
      )}

      {updateSuccess && (
        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
          <FaCheck className="text-green-500 text-3xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Subscription Updated!
          </h3>
          <p className="text-green-600 text-sm">
            Your subscription status has been updated. The page will refresh
            automatically.
          </p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Manual Subscription Update
        </h3>
        <p className="text-yellow-700 text-sm mb-4">
          Use these buttons to manually test subscription status changes.
        </p>

        <div className="space-y-2">
          <button
            className="w-full btn-primary flex items-center justify-center"
            onClick={() => handleUpdateSubscription("premium")}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Set to Premium"
            )}
          </button>

          <button
            className="w-full btn-secondary flex items-center justify-center"
            onClick={() => handleUpdateSubscription("free")}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Set to Free"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDebug;
