import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { API_ENDPOINTS } from "../../utils/api";

const SubscriptionCancel = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    setCancelError(null);
    setCancelSuccess(false);

    try {
      const token = await getToken();
      const response = await fetch(API_ENDPOINTS.ADMIN.CANCEL_SUBSCRIPTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      setCancelSuccess(true);
      setShowConfirmModal(false);

      // Force Clerk to refresh user data to get updated metadata
      if (window.Clerk && window.Clerk.user) {
        console.log("🔄 Refreshing Clerk user data after cancellation...");
        try {
          await window.Clerk.user.reload();
          console.log("✅ Clerk user data refreshed after cancellation");
        } catch (error) {
          console.error("❌ Error refreshing user data:", error);
        }
      }

      // Redirect to subscription page after 2 seconds to show the updated status
      setTimeout(() => {
        navigate("/subscription");
      }, 2000);
    } catch (error) {
      console.error("Cancel error:", error);
      setCancelError(error.message || "Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  if (cancelSuccess) {
    return (
      <div className="text-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <FaCheck className="text-orange-500 text-3xl mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-orange-800 mb-2">
          Subscription Cancelled
        </h3>
        <p className="text-orange-600 text-sm">
          Your subscription has been cancelled successfully. You still have
          premium access until the end of your billing period. Redirecting to
          subscription page...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cancelError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Cancellation Failed</h4>
            <p className="text-red-600 text-sm mt-1">{cancelError}</p>
          </div>
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Cancel Subscription
        </h3>
        <p className="text-red-700 text-sm mb-4">
          If you cancel your subscription, you'll keep premium access until the
          end of your billing period (30 days), then be reverted to the free
          plan with a 10-note limit. You can always upgrade again later.
        </p>

        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          onClick={() => setShowConfirmModal(true)}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Cancelling...
            </>
          ) : (
            "Cancel Subscription"
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-2xl text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Cancel Subscription?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your premium subscription?
                You'll keep premium access until the end of your billing period
                (30 days), then be reverted to the free plan (10 notes limit).
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isCancelling}
                >
                  Keep Premium
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCancel;
