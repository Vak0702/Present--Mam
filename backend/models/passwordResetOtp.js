const mongoose = require("mongoose");

const passwordResetOtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["student", "teacher"],
            required: true,
        },
        otpHash: {
            type: String,
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: {
                expires: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

passwordResetOtpSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model("PasswordResetOtp", passwordResetOtpSchema);
