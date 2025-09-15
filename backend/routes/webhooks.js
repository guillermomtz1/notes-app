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
    const { user_id, status, plan, current_period_end } = subscriptionData;

    console.log(`Processing subscription update for user: ${user_id}`);
    console.log(`Subscription data:`, subscriptionData);

    // Determine subscription type and create appropriate data
    let subscriptionDataObject;

    if (status === "active" && plan?.name === "Premium") {
      // New or renewed premium subscription
      subscriptionDataObject = createSubscriptionData("premium");
    } else if (status === "active" && plan?.name === "Free") {
      // Free subscription
      subscriptionDataObject = createSubscriptionData("free");
    } else if (status === "canceled") {
      // Subscription canceled - keep premium until the actual end date
      const user = await clerkClient.users.getUser(user_id);
      const currentMetadata = user.publicMetadata || {};

      // Use the actual subscription end date from the webhook data
      const actualEndDate = current_period_end
        ? new Date(current_period_end * 1000).toISOString() // Convert from Unix timestamp
        : currentMetadata.subscriptionEndDate;

      if (currentMetadata.subscription === "premium") {
        // Keep premium status but mark as canceled
        subscriptionDataObject = {
          ...currentMetadata,
          isCanceled: true,
          subscriptionEndDate: actualEndDate,
        };
      } else {
        // If user doesn't have premium metadata but subscription was cancelled,
        // they likely had premium access - set it up properly
        subscriptionDataObject = createSubscriptionData("premium", {
          isCanceled: true,
          endDate: actualEndDate,
        });
      }
    } else if (status === "incomplete" || status === "past_due") {
      // Payment failed - downgrade to free
      subscriptionDataObject = createSubscriptionData("free");
    } else {
      // Default to free
      subscriptionDataObject = createSubscriptionData("free");
    }

    // Update user subscription status
    await updateUserSubscription(user_id, subscriptionDataObject);

    console.log(
      `Subscription updated for user ${user_id}:`,
      subscriptionDataObject
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
async function updateUserSubscription(userId, subscriptionData) {
  try {
    // Get current user to preserve existing metadata
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    // Handle both old format (string) and new format (object)
    let newMetadata;
    if (typeof subscriptionData === "string") {
      // Legacy format: just subscription type
      newMetadata = {
        ...currentMetadata,
        subscription: subscriptionData,
      };
    } else {
      // New format: full subscription object
      newMetadata = {
        ...currentMetadata,
        ...subscriptionData,
      };
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: newMetadata,
    });

    console.log(`Updated user ${userId} subscription:`, newMetadata);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error; // Re-throw to allow proper error handling
  }
}

// Helper function to calculate subscription end date
const calculateSubscriptionEndDate = (startDate, durationMonths = 1) => {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  return endDate.toISOString();
};

// Helper function to create subscription data object
const createSubscriptionData = (subscriptionType, options = {}) => {
  const now = new Date().toISOString();

  if (subscriptionType === "premium") {
    return {
      subscription: "premium",
      subscriptionStartDate: options.startDate || now,
      subscriptionEndDate: options.endDate || calculateSubscriptionEndDate(now),
      isCanceled: options.isCanceled || false,
    };
  } else {
    return {
      subscription: "free",
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      isCanceled: false,
    };
  }
};

module.exports = router;
