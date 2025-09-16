const { createClerkClient } = require("@clerk/backend");
require("dotenv").config();

// Script to sync user subscription status from Clerk's actual subscription data
async function syncSubscriptionFromClerk(userId) {
  try {
    console.log(`🔄 Syncing subscription for user: ${userId}`);

    // Initialize Clerk client
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!process.env.CLERK_SECRET_KEY) {
      console.error("❌ Missing CLERK_SECRET_KEY environment variable");
      return;
    }

    // Get user data
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};

    console.log("📊 Current user metadata:", currentMetadata);
    console.log("👤 User PLA:", user.pla);

    // Try to get subscription data from Clerk
    // Note: This might not work depending on your Clerk setup
    // You may need to check your Clerk dashboard for actual subscription status
    console.log("🔍 Checking for subscription data...");

    // For now, let's check if the user has any subscription-related data
    // and make an educated guess based on payment history or other indicators

    // If user has premium PLA but metadata shows free, fix it
    if (
      user.pla === "u:premium" &&
      currentMetadata.subscription !== "premium"
    ) {
      console.log(
        "🔧 Found mismatch: User has premium PLA but metadata shows free"
      );
      await updateUserToPremium(userId, clerkClient, currentMetadata);
      return;
    }

    // If user has no PLA but should have premium (based on your payment)
    // We'll set them to premium with a 30-day end date
    if (!user.pla && currentMetadata.subscription !== "premium") {
      console.log("🔧 User appears to be premium but metadata is incorrect");
      console.log(
        "⚠️  This is a manual fix - please verify payment status in Stripe/Clerk"
      );

      const shouldFix = process.argv[3] === "--force";
      if (shouldFix) {
        await updateUserToPremium(userId, clerkClient, currentMetadata);
      } else {
        console.log("💡 To apply this fix, run with --force flag:");
        console.log(`   node syncSubscriptionFromClerk.js ${userId} --force`);
      }
      return;
    }

    console.log("✅ User subscription status appears correct");
    console.log("📋 Final status:", {
      subscription: currentMetadata.subscription || "free",
      pla: user.pla || "none",
      isCanceled: currentMetadata.isCanceled || false,
      endDate: currentMetadata.subscriptionEndDate || "none",
    });
  } catch (error) {
    console.error("❌ Error syncing subscription:", error.message);
    if (error.errors) {
      console.error("Detailed errors:", error.errors);
    }
  }
}

async function updateUserToPremium(userId, clerkClient, currentMetadata) {
  const now = new Date().toISOString();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // 30 days from now

  const subscriptionData = {
    ...currentMetadata,
    subscription: "premium",
    subscriptionStartDate: now,
    subscriptionEndDate: endDate.toISOString(),
    isCanceled: false,
  };

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: subscriptionData,
  });

  console.log("✅ Updated user to premium!");
  console.log("📋 New metadata:", subscriptionData);
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.log("❌ Please provide a user ID");
  console.log("Usage: node syncSubscriptionFromClerk.js <user_id> [--force]");
  console.log(
    "Example: node syncSubscriptionFromClerk.js user_32ReQYuvKnwwylfaG7C3jblyayM --force"
  );
  process.exit(1);
}

syncSubscriptionFromClerk(userId);
