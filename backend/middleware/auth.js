const { verifyToken } = require("@clerk/backend");
const { sendUnauthorizedError } = require("../utils/response");
const { MESSAGES } = require("../constants");

// Clerk authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorizedError(res, MESSAGES.NO_TOKEN);
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload || !payload.sub) {
      console.error("Auth error: Missing 'sub' in token payload", payload);
      return sendUnauthorizedError(res, MESSAGES.INVALID_TOKEN_PAYLOAD);
    }

    // Log successful authentication
    console.log(`User authenticated: ${payload.sub}`);

    req.user = payload;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return sendUnauthorizedError(res, MESSAGES.INVALID_TOKEN);
  }
};

module.exports = { authenticateUser };
