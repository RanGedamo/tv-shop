const Product = require('../models/productModel');

// יצירת מוצר חדש (Admin בלבד)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// עדכון מוצר לפי ID (Admin בלבד)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// מחיקת מוצר לפי ID (Admin בלבד)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// קיבוץ מוצרים לפי סוג המסך והצגת מחיר ממוצע (Admin בלבד)
exports.getAveragePriceByScreenType = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: '$screenType', // קיבוץ לפי סוג המסך
          averagePrice: { $avg: '$price' } // חישוב המחיר הממוצע
        }
      }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
