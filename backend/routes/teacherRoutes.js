const express = require("express");
const router = express.Router();

const {
    registerTeacher,
} = require("../controllers/teacherController");

router.post("/register", registerTeacher);

module.exports = router;