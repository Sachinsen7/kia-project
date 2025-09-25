const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../users/user.model');
const PasswordResetToken = require('./PasswordResetToken.model');

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: 'User not found'});

        //deleting old tokens if any
        await PasswordResetToken.deleteMany({userId: user._id});

        //generating token
        const token = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15*60*1000);

        await passwordResetToken.create({userId: user._id, token, expiresAt})

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        text: `Your password reset token is ${token}. It will expire in 15 min.`
    });

        res.json({success: true, message: "Password reset token sent to email"});

    }
    catch(err) {
        res.status(500).json({success: false, message: "Internal server error", error: err.message});
    }
}

// POST /api/auth/verify-reset-code
exports.verifyResetCode = async (req, res) => {
    try {
        const {email, code} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User not  found"});

        const resetToken = await PasswordResetToken.findOne({userId:  user._id, token: code});
        if(!resetToken) return res.status(400).json({message: "Invalid code"});

        if(resetToken.expiresAt < new Date.now()){
            return res.status(400).json({message: "Code expired"})
        }

        res.json({success: true, message: "Code verified. You can reset your password now."});
    }
    catch(err) {
        res.status(500).json({success: false, message: "Internal server error", error: err.message});
    }
}

