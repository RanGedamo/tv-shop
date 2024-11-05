
module.exports = function registerValidation(req, res, next) {
    const { firstName, lastName, username, password, confirmPassword } = req.body;
  
    if (!firstName || typeof firstName !== 'string' || firstName.length < 2 || firstName.length > 50) {
      return res.status(400).json({ error: 'First name is required, should be a string, and must be between 2 and 50 characters long.' });
    }
    const nameRegex = /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/;
    if (!nameRegex.test(firstName)) {
      return res.status(400).json({ error: 'First name contains invalid characters.' });
    }
  
    if (!lastName || typeof lastName !== 'string' || lastName.length < 2 || lastName.length > 50) {
      return res.status(400).json({ error: 'Last name is required, should be a string, and must be between 2 and 50 characters long.' });
    }
    if (!nameRegex.test(lastName)) {
      return res.status(400).json({ error: 'Last name contains invalid characters.' });
    }
  
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Email is required and should be a string.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
  
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required and should be a string.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
  
    next();
  };
  