const Teacher = require("../models/teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    requestPasswordResetOtp,
    resetPasswordWithOtp,
} = require("../services/passwordResetService");
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

const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if teacher exists
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(
            password,
            teacher.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: teacher._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
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

const requestTeacherPasswordOtp = async (req, res) => {
    try {
        const result = await requestPasswordResetOtp({
            email: req.body.email,
            role: "teacher",
            UserModel: Teacher,
        });

        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const resetTeacherPassword = async (req, res) => {
    try {
        const result = await resetPasswordWithOtp({
            email: req.body.email,
            otp: req.body.otp,
            password: req.body.password,
            role: "teacher",
            UserModel: Teacher,
        });

        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerTeacher,
    loginTeacher,
    requestTeacherPasswordOtp,
    resetTeacherPassword,
};
