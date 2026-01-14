const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken || !verifyToken.userId) {
      return res.status(401).send("Invalid token");
    }

    req.locals = verifyToken.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).send("Authentication failed");
  }
};

module.exports = auth;
