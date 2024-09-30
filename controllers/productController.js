const Product = require('../models/productModel');

// יצירת מוצר חדש
exports.createProduct = async (req, res) => {
  try {
    const { name, price, screenType, description } = req.body;
    
    // בדיקה אם התמונה הועלתה
    const image = req.file ? req.file.path : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name,
      price,
      screenType,
      description,
      image // שמירת הנתיב של התמונה במסד הנתונים
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// עדכון מוצר לפי ID (כולל אפשרות לעדכן תמונה)
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, screenType, description } = req.body;

    // אם משתמש מעלה תמונה חדשה, שמור את הנתיב שלה
    const image = req.file ? req.file.path : undefined;

    const updateData = {
      name,
      price,
      screenType,
      description,
    };

    // אם יש תמונה חדשה, עדכן גם את שדה ה-image
    if (image) {
      updateData.image = image;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
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

// מחיקת מוצר לפי ID
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

// קיבוץ מוצרים לפי סוג המסך והצגת המחיר הממוצע
exports.getAveragePriceByScreenType = async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $group: { _id: '$screenType', averagePrice: { $avg: '$price' } } }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
