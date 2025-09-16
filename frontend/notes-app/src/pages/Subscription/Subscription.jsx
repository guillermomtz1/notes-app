import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FaCrown, FaCheck, FaArrowLeft } from "react-icons/fa";
import SubscriptionUpgrade from "../../components/Subscription/SubscriptionUpgrade";
import { API_ENDPOINTS, apiRequest } from "../../utils/api";

const Subscription = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check subscription status (check both fields like backend)
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

  // Format subscription status for display
  const getSubscriptionStatus = () => {
    if (hasPremium && !isCanceled) {
      return "Premium Active";
    } else if (hasPremium && isCanceled && subscriptionEndDate) {
      const endDate = new Date(subscriptionEndDate);
      return `Premium (expires ${endDate.toLocaleDateString()})`;
    } else {
      return "Free";
    }
  };

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const data = await apiRequest(API_ENDPOINTS.NOTES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auto-refresh user data when component mounts (in case it's stale)
  useEffect(() => {
    const autoRefreshUserData = async () => {
      if (user && window.Clerk && window.Clerk.user) {
        try {
          await window.Clerk.user.reload();

          // Force a page reload if user data seems stale (no subscription metadata)
          setTimeout(() => {
            if (!user?.publicMetadata?.subscription && !user?.pla) {
              console.log("User data appears stale, forcing page reload...");
              window.location.reload();
            }
          }, 2000);
        } catch (error) {
          console.error("Error auto-refreshing user data:", error);
          // Force page reload on error
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    // Check if this is a refresh from cancellation
    const urlParams = new URLSearchParams(window.location.search);
    const isRefresh = urlParams.get("refresh");

    if (isRefresh) {
      // This is a refresh from cancellation, force immediate reload
      console.log(
        "Detected refresh from cancellation, forcing user data reload..."
      );
      autoRefreshUserData();

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Normal load, use small delay
      const timer = setTimeout(autoRefreshUserData, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Auto-refresh user data when page becomes visible (e.g., after returning from another tab)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        user &&
        window.Clerk &&
        window.Clerk.user
      ) {
        try {
          await window.Clerk.user.reload();
        } catch (error) {
          console.error(
            "Error auto-refreshing user data on visibility change:",
            error
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  // Auto-refresh user data when window regains focus
  useEffect(() => {
    const handleFocus = async () => {
      if (user && window.Clerk && window.Clerk.user) {
        try {
          await window.Clerk.user.reload();
        } catch (error) {
          console.error(
            "Error auto-refreshing user data on window focus:",
            error
          );
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  // Periodic refresh of user data (every 2 minutes) to catch any missed updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (user && window.Clerk && window.Clerk.user) {
        try {
          await window.Clerk.user.reload();
        } catch (error) {
          console.error("Error in periodic user data refresh:", error);
        }
      }
    }, 120000); // 2 minutes

    return () => clearInterval(intervalId);
  }, [user]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">Please Sign In</h1>
          <p className="text-text-light mb-6">
            You need to be signed in to manage your subscription.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-primary hover:text-primary-dark">
                <FaArrowLeft className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-text">Subscription</h1>
            </div>
            <div className="flex items-center space-x-2">
              <FaCrown
                className={`text-xl ${
                  hasPremium
                    ? isCanceled
                      ? "text-orange-500"
                      : "text-green-500"
                    : "text-text-muted"
                }`}
              />
              <span
                className={`font-medium ${
                  hasPremium
                    ? isCanceled
                      ? "text-orange-500"
                      : "text-green-500"
                    : "text-text-muted"
                }`}
              >
                {getSubscriptionStatus()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {hasPremium ? (
          /* Premium User View */
          <div className="space-y-8">
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`w-16 h-16 ${
                    isCanceled ? "bg-orange-500" : "bg-green-500"
                  } rounded-full flex items-center justify-center`}
                >
                  <FaCrown className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">
                    {isCanceled
                      ? "Premium Plan (Canceled)"
                      : "Premium Plan Active"}
                  </h2>
                  <p className="text-text-light">
                    {isCanceled && subscriptionEndDate ? (
                      <>
                        Your subscription is canceled but you still have access
                        until{" "}
                        <span className="font-medium">
                          {new Date(subscriptionEndDate).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      "You're enjoying all premium features"
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span className="text-text">Unlimited notes</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span className="text-text">Priority support</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span className="text-text">
                    Export to multiple formats{" "}
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                      Coming Soon
                    </span>
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span className="text-text">
                    AI Summary{" "}
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                      Coming Soon
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4">
                Manage Subscription
              </h3>
              <p className="text-text-light mb-4">
                To manage your subscription, update payment methods, or cancel,
                please visit your account settings.
              </p>
              <button
                className="btn-secondary"
                onClick={() => {
                  // Open Clerk user profile for subscription management
                  if (window.Clerk && window.Clerk.openUserProfile) {
                    window.Clerk.openUserProfile();
                  }
                }}
              >
                Manage Billing
              </button>
            </div>

          </div>
        ) : (
          /* Free User View */
          <div className="space-y-8">
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <FaCrown className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">
                    Upgrade to Premium
                  </h2>
                  <p className="text-text-light">
                    Unlock unlimited notes and premium features
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text mb-3">
                    Premium Features
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-text">Unlimited notes</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-text">Priority support</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-text">
                        Export features{" "}
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                          Coming Soon
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-text">
                        AI Summary{" "}
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full ml-2">
                          Coming Soon
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">
                      $1.99
                    </span>
                    <span className="text-text-light">/month</span>
                  </div>
                  <p className="text-text-light mb-6">
                    Start your premium subscription today
                  </p>
                  <SubscriptionUpgrade />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-3">
                Current Usage
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text">Notes created:</span>
                  <span className="text-text-muted">
                    {loading ? "Loading..." : `${notes.length} / 10`}
                  </span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      notes.length >= 10 ? "bg-red-500" : "bg-primary"
                    }`}
                    style={{
                      width: `${Math.min((notes.length / 10) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
