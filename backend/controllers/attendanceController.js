const Attendance = require("../models/attendance");

const markAttendance = async (req, res) => {
    try {
        const {
            student,
            teacher,
            subject,
            date,
            status,
        } = req.body;

        // Prevent duplicate attendance
        const existingAttendance = await Attendance.findOne({
            student,
            subject,
            date,
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: "Attendance already marked for this student.",
            });
        }

        const attendance = await Attendance.create({
            student,
            teacher,
            subject,
            date,
            status,
        });

        res.status(201).json({
            message: "Attendance marked successfully",
            attendance,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    markAttendance,
};