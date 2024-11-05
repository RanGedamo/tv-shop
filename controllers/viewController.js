const Product = require('../models/productModel');


exports.getHomePage = (req, res) => {
  console.log("User info:", req.user); // הדפסה לבדוק אם יש מידע על המשתמש

  res.render('layouts/layout', { 
    title: 'Home Page', 
    body: '../pages/index',
    user: req.user || null // נשלח את המידע על המשתמש אם הוא קיים
  });
};

exports.getLoginPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Login Page',
    body: '../pages/login',
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
    errorMessage: null,
    successMessage: null
  });
};

exports.getRegisterPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Registration', 
    body: '../pages/register',
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
    errorMessage: null, 
    successMessage: null 
  });
};

exports.getDashboardPage = (req, res) => {
  const totalProducts = 50; // נתון סטטי לדוגמה
  const totalSales = 120; // נתון סטטי לדוגמה
  const revenue = 25000; // נתון סטטי לדוגמה

  res.render('layouts/layout', {
    title: 'Admin Dashboard',
    body: '../pages/dashboard',
    user: req.user || null, // נשלח את המידע על המשתמש אם הוא קיים
    totalProducts,
    totalSales,
    revenue
  });
};
exports.getProductsPage = (req, res) => {
  res.render('layouts/layout', {
    title: 'Product List',
    body: '../pages/products',
    user: req.user || null,
    products: [], // נתחיל עם מערך ריק של מוצרים
    minPrice: 0,
    maxPrice: 99999,
  });
};

exports.getCartPage = (req, res) => {
  res.render('layouts/layout', { 
    title: 'Cart Page', 

    body: '../pages/cart',
    user: req.user || null // נשלח את המידע על המשתמש אם הוא קיים
  });
};

exports.logout = (req, res) => {
  res.clearCookie('accessToken'); // ניקוי הטוקן מהעוגיה
  res.clearCookie('refreshToken'); // ניקוי טוקן הרענון מהעוגיה, אם קיים
  res.redirect('/login'); // הפניית המשתמש לעמוד ההתחברות
};