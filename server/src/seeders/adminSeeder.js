import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import Admin from "../models/adminModel.js";
dotenv.config();

const data = {
  fullName: "Renu Singh",
  phone: "8889996486",
  email: "principal@rajvedanta.org",
  password: "admin123",
};

const seedAdmin = async () => {
  await connectDB();
  const existingAdmin = await Admin.findOne({ email: data.email });
  if (existingAdmin) {
    //delete existing data
    await existingAdmin.remove();
    return;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newAdmin = new Admin({
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    password: hashedPassword,
  });
  await newAdmin.save();
  console.log("Admin user seeded successfully");
};

seedAdmin().then(() => {
  mongoose.connection.close();
});
