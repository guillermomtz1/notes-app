const { sendForbiddenError } = require("../utils/response");
const { MESSAGES } = require("../constants");

// Check if user has premium subscription
const checkPremiumSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    // Check if user has premium subscription
    const hasPremium = user?.publicMetadata?.subscription === "premium";

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
    const hasPremium = user?.publicMetadata?.subscription === "premium";

    if (hasPremium) {
      // Premium users have unlimited notes
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
