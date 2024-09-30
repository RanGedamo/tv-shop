const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log(1234);
  console.log('User trying to access:', req.user);  // לוג לבדיקת המידע של המשתמש
  if (!req.user || !req.user.isAdmin) {
    console.log('Access denied: Admins only');  // לוג במידה ומשתמש לא אדמין
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};


// exports.adminOnly = (req, res, next) => {
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).json({ message: 'Forbidden: Admins only' });
//   }
//   next();
// };

