const { sendForbiddenError } = require("../utils/response");
const { MESSAGES } = require("../constants");

// Helper function to check if user has premium subscription
const hasPremiumSubscription = (user) => {
  const metadata = user?.publicMetadata;

  // Check PLA field (legacy support)
  const hasPremiumFromPla = user?.pla === "u:premium";

  // Check metadata subscription status
  if (metadata?.subscription === "premium") {
    // Check if subscription has expired
    if (metadata.subscriptionEndDate) {
      const endDate = new Date(metadata.subscriptionEndDate);
      const now = new Date();
      return now < endDate; // Still within paid period
    }
    // If no end date, assume it's still valid (legacy support)
    return true;
  }

  // Fallback to PLA check
  return hasPremiumFromPla;
};

// Check if user has premium subscription
const checkPremiumSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    const hasPremium = hasPremiumSubscription(user);

    if (!hasPremium) {
      return sendForbiddenError(
        res,
        "Premium subscription required for this feature"
      );
    }

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return sendForbiddenError(res, "Error checking subscription status");
  }
};

// Check note limit for free users
const checkNoteLimit = async (req, res, next) => {
  try {
    const user = req.user;
    const hasPremium = hasPremiumSubscription(user);

    // Log subscription check for monitoring
    console.log(
      `Subscription check for user ${user?.sub}: ${
        hasPremium ? "premium" : "free"
      }`
    );

    if (hasPremium) {
      // Premium users have unlimited notes
      console.log("✅ Premium user - allowing note creation");
      return next();
    }

    // For free users, check note count
    const Note = require("../models/note");
    const noteCount = await Note.countDocuments({ clerkUserId: user.sub });

    if (noteCount >= 10) {
      return sendForbiddenError(
        res,
        "Note limit reached. Upgrade to Premium for unlimited notes."
      );
    }

    next();
  } catch (error) {
    console.error("Note limit check error:", error);
    return sendForbiddenError(res, "Error checking note limit");
  }
};

module.exports = {
  checkPremiumSubscription,
  checkNoteLimit,
};
