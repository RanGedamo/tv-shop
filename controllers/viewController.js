const Product = require('../models/productModel');

exports.getHomePage = (req, res) => {
    res.render('layouts/layout', { 
      title: 'Home Page', 
      body: '../pages/index'
 
    });
};

exports.getLoginPage = (req, res) => {
    res.render('layouts/layout', { 
      title: 'Login Page', 
      body: '../pages/login',
      errorMessage: req.query.errorMessage || null // אם הודעת השגיאה קיימת ב-query
    });
};

exports.getProductsPage = async (req, res) => {
    try {
      const minPrice = req.query.minPrice || 0;   // Default to 0 if not provided
      const maxPrice = req.query.maxPrice || 10000; // Default to a large value if not provided
      
      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
      });
  
      // Pass the layout and body as well as the other data
      res.render('layouts/layout', {
        title: 'Product List', 
        body: '../pages/products', // Correct path to the products page
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



exports.getRegisterPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Registration', 
    body: '../pages/register',
    errorMessage: req.query.errorMessage || null // אם הודעת השגיאה קיימת ב-query
  });
};