const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getStudentProfile,
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerStudent);
router.post("/login", loginStudent);

router.get("/profile", protect, getStudentProfile);

module.exports = router;