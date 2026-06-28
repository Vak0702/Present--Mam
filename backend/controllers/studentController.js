const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    requestPasswordResetOtp,
    resetPasswordWithOtp,
} = require("../services/passwordResetService");

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

const requestStudentPasswordOtp = async (req, res) => {
    try {
        const result = await requestPasswordResetOtp({
            email: req.body.email,
            role: "student",
            UserModel: Student,
        });

        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const resetStudentPassword = async (req, res) => {
    try {
        const result = await resetPasswordWithOtp({
            email: req.body.email,
            otp: req.body.otp,
            password: req.body.password,
            role: "student",
            UserModel: Student,
        });

        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getStudentProfile = async (req, res) => {
    res.status(200).json(req.student);
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password");

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const updateStudentProfile = async (req, res) => {
    try {
        const { name } = req.body;

        const student = await Student.findById(
            req.student._id
        );

        if (!student) {

            return res.status(404).json({
                message: "Student not found",
            });

        }

        student.name =
            name || student.name;

        await student.save();

        res.status(200).json({
            message:
                "Profile updated successfully",

            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                rollNumber:
                    student.rollNumber,
                department:
                    student.department,
                semester:
                    student.semester,
            },
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    registerStudent,
    loginStudent,
    requestStudentPasswordOtp,
    resetStudentPassword,
    getStudentProfile,
    getAllStudents,
    updateStudentProfile,
};
