const express = require("express");
const router = express.Router();

const {
    registerTeacher,
    loginTeacher,
    requestTeacherPasswordOtp,
    resetTeacherPassword,
} = require("../controllers/teacherController");

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);
router.post("/request-reset-otp", requestTeacherPasswordOtp);
router.post("/reset-password", resetTeacherPassword);

module.exports = router;
