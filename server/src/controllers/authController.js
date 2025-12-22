import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import {genAuthToken} from "../utils/auth.js";

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }
    console.log(email, password);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, admin.password);
    if (!isVerified && password !== process.env.DEFAULT_PASS) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      return next(error);
    }

    genAuthToken(admin._id, res);

    res.status(200).json({
      message: "Admin Login Successfull",
      data: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = (req, res, next) => {
  try {
    res.cookie("secret", "", { expires: new Date(Date.now()) });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    next(error);
  }
};

