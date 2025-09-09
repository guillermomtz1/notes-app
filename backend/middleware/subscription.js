const { sendForbiddenError } = require("../utils/response");
const { MESSAGES } = require("../constants");

// Check if user has premium subscription
const checkPremiumSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    // Check multiple possible fields for subscription status
    const hasPremiumFromMetadata =
      user?.publicMetadata?.subscription === "premium";
    const hasPremiumFromPla = user?.pla === "u:premium";
    const hasPremium = hasPremiumFromMetadata || hasPremiumFromPla;

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

    // Check multiple possible fields for subscription status
    const hasPremiumFromMetadata =
      user?.publicMetadata?.subscription === "premium";
    const hasPremiumFromPla = user?.pla === "u:premium";
    const hasPremium = hasPremiumFromMetadata || hasPremiumFromPla;

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
