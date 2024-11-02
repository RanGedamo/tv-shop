const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// פונקציה להרשמת משתמש חדש (Registration)
exports.register = async (req, res) => {
  const { username, password } = req.body;
console.log(username);
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

exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ errorMessage: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errorMessage: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    return res.status(200).json({ successMessage: 'Login successful' });
  } catch (err) {
    return res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
  }
};


// exports.login = async (req, res) => {
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.locals.errorMessage = 'User not found'; // הגדרת הודעת שגיאה ב-res.locals
//       return res.redirect('/login');
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.locals.errorMessage = 'Invalid credentials'; // הגדרת הודעת שגיאה ב-res.locals
//       return res.redirect('/login');
//     }

//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.cookie('token', token, { httpOnly: true });
//     res.locals.successMessage = 'Login successful'; // הודעת הצלחה
//     res.redirect('/');
//   } catch (err) {
//     res.locals.errorMessage = 'An error occurred. Please try again later.';
//     res.redirect('/login');
//   }
// };


// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).render('login', { errorMessage: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).render('login', { errorMessage: 'Invalid credentials' });
//     }

//     // יצירת JWT
//     const token = jwt.sign(
//       { userId: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.cookie('token', token, { httpOnly: true });
//     res.redirect('/'); // ניתוב לעמוד הבית לאחר התחברות מוצלחת
//   } catch (err) {
//     return res.status(500).render('login', { errorMessage: 'An error occurred. Please try again later.' });
//   }
// };





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


exports.updateUser = async (req, res) => {
  try {
    const { username, email, isAdmin, password } = req.body;

    const updateData = { username, email, isAdmin };

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &), and be at least 8 characters long.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
