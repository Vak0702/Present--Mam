const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerStudent = async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            email,
            password,
            department,
            semester,
        } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [{ email }, { rollNumber }],
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Student already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await Student.create({
            name,
            rollNumber,
            email,
            password: hashedPassword,
            department,
            semester,
        });

        res.status(201).json({
            message: "Student registered successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                rollNumber: student.rollNumber,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if student exists
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: student._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                rollNumber: student.rollNumber,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getStudentProfile = async (req, res) => {
    res.status(200).json(req.student);
};

module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile,
};