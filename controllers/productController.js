const Product = require('../models/productModel');

// יצירת מוצר חדש
exports.createProduct = async (req, res) => {
  try {
    const { name, price, screenType, description ,image} = req.body;
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

    const updateData = {
      name,
      price,
      screenType,
      description,
    };

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


exports.filterProducts = async (req, res) => {
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 99999;
  const products = await Product.find({
    price: { $gte: minPrice, $lte: maxPrice }
  });
  res.render('layouts/layout', {
    title: 'Product List', 
    body: '../pages/products', // הטמעת הדף של המוצרים ב-layout
    products, 
    minPrice,  
    maxPrice    
  });
};

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