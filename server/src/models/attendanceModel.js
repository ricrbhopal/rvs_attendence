import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            required: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;



