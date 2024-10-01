// routes/viewRoutes.js
const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/', viewController.getHomePage);
router.get('/products', viewController.getProductsPage);
router.get('/cart', viewController.getCartPage);
router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);

module.exports = router;
