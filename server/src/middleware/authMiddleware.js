import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

export const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.secret;
    if (!token) {
      const error = new Error("Not authorized, no token");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find in Admin collection first, then User collection
    let currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      currentUser = await User.findById(decoded.id);
    }

    if (!currentUser) {
      const error = new Error("User not found");
      error.statusCode = 401;
      return next(error);
    }
    
    req.user = currentUser;
    next();
  } catch (error) {
    const err = new Error("Not authorized, token failed");
    err.statusCode = 401;
    next(err);
  }
};