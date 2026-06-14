const Teacher = require("../models/teacher");
const bcrypt = require("bcryptjs");

const registerTeacher = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            subjects,
        } = req.body;

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
            return res.status(400).json({
                message: "Teacher already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create teacher
        const teacher = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            department,
            subjects,
        });

        res.status(201).json({
            message: "Teacher registered successfully",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department,
                subjects: teacher.subjects,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerTeacher,
};