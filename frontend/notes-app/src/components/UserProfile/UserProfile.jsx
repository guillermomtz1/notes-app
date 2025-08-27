import React from "react";
import { useAuth } from "@clerk/clerk-react";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center text-text-light">Loading user profile...</div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 max-w-md mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-6">
        {/* Profile Image */}
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={`${user.firstName || "User"} ${user.lastName || ""}`}
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"
          />
        ) : (
          <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary flex items-center justify-center text-2xl font-bold text-black">
            {user.firstName?.[0] ||
              user.emailAddresses?.[0]?.emailAddress?.[0] ||
              "U"}
          </div>
        )}

        {/* User Name */}
        <h2 className="text-xl font-bold text-text">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || "User"}
        </h2>

        {/* Email */}
        <p className="text-text-light text-sm">
          {user.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        {/* Account Created */}
        <div className="flex justify-between items-center">
          <span className="text-text-light">Member since:</span>
          <span className="text-text">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Last Sign In */}
        <div className="flex justify-between items-center">
          <span className="text-text-light">Last sign in:</span>
          <span className="text-text">
            {new Date(user.lastSignInAt).toLocaleDateString()}
          </span>
        </div>

        {/* Email Verification */}
        <div className="flex justify-between items-center">
          <span className="text-text-light">Email verified:</span>
          <span
            className={`text-sm ${
              user.emailAddresses?.[0]?.verification?.status === "verified"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {user.emailAddresses?.[0]?.verification?.status === "verified"
              ? "✓ Verified"
              : "✗ Not verified"}
          </span>
        </div>

        {/* External Accounts */}
        {user.externalAccounts && user.externalAccounts.length > 0 && (
          <div>
            <span className="text-text-light text-sm">Connected accounts:</span>
            <div className="mt-2 space-y-1">
              {user.externalAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <span className="text-text-light">{account.provider}:</span>
                  <span className="text-text">{account.emailAddress}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full bg-primary hover:bg-primary-dark text-black font-medium py-2 px-4 rounded-lg transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
