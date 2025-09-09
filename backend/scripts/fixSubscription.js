const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function fixSubscription() {
  try {
    const userId = process.argv[2];

    if (!userId) {
      console.error("❌ Please provide a user ID as an argument:");
      console.error("   node fixSubscription.js <USER_ID>");
      return;
    }

    console.log(`🔧 Setting user ${userId} to premium subscription...`);

    // Update user to premium
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        subscription: "premium",
      },
    });

    console.log("✅ Successfully updated subscription to premium!");

    // Verify the update
    const user = await clerkClient.users.getUser(userId);
    console.log(
      `   Current subscription: ${user.publicMetadata?.subscription}`
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixSubscription();
