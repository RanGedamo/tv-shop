const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const registerValidation = require('../validations/registerValidation');
const loginValidation = require('../validations/loginValidation');

router.post('/register', registerValidation, userController.register);
router.post('/login',loginValidation,userController.login);


module.exports = router;
