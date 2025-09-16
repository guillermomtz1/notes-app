const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Script to manually fix a user's subscription status
async function fixUserSubscription(userId, subscriptionType = "premium") {
  try {
    console.log(`🔧 Fixing subscription for user: ${userId}`);
    console.log(`📝 Setting subscription to: ${subscriptionType}`);

    // Initialize Clerk client
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!process.env.CLERK_SECRET_KEY) {
      console.error("❌ Missing CLERK_SECRET_KEY environment variable");
      return;
    }

    // Get current user data
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    console.log("📊 Current metadata:", currentMetadata);

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

    // Update user metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: subscriptionData,
    });

    console.log("✅ Successfully updated user subscription!");
    console.log("📋 New metadata:", subscriptionData);

    // Verify the update
    const updatedUser = await clerkClient.users.getUser(userId);
    console.log(
      "🔍 Verification - Updated metadata:",
      updatedUser.publicMetadata
    );
  } catch (error) {
    console.error("❌ Error fixing subscription:", error.message);
    if (error.errors) {
      console.error("Detailed errors:", error.errors);
    }
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];
const subscriptionType = process.argv[3] || "premium";

if (!userId) {
  console.log("❌ Please provide a user ID");
  console.log(
    "Usage: node fixUserSubscription.js <user_id> [subscription_type]"
  );
  console.log(
    "Example: node fixUserSubscription.js user_32ReQYuvKnwwylfaG7C3jblyayM premium"
  );
  process.exit(1);
}

if (!["free", "premium"].includes(subscriptionType)) {
  console.log("❌ Invalid subscription type. Use 'free' or 'premium'");
  process.exit(1);
}

fixUserSubscription(userId, subscriptionType);
