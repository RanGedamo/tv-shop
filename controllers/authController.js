const jwt = require('jsonwebtoken');
const { generateOtp } = require('../utils/otpUtils');
const { sendVerificationEmail } = require('../utils/emailService');
const User = require('../models/userModel');
const { generateAccessToken, generateRefreshToken, setTokens } = require('../utils/tokenUtils');
const bcrypt = require('bcrypt');
const otpStore = {};

// שליחת OTP
exports.sendOtp = async (req, res) => {
  const { username } = req.body;
  const otp = generateOtp();

  // הסר רווחים מיותרים
  const trimmedUsername = username.trim();
  otpStore[trimmedUsername] = otp;
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
