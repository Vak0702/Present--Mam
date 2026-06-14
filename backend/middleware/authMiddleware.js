const jwt = require("jsonwebtoken");
const Student = require("../models/student");

const protect = async (req, res, next) => {
    let token;

    // Check if token exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Attach student to request
            req.student = await Student.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, token failed",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token",
        });
    }
};

module.exports = { protect };