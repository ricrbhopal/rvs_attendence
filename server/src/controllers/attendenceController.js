import User from "../models/userModel.js";
import Attendance from "../models/attendanceModel.js";

export const MarkAttendence = async (req, res, next) => {
  try {
    const { rfid } = req.params;
    
    // Validate required field
    if (!rfid) {
      return res.status(400).json({
        message: "RFID is required",
        lcd: {
          line1: "ERROR!",
          line2: "No RFID Card"
        }
      });
    }

    // Check if user exists
    const checkUser = await User.findOne({ rfid });
    if (!checkUser) {
      return res.status(404).json({
        message: "User not found",
        lcd: {
          line1: rfid.substring(0, 16),
          line2: "Not Registered"
        }
      });
    }

    // Check if user is active
    if (checkUser.status !== "active") {
      return res.status(403).json({
        message: "User is not active",
        lcd: {
          line1: "Access Denied!",
          line2: "User Inactive"
        }
      });
    }

    // Get current date and time
    const currentDateTime = new Date();
    const attendanceDate = new Date(currentDateTime);
    attendanceDate.setHours(0, 0, 0, 0); // Set to start of day for comparison

    // Find attendance record for this user on this date
    const existingAttendance = await Attendance.findOne({
      userId: checkUser._id,
      date: attendanceDate,
    });

    if (!existingAttendance) {
      // No record exists - create new entry with checkInTime
      const newAttendance = new Attendance({
        userId: checkUser._id,
        date: attendanceDate,
        checkInTime: currentDateTime,
        status: "present",
      });
      await newAttendance.save();
      
      return res.status(201).json({
        message: "Check-in marked successfully",
        lcd: {
          line1: "Welcome!",
          line2: checkUser.fullname.substring(0, 16)
        },
        data: {
          type: "checkIn",
          time: currentDateTime,
          user: {
            fullname: checkUser.fullname,
            rfid: checkUser.rfid,
          },
        },
      });
    }

    // Record exists - check current state
    if (existingAttendance.checkInTime && existingAttendance.checkOutTime) {
      // Both times exist - not allowed to mark again
      return res.status(400).json({
        message: "Attendance already marked for today",
        lcd: {
          line1: "Already Done!",
          line2: "Come Tomorrow"
        }
      });
    }

    if (existingAttendance.checkInTime && !existingAttendance.checkOutTime) {
      // Only checkIn exists - save checkOut time
      
      // Calculate time difference in minutes
      const timeDifference = (currentDateTime - existingAttendance.checkInTime) / (1000 * 60);
      
      if (timeDifference < 15) {
        return res.status(400).json({
          message: `Check-out not allowed. Minimum 15 minutes required. Current: ${Math.floor(timeDifference)} mins`,
          lcd: {
            line1: "Too Early!",
            line2: `Wait ${15 - Math.floor(timeDifference)} mins`
          }
        });
      }

      existingAttendance.checkOutTime = currentDateTime;
      await existingAttendance.save();
      
      const hours = Math.floor(timeDifference / 60);
      const mins = Math.floor(timeDifference % 60);
      const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      
      return res.status(200).json({
        message: "Check-out marked successfully",
        lcd: {
          line1: "Goodbye!",
          line2: durationText.padEnd(16).substring(0, 16)
        },
        data: {
          type: "checkOut",
          time: currentDateTime,
          checkInTime: existingAttendance.checkInTime,
          duration: `${Math.floor(timeDifference)} minutes`,
          user: {
            fullname: checkUser.fullname,
            rfid: checkUser.rfid,
          },
        },
      });
    }

    // If somehow both don't exist (shouldn't happen), create checkIn
    existingAttendance.checkInTime = currentDateTime;
    existingAttendance.status = "present";
    await existingAttendance.save();
    
    return res.status(200).json({
      message: "Check-in marked successfully",
      lcd: {
        line1: "Welcome!",
        line2: checkUser.fullname.substring(0, 16)
      },
      data: {
        type: "checkIn",
        time: currentDateTime,
        user: {
          fullname: checkUser.fullname,
          rfid: checkUser.rfid,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const ViewAttendence = async (req, res, next) => {
  try {
    const { teacherId } = req.params;

    // Validate teacher ID
    if (!teacherId) {
      const error = new Error("Teacher ID is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      const error = new Error("Teacher not found");
      error.statusCode = 404;
      return next(error);
    }

    // Fetch all attendance records for this teacher
    const attendanceRecords = await Attendance.find({ userId: teacherId })
      .sort({ date: -1, checkInTime: -1 });

    // Format the response
    const formattedRecords = attendanceRecords.map(record => {
      let duration = null;
      let durationInMinutes = null;
      
      if (record.checkInTime && record.checkOutTime) {
        const durationMs = record.checkOutTime - record.checkInTime;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${hours}h ${minutes}m`;
        durationInMinutes = Math.floor(durationMs / (1000 * 60));
      }

      return {
        _id: record._id,
        date: record.date,
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        duration: duration,
        durationInMinutes: durationInMinutes,
        createdAt: record.createdAt,
      };
    });

    res.status(200).json({
      message: "Attendance records fetched successfully",
      teacher: {
        _id: teacher._id,
        fullname: teacher.fullname,
        rfid: teacher.rfid,
        email: teacher.email,
        phone: teacher.phone,
      },
      totalRecords: formattedRecords.length,
      attendance: formattedRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllNames = async (req, res, next) => {
  try {
    // Logic to get all names
    const teachers = await User.find().select("_id fullname rfid");
    res.status(200).json({ data: teachers });
  } catch (error) {
    next(error);
  }
};
