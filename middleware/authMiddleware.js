import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const protect = async (req, res, next) => {
  let token;

  // token coming from authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //   getting token from header
      token = req.headers.authorization.split(" ")[1];
      // verify token with secret key
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};
