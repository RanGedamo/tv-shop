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
      connectionTimeout: 10000, // מגבלת זמן של 10 שניות
      debug: true, // למטרות דיאגנוסטיקה
    });
  } else {
    // הגדרות עבור Gmail
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true עבור SSL עם פורט 465
      auth: {
        user: process.env.GMAIL_EMAIL_USER, // שם משתמש עבור Gmail
        pass: process.env.GMAIL_EMAIL_PASS, // סיסמת אפליקציה עבור Gmail אם מופעל אימות דו-שלבי
      },
      connectionTimeout: 10000, // מגבלת זמן של 10 שניות
      debug: true, // למטרות דיאגנוסטיקה
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
    console.error('Error sending verification email:', error.message);
    throw new Error('Failed to send verification email');
  }
}

module.exports = { sendVerificationEmail };
