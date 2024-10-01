const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// פונקציה להרשמת משתמש חדש (Registration)
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // יצירת משתמש חדש - אין צורך להצפין פה, כי ה-schema כבר מטפל בזה
    const user = new User({ username, password });

    // שמירה למסד הנתונים - ההצפנה תבוצע אוטומטית ב-pre('save') ב-schema
    await user.save();

    // יצירת טוקן JWT למשתמש
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// פונקציה להתחברות משתמשים (Login)
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).render('login', { errorMessage: 'User not found' });
//     }
//     // לוגים לבדיקת תהליך ההשוואה
//     console.log("Password from login request:", password);
//     console.log("Hashed password from DB:", user.password);

//     const isMatch = await bcrypt.compare(password, user.password);

//     // לוג האם ההשוואה הצליחה
//     console.log("Password match:", isMatch);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       // רנדור העמוד עם הודעת שגיאה כאשר המשתמש לא נמצא
//       return res.status(400).render('login', { errorMessage: 'User not found' });
//     }

//     // לוגים לבדיקת תהליך ההשוואה
//     console.log("Password from login request:", password);
//     console.log("Hashed password from DB:", user.password);

//     const isMatch = await bcrypt.compare(password, user.password);

//     // לוג האם ההשוואה הצליחה
//     console.log("Password match:", isMatch);

//     if (!isMatch) {
//       // רנדור העמוד עם הודעת שגיאה כאשר הסיסמה לא תואמת
//       return res.status(400).render('login', { errorMessage: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     // אם אתה רוצה להחזיר את הטוקן ב-JSON, השאר את השורה הזו
//     // res.status(200).json({ token });

//     // רנדור עמוד חדש עם הטוקן אם רוצים להציג אותו ב-EJS לאחר התחברות מוצלחת
//     res.render('dashboard', { token, message: 'Login successful' });
//   } catch (err) {
//     // רנדור העמוד עם הודעת שגיאה במידה ויש שגיאה כללית בשרת
//     res.status(500).render('login', { errorMessage: 'An error occurred, please try again later' });
//   }
// };
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('User not found');
//       return res.status(400).json({ errorMessage: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       console.log('Password mismatch');
//       return res.status(400).json({ errorMessage: 'Invalid credentials' });
//     }

//     // התחברות מוצלחת
//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({ token, message: 'Login successful' });
//   } catch (err) {
//     console.log('Server error:', err);
//     return res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errorMessage: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errorMessage: 'Invalid credentials' });
    }

    // יצירת ה-JWT
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // שליחת הטוקן ללקוח
    res.status(200).json({ token, message: 'Login successful' });
  } catch (err) {
    return res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
  }
};


// מחיקת משתמש לפי ID (Admin בלבד)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// יצירת Admin חדש
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password, isAdmin: true });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
