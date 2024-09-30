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
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // לוגים לבדיקת תהליך ההשוואה
    console.log("Password from login request:", password);
    console.log("Hashed password from DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    // לוג האם ההשוואה הצליחה
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
