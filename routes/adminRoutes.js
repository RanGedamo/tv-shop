const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // ודא שהייבוא תקין
const { protect, adminOnly } = require('../middleware/auth');

// ניהול משתמשים עבור Admin בלבד
router.post('/create-admin', protect, adminOnly, userController.createAdmin); // יצירת Admin חדש
router.delete('/delete-user/:id', protect, adminOnly, userController.deleteUser); // מחיקת משתמש לפי ID

module.exports = router;
