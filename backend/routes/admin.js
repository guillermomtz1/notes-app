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

// Cancel subscription endpoint
router.post("/cancel-subscription", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.sub;

    // Update user metadata to free
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        subscription: "free",
      },
    });

    console.log(`User ${userId} cancelled their subscription`);

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
