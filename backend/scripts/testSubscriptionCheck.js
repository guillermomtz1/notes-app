const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function testSubscriptionCheck() {
  try {
    const userId = process.argv[2];

    if (!userId) {
      console.error("❌ Please provide a user ID as an argument:");
      console.error("   node testSubscriptionCheck.js <USER_ID>");
      return;
    }

    console.log(`🔍 Testing subscription check for user: ${userId}\n`);

    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Simulate the same check that happens in the middleware
    const hasPremium = user?.publicMetadata?.subscription === "premium";

    console.log("🔐 Subscription Check Results:");
    console.log(`   User ID: ${user.id}`);
    console.log(`   Subscription: ${user.publicMetadata?.subscription}`);
    console.log(`   Has Premium: ${hasPremium}`);
    console.log(
      `   Public Metadata:`,
      JSON.stringify(user.publicMetadata, null, 2)
    );

    if (hasPremium) {
      console.log("\n✅ User should be able to create unlimited notes");
      console.log("   The 403 error is likely due to an old JWT token");
      console.log(
        "   Solution: Sign out and sign back in to get a fresh token"
      );
    } else {
      console.log("\n❌ User is not marked as premium");
      console.log("   This would cause the 403 error");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testSubscriptionCheck();
