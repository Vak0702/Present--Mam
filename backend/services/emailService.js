const nodemailer = require("nodemailer");

const hasSmtpConfig = () =>
    Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );

const createTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

const sendPasswordResetOtp = async ({ to, otp, role }) => {
    const ttlMinutes = process.env.RESET_OTP_TTL_MINUTES || 10;

    if (!hasSmtpConfig()) {
        console.log(`Password reset OTP for ${role} ${to}: ${otp}`);

        return {
            delivered: false,
        };
    }

    const transporter = createTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject: "Present Mam password reset OTP",
        text: `Your Present Mam password reset OTP is ${otp}. It expires in ${ttlMinutes} minutes.`,
        html: `
            <p>Your Present Mam password reset OTP is:</p>
            <h2>${otp}</h2>
            <p>This OTP expires in ${ttlMinutes} minutes.</p>
        `,
    });

    return {
        delivered: true,
    };
};

module.exports = {
    sendPasswordResetOtp,
};
