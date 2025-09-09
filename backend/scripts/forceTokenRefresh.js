const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Force update subscription and invalidate all sessions
async function forceTokenRefresh() {
  try {
    console.log("🔄 Force updating subscription and invalidating sessions...");

    // Get all users
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });

    // Update both users to premium and invalidate sessions
    for (const user of users.data) {
      console.log(
        `Updating user ${user.id} (${user.emailAddresses[0]?.emailAddress})...`
      );

      // Update subscription
      await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
          subscription: "premium",
        },
      });

      // Invalidate all sessions to force token refresh
      const sessions = await clerkClient.sessions.getSessionList({
        userId: user.id,
      });

      for (const session of sessions.data) {
        await clerkClient.sessions.revokeSession(session.id);
        console.log(`  ✅ Revoked session ${session.id}`);
      }

      console.log(
        `✅ Updated user ${user.id} to premium and invalidated sessions`
      );
    }

    console.log("\n🎉 All users updated and sessions invalidated!");
    console.log("\n📋 Next steps:");
    console.log("1. Go to your frontend app");
    console.log("2. You should be automatically signed out");
    console.log("3. Sign back in");
    console.log("4. Try creating the 11th note");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the script
forceTokenRefresh();
