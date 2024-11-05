const crypto = require('crypto');

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString(); // מחזיר קוד OTP בן 6 ספרות
}
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }
module.exports = { generateOtp ,generateResetToken};
