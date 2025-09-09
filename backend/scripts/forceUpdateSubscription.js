const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Force update subscription and invalidate cache
async function forceUpdateSubscription() {
  try {
    console.log("🔄 Force updating subscription status...");

    // Get all users
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });

    // Update both users to premium
    for (const user of users.data) {
      console.log(
        `Updating user ${user.id} (${user.emailAddresses[0]?.emailAddress})...`
      );

      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
          subscription: "premium",
        },
      });

      console.log(`✅ Updated user ${user.id} to premium`);
    }

    console.log("\n🎉 All users updated to premium!");
    console.log("\n📋 Next steps:");
    console.log("1. Go to your frontend app");
    console.log("2. Open Developer Console (F12)");
    console.log("3. Type: window.Clerk.user.reload()");
    console.log("4. Press Enter");
    console.log("5. Try creating the 11th note");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
forceUpdateSubscription();
