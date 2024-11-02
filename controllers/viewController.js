const Product = require('../models/productModel');

exports.getHomePage = (req, res) => {
    res.render('layouts/layout', { 
      title: 'Home Page', 
      body: '../pages/index'
 
    });
};
// בשרת
exports.getLoginPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Login Page',
    body: '../pages/login',
    errorMessage: req.session.errorMessage || null,
    successMessage: req.session.successMessage || null
  });
  req.session.errorMessage = null; // נקה את הודעת השגיאה לאחר הצגה
  req.session.successMessage = null; // נקה את הודעת ההצלחה לאחר הצגה
};

exports.getRegisterPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Registration', 
    body: '../pages/register',
    errorMessage: req.flash('error') || null ,
    successMessage: req.flash('success') || null 
  });
};

exports.getProductsPage = async (req, res) => {
    try {
      const minPrice = req.query.minPrice || 0;   
      const maxPrice = req.query.maxPrice || 10000; 
      
      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });
  
      res.render('layouts/layout', {
        title: 'Product List', 
        body: '../pages/products', 
        products, 
        minPrice,  
        maxPrice    
      });
    } catch (error) {
      res.status(500).send('Error fetching products');
    }
  };

  
  exports.getCartPage = (req, res) => {
    res.render('layouts/layout', { 
      title: 'Home Page', 
      body: '../pages/cart'
 
    });
};
