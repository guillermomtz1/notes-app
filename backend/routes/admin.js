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

    // Get fresh user data from Clerk
    const freshUser = await clerkClient.users.getUser(userId);
    const metadata = freshUser.publicMetadata || {};

    sendSuccess(res, 200, "Subscription status retrieved", {
      userId,
      subscription: metadata.subscription || "free",
      hasPremium: metadata.subscription === "premium",
      isCanceled: metadata.isCanceled || false,
      subscriptionEndDate: metadata.subscriptionEndDate || null,
      pla: freshUser.pla || null,
      fullMetadata: metadata,
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

    // Create subscription data based on type
    let subscriptionData;
    const now = new Date().toISOString();

    if (subscriptionType === "premium") {
      // Calculate end date (30 days from now for monthly subscription)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      subscriptionData = {
        ...currentMetadata,
        subscription: "premium",
        subscriptionStartDate: now,
        subscriptionEndDate: endDate.toISOString(),
        isCanceled: false,
      };
    } else {
      subscriptionData = {
        ...currentMetadata,
        subscription: "free",
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        isCanceled: false,
      };
    }

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: subscriptionData,
    });

    console.log(`Updated user ${userId} subscription to: ${subscriptionType}`);
    console.log(`Subscription data:`, subscriptionData);

    sendSuccess(res, 200, `Subscription updated to ${subscriptionType}`, {
      userId,
      subscription: subscriptionType,
      subscriptionData,
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

    // Calculate end of billing period (30 days from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

    // Mark subscription as canceled but keep premium access until end of period
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        subscription: "premium", // Keep premium access
        isCanceled: true, // Mark as canceled
        subscriptionEndDate: subscriptionEndDate.toISOString(), // Set end date
      },
    });

    console.log(
      `User ${userId} cancelled subscription, access until ${subscriptionEndDate.toISOString()}`
    );

    sendSuccess(res, 200, "Subscription cancelled successfully", {
      userId,
      subscription: "premium",
      isCanceled: true,
      subscriptionEndDate: subscriptionEndDate.toISOString(),
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    sendValidationError(res, "Failed to cancel subscription");
  }
});

module.exports = router;
