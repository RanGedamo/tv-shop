const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ראוט להרשמת משתמש חדש
router.post('/register', userController.register);

// ראוט להתחברות משתמשים
router.post('/login', userController.login);


module.exports = router;
