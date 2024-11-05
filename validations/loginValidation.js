module.exports = function loginValidation(req, res, next) {
    const { username, password } = req.body;
  
  
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required and should be a string.' });
    }
    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }
  
 
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required and should be a string.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    next();
  };
  