const nodemailer = require('nodemailer');

// פונקציה ליצירת טרנספורטר מותאם אישית
function createTransporter(email) {
  if (email.endsWith('@walla.co.il')) {
    // הגדרות עבור Walla
    return nodemailer.createTransport({
      host: 'smtp.walla.co.il',
      port: 587,
      secure: false, // true אם השרת משתמש ב-SSL
      auth: {
        user: process.env.WALLA_EMAIL_USER, // שם משתמש עבור Walla
        pass: process.env.WALLA_EMAIL_PASS, // סיסמה עבור Walla
      },
    });
  } else {
    // הגדרות עבור Gmail
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL_USER, // שם משתמש עבור Gmail
        pass: process.env.GMAIL_EMAIL_PASS, // סיסמה עבור Gmail
      },
    });
  }
}

// פונקציה לשליחת אימייל לאימות עם קוד OTP בלבד
async function sendVerificationEmail(email, otp) {
  const transporter = createTransporter(email);

  const mailOptions = {
    from: email.endsWith('@walla.co.il') ? process.env.WALLA_EMAIL_USER : process.env.GMAIL_EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

// פונקציה לשליחת אימייל לאיפוס סיסמה
async function sendResetPasswordEmail(email, resetToken) {
  const transporter = createTransporter(email);

  const resetUrl = `http://localhost:${process.env.PORT}.com/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: email.endsWith('@walla.co.il') ? process.env.WALLA_EMAIL_USER : process.env.GMAIL_EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested to reset your password. Click the link to reset: ${resetUrl}`,
    html: `<p>You requested to reset your password.</p><p>Click the link to reset: <a href="${resetUrl}">Reset Password</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
