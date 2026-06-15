const express = require("express");

const router = express.Router();

const {
    markAttendance,
    getMyAttendance,
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

module.exports = router;