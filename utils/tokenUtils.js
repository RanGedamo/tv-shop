const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// פונקציה ליצירת Access Token
function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // תוקף קצר, למשל 15 דקות
  );
}

// פונקציה ליצירת Refresh Token
function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // תוקף ארוך יותר, למשל 7 ימים
  );
}

// פונקציה ליצירת טוקן לאיפוס סיסמה
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// פונקציה לשליחת הטוקנים בעוגיות מאובטחות
function setTokens(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000, // תוקף של 15 דקות
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // תוקף של 7 ימים
  });
}

module.exports = { generateAccessToken, generateRefreshToken, generateResetToken, setTokens };
