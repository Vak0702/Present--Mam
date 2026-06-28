const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const PasswordResetOtp = require("../models/passwordResetOtp");
const {
    sendPasswordResetOtp,
} = require("./emailService");

const OTP_TTL_MINUTES = Number(process.env.RESET_OTP_TTL_MINUTES || 10);
const MAX_OTP_ATTEMPTS = Number(process.env.RESET_OTP_MAX_ATTEMPTS || 5);
const RESEND_COOLDOWN_SECONDS = Number(
    process.env.RESET_OTP_RESEND_SECONDS || 60
);

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const createOtp = () =>
    String(crypto.randomInt(100000, 1000000));

const requestPasswordResetOtp = async ({ email, role, UserModel }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        return {
            status: 400,
            body: {
                message: "Email is required",
            },
        };
    }

    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
        return {
            status: 200,
            body: {
                message: "If the account exists, an OTP has been sent.",
            },
        };
    }

    const existingOtp = await PasswordResetOtp.findOne({
        email: normalizedEmail,
        role,
    }).sort({ createdAt: -1 });

    if (
        existingOtp &&
        existingOtp.expiresAt > new Date() &&
        Date.now() - existingOtp.createdAt.getTime() <
            RESEND_COOLDOWN_SECONDS * 1000
    ) {
        return {
            status: 429,
            body: {
                message: `Please wait ${RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP.`,
            },
        };
    }

    const otp = createOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await PasswordResetOtp.deleteMany({
        email: normalizedEmail,
        role,
    });

    await PasswordResetOtp.create({
        email: normalizedEmail,
        role,
        otpHash,
        expiresAt,
    });

    const emailResult = await sendPasswordResetOtp({
        to: normalizedEmail,
        otp,
        role,
    });

    const body = {
        message: emailResult.delivered
            ? "OTP sent to your registered email."
            : "OTP generated. Configure SMTP to send it by email.",
    };

    if (!emailResult.delivered && process.env.NODE_ENV !== "production") {
        body.devOtp = otp;
    }

    return {
        status: 200,
        body,
    };
};

const resetPasswordWithOtp = async ({ email, otp, password, role, UserModel }) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp || !password) {
        return {
            status: 400,
            body: {
                message: "Email, OTP, and new password are required",
            },
        };
    }

    if (password.length < 6) {
        return {
            status: 400,
            body: {
                message: "Password must be at least 6 characters long",
            },
        };
    }

    const otpRecord = await PasswordResetOtp.findOne({
        email: normalizedEmail,
        role,
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return {
            status: 400,
            body: {
                message: "OTP is invalid or expired",
            },
        };
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await PasswordResetOtp.deleteOne({
            _id: otpRecord._id,
        });

        return {
            status: 400,
            body: {
                message: "Too many invalid attempts. Request a new OTP.",
            },
        };
    }

    const isMatch = await bcrypt.compare(String(otp), otpRecord.otpHash);

    if (!isMatch) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        return {
            status: 400,
            body: {
                message: "OTP is invalid or expired",
            },
        };
    }

    const user = await UserModel.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        await PasswordResetOtp.deleteOne({
            _id: otpRecord._id,
        });

        return {
            status: 404,
            body: {
                message: "Account not found",
            },
        };
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await PasswordResetOtp.deleteOne({
        _id: otpRecord._id,
    });

    return {
        status: 200,
        body: {
            message: "Password reset successfully",
        },
    };
};

module.exports = {
    requestPasswordResetOtp,
    resetPasswordWithOtp,
};
