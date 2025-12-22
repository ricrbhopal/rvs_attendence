import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find();
    res.status(200).json({ data: teachers });
  } catch (error) {
    next(error);
  }
};

export const addTeacher = async (req, res, next) => {
  try {
    const { rfid, fullname, email, phone } = req.body;

    if (!rfid || !fullname || !email || !phone) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      const error = new Error("Teacher with this email already exists");
      error.statusCode = 409;
      return next(error);
    }

    const newTeacher = new User({
      rfid,
      fullname,
      email,
      phone,
      status: "active",
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully", data: newTeacher });
  } catch (error) {
    next(error);
  }
};
export const updateTeacher = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { rfid, fullname, email, phone, status } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      const error = new Error("Teacher not found");
      error.statusCode = 404;
      return next(error);
    }
    teacher.rfid = rfid || teacher.rfid;
    teacher.fullname = fullname || teacher.fullname;
    teacher.email = email || teacher.email;
    teacher.phone = phone || teacher.phone;
    teacher.status = status || teacher.status;

    await teacher.save();

    res.status(200).json({ message: "Teacher updated successfully", data: teacher });
  } catch (error) {
    next(error);
  }
};

export const updateTeacherStatus = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const { status } = req.body;
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      const error = new Error("Teacher not found");
      error.statusCode = 404;
      return next(error);
    }
    teacher.status = status || teacher.status;
    await teacher.save();

    res.status(200).json({ message: "Teacher status updated successfully", data: teacher });
  } catch (error) {
    next(error);
  }
};
