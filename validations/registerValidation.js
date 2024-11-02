module.exports = function registerValidation(req, res, next) {
    const { username, password } = req.body;
  
    // ולידציה עבור כתובת האימייל
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Email is required and should be a string.' });
    }
  
    // בדיקת פורמט של כתובת האימייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
  
    // ולידציה עבור סיסמה
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required and should be a string.' });
    }
  
    // בדיקת אורך הסיסמה (לפחות 8 תווים)
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
  
    // בדיקת דרישות מורכבות הסיסמה
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).' 
      });
    }
  
    // אם אין שגיאות, ממשיכים ל-Controller הבא
    next();
  };
  