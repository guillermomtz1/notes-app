const fetch = require("node-fetch");
require("dotenv").config();

// Script to manually update subscription via admin API
async function updateSubscriptionViaAPI(subscriptionType) {
  try {
    console.log(`Updating subscription to: ${subscriptionType}`);

    // You'll need to get your JWT token from your browser's developer tools
    // Go to your app, open developer tools, and look for the Authorization header in network requests
    const token = process.env.MANUAL_UPDATE_TOKEN || "YOUR_JWT_TOKEN_HERE";

    if (token === "YOUR_JWT_TOKEN_HERE") {
      console.log("❌ Please set MANUAL_UPDATE_TOKEN in your .env file");
      console.log("To get your token:");
      console.log("1. Open your app in browser");
      console.log("2. Open Developer Tools (F12)");
      console.log("3. Go to Network tab");
      console.log("4. Make any API request");
      console.log("5. Look for Authorization header");
      console.log('6. Copy the Bearer token (without "Bearer ")');
      console.log(
        "7. Add MANUAL_UPDATE_TOKEN=your_token_here to your .env file"
      );
      return;
    }

    const response = await fetch(
      "http://localhost:8000/api/admin/update-subscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriptionType: subscriptionType,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Successfully updated subscription:", result);
  } catch (error) {
    console.error("❌ Error updating subscription:", error.message);
  }
}

// Get subscription type from command line arguments
const subscriptionType = process.argv[2] || "premium";

if (!["free", "premium"].includes(subscriptionType)) {
  console.error('❌ Invalid subscription type. Use "free" or "premium"');
  process.exit(1);
}

updateSubscriptionViaAPI(subscriptionType);
