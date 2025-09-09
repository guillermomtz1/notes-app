const express = require("express");
const { Webhook } = require("svix");
const { createClerkClient } = require("@clerk/backend");
const { sendSuccess, sendBadRequestError } = require("../utils/response");
const { MESSAGES } = require("../constants");
const router = express.Router();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Clerk webhook handler for subscription events
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
        return sendBadRequestError(res, "Webhook secret not configured");
      }

      // Get the headers
      const svix_id = req.headers["svix-id"];
      const svix_timestamp = req.headers["svix-timestamp"];
      const svix_signature = req.headers["svix-signature"];

      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return sendBadRequestError(res, "Missing svix headers");
      }

      // Get the body
      const payload = req.body;
      const body = JSON.stringify(payload);

      // Create a new Svix instance with your secret.
      const wh = new Webhook(WEBHOOK_SECRET);

      let evt;

      // Verify the payload with the headers
      try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return sendBadRequestError(res, "Error verifying webhook");
      }

      // Handle the webhook
      const { type, data } = evt;

      console.log(`Webhook received: ${type}`);

      switch (type) {
        case "subscription.created":
        case "subscription.updated":
          await handleSubscriptionUpdate(data);
          break;
        case "subscription.deleted":
          await handleSubscriptionDeletion(data);
          break;
        default:
          console.log(`Unhandled webhook type: ${type}`);
      }

      sendSuccess(res, 200, "Webhook processed successfully");
    } catch (error) {
      console.error("Webhook error:", error);
      sendBadRequestError(res, "Webhook processing failed");
    }
  }
);

// Handle subscription creation/update
async function handleSubscriptionUpdate(subscriptionData) {
  try {
    const { user_id, status, plan } = subscriptionData;

    console.log(`Processing subscription update for user: ${user_id}`);

    // Determine subscription type based on status and plan
    let subscriptionType = "free";

    if (status === "active" && plan?.name === "Premium") {
      subscriptionType = "premium";
    } else if (status === "active" && plan?.name === "Free") {
      subscriptionType = "free";
    } else if (
      status === "canceled" ||
      status === "incomplete" ||
      status === "past_due"
    ) {
      subscriptionType = "free";
    }

    // Update user subscription status
    await updateUserSubscription(user_id, subscriptionType);

    console.log(
      `Subscription updated for user ${user_id}: ${subscriptionType}`
    );
  } catch (error) {
    console.error("Error handling subscription update:", error);
    throw error; // Re-throw to allow proper error handling
  }
}

// Handle subscription deletion
async function handleSubscriptionDeletion(subscriptionData) {
  try {
    const { user_id } = subscriptionData;
    console.log("Processing subscription deletion for user:", user_id);
    await updateUserSubscription(user_id, "free");
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}

// Update user subscription status in Clerk
async function updateUserSubscription(userId, subscriptionType) {
  try {
    // Get current user to preserve existing metadata
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        subscription: subscriptionType,
      },
    });

    console.log(`Updated user ${userId} subscription to: ${subscriptionType}`);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error; // Re-throw to allow proper error handling
  }
}

module.exports = router;
