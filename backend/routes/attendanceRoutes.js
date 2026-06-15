const express = require("express");

const router = express.Router();

const {
    markAttendance,
    getMyAttendance,
    getAttendancePercentage,
} = require("../controllers/attendanceController");

const {
    protectTeacher,
} = require("../middleware/teacherAuthMiddleware");

const {
    protect,
} = require("../middleware/authMiddleware");

router.post(
    "/mark",
    protectTeacher,
    markAttendance
);

router.get(
    "/my-attendance",
    protect,
    getMyAttendance
);

router.get(
    "/percentage",
    protect,
    getAttendancePercentage
);

module.exports = router;