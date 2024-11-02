const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// פעולות פילטר (זמינות למשתמשים רגילים)
router.get('/filter', productController.filterProducts);

// פעולות ניהול מוצרים (Admin בלבד)
router.get('/average-price-by-screen', protect, adminOnly, productController.getAveragePriceByScreenType);
router.post('/create', protect, adminOnly, productController.createProduct); // יצירת מוצר חדש
router.delete('/delete/:id', protect, adminOnly, productController.deleteProduct); // מחיקת מוצר לפי ID
router.put('/update/:id', protect, adminOnly, productController.updateProduct); // עדכון מוצר לפי ID

module.exports = router;
