const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    requestStudentPasswordOtp,
    resetStudentPassword,
    getStudentProfile,
    getAllStudents,
    updateStudentProfile,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");
const {
    protectTeacher,
} = require("../middleware/teacherAuthMiddleware");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/request-reset-otp", requestStudentPasswordOtp);
router.post("/reset-password", resetStudentPassword);

router.get("/profile", protect, getStudentProfile);
router.get("/", protectTeacher, getAllStudents);

router.put(
    "/update-profile",
    protect,
    updateStudentProfile
);

module.exports = router;
