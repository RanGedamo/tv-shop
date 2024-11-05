const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const registerValidation = require('../validations/registerValidation');
const loginValidation = require('../validations/loginValidation');

router.post('/send-otp',registerValidation, authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/refresh-token', authController.refreshToken);

router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// נתיבים לניהול משתמשים
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);

module.exports = router;