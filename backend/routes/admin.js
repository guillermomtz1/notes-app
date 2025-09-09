const express = require("express");
const { createClerkClient } = require("@clerk/backend");
const { authenticateUser } = require("../middleware/auth");
const { sendSuccess, sendValidationError } = require("../utils/response");
const { MESSAGES } = require("../constants");
const router = express.Router();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Note: Manual subscription update route removed - now handled automatically via webhooks

// Temporary route to check user subscription status (for debugging)
router.get("/check-subscription", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.sub;
    const user = req.user;

    console.log(`Checking subscription for user: ${userId}`);

    sendSuccess(res, 200, "Subscription status retrieved", {
      userId,
      subscription: user?.publicMetadata?.subscription || "free",
      hasPremium: user?.publicMetadata?.subscription === "premium",
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    sendValidationError(res, "Failed to check subscription status");
  }
});

// Temporary route to manually update subscription (for testing)
router.post("/update-subscription", authenticateUser, async (req, res) => {
  try {
    const { subscriptionType } = req.body;
    const userId = req.user.sub;

    if (!subscriptionType || !["free", "premium"].includes(subscriptionType)) {
      return sendValidationError(
        res,
        "Invalid subscription type. Use 'free' or 'premium'"
      );
    }

    // Get current user to preserve existing metadata
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        subscription: subscriptionType,
      },
    });

    console.log(`Updated user ${userId} subscription to: ${subscriptionType}`);

    sendSuccess(res, 200, `Subscription updated to ${subscriptionType}`, {
      userId,
      subscription: subscriptionType,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    sendValidationError(res, "Failed to update subscription");
  }
});

// Cancel subscription endpoint
router.post("/cancel-subscription", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.sub;

    // Get current user to preserve existing metadata
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    // Update user metadata to free
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        subscription: "free",
      },
    });

    console.log(`User ${userId} cancelled subscription`);

    sendSuccess(res, 200, "Subscription cancelled successfully", {
      userId,
      subscription: "free",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    sendValidationError(res, "Failed to cancel subscription");
  }
});

module.exports = router;
