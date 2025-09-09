const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Script to help you find and update your subscription
async function findAndUpdateMySubscription() {
  try {
    console.log("🔍 Finding your user account...");

    // Get all users (this will help you find your account)
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });

    console.log("\n📋 Found users:");
    users.data.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(
        `   Email: ${user.emailAddresses[0]?.emailAddress || "No email"}`
      );
      console.log(
        `   Subscription: ${user.publicMetadata?.subscription || "free"}`
      );
      console.log(
        `   Created: ${new Date(user.createdAt).toLocaleDateString()}`
      );
      console.log("   ---");
    });

    console.log("\n💡 To update your subscription:");
    console.log("1. Find your user ID from the list above");
    console.log(
      "2. Run: node scripts/updateSubscription.js YOUR_USER_ID premium"
    );
    console.log("\nExample:");
    console.log("node scripts/updateSubscription.js user_2abc123def premium");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
findAndUpdateMySubscription();
