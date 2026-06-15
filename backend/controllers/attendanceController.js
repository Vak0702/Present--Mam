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

const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            student: req.student._id,
        })
            .populate("teacher", "name email")
            .sort({ date: -1 });

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    markAttendance,
    getMyAttendance,
};