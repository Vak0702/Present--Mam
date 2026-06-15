const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getStudentProfile,
    getAllStudents,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerStudent);
router.post("/login", loginStudent);

router.get("/profile", protect, getStudentProfile);
router.get("/", getAllStudents);

module.exports = router;