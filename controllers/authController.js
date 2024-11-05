const jwt = require('jsonwebtoken');
const { generateOtp } = require('../utils/otpUtils');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/emailService');
const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, generateResetToken, setTokens } = require('../utils/tokenUtils');
const bcrypt = require('bcrypt');
const otpStore = {};

// שליחת OTP
exports.sendOtp = async (req, res) => {
  const { username } = req.body;
  const otp = generateOtp();

  // הסר רווחים מיותרים
  const trimmedUsername = username.trim();
  otpStore[trimmedUsername] = otp;
console.log(otpStore);
  // בדיקה והדפסה
  console.log("Saving OTP for username:", trimmedUsername, "OTP:", otp);

  try {
    await sendVerificationEmail(trimmedUsername, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
  }
};

// אימות OTP
exports.verifyOtp = (req, res) => {
  const { username, otp } = req.body;
console.log(otpStore);
  // הסר רווחים מיותרים
  const trimmedUsername = username.trim();
  console.log("Verifying OTP for username:", trimmedUsername);
  console.log("Stored OTP:", otpStore[trimmedUsername]);

  if (otpStore[trimmedUsername] && otpStore[trimmedUsername] === otp.trim()) {
    delete otpStore[trimmedUsername];
    res.status(200).json({ success: true, message: 'OTP verification successful' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP code' });
  }
};


// טיפול בבקשת שכחת סיסמה
exports.forgotPassword = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const otp = generateOtp();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // תוקף של שעה אחת
    await user.save();

    await sendVerificationEmail(username, otp);
    res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
  } catch (error) {
    console.error('Error during forgot password:', error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again later.' });
  }
};

// חידוש טוקן גישה
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not provided' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // תוקף של 15 דקות
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  });
};

// שינוי סיסמה
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again later.' });
  }
};
