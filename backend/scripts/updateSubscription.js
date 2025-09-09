const { users } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk with secret key
const { createClerkClient } = require("@clerk/backend");
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Script to manually update user subscription status
async function updateUserSubscription(userId, subscriptionType) {
  try {
    console.log(`Updating user ${userId} subscription to: ${subscriptionType}`);

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        subscription: subscriptionType,
      },
    });

    console.log(
      `✅ Successfully updated user ${userId} subscription to: ${subscriptionType}`
    );
  } catch (error) {
    console.error("❌ Error updating user subscription:", error);
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];
const subscriptionType = process.argv[3] || "premium";

if (!userId) {
  console.log("Usage: node updateSubscription.js <userId> [subscriptionType]");
  console.log("Example: node updateSubscription.js user_2abc123 premium");
  process.exit(1);
}

updateUserSubscription(userId, subscriptionType);
