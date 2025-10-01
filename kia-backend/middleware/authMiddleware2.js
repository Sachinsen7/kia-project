const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }

      req.user = decoded; // attach user payload
      return next();
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Auth middleware error",
      error: err.message,
    });
  }
};

module.exports = authMiddleware;
