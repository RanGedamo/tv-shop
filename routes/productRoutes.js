const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// ניהול מוצרים עבור Admin בלבד
router.get('/filter', productController.filterProducts);

router.get('/average-price-by-screen', protect, adminOnly, productController.getAveragePriceByScreenType);
router.post('/', protect, adminOnly, productController.createProduct); // יצירת מוצר חדש
router.delete('/:id', protect, adminOnly, productController.deleteProduct); // מחיקת מוצר לפי ID
router.put('/:id', protect, adminOnly, productController.updateProduct); // עדכון מוצר לפי ID

module.exports = router;
