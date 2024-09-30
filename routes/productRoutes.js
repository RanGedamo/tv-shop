const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload'); // ייבוא Multer מ־middleware

// ניהול מוצרים עבור Admin בלבד
router.get('/average-price-by-screen', protect, adminOnly, productController.getAveragePriceByScreenType);

// הוספת מוצר עם העלאת תמונה
router.post('/', protect, adminOnly, upload.single('image'), productController.createProduct); // יצירת מוצר חדש עם תמונה

router.delete('/:id', protect, adminOnly, productController.deleteProduct); // מחיקת מוצר לפי ID
router.put('/:id', protect, adminOnly, productController.updateProduct); // עדכון מוצר לפי ID

module.exports = router;
