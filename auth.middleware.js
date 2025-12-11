import jwt from "jsonwebtoken";

export function Auth(req, res, next) {
  try {
    // accept token from cookie OR Authorization header (Bearer <token>)
    let token = req.cookies?.token;
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_Key);
    req.user = decode;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expiredAt: error.expiredAt });
    }
    if (error?.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token", error: error.message });
    }

    return res.status(403).json({ message: "Forbidden access" });
  }
}
