// routes/viewRoutes.js
const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', viewController.getHomePage);
router.get('/products', viewController.getProductsPage);
router.get('/cart', viewController.getCartPage);
router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);
router.get('/logout', viewController.logout);


router.get('/dashboard',protect,adminOnly, viewController.getDashboardPage);


module.exports = router;
