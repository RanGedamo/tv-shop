const CryptoJS = require('crypto-js');

// פונקציה להצפנה

// פונקציה להוספת מוצר לעגלה
exports.addToCart = (req, res) => {
    try {
      const { productId } = req.body;
      
console.log(productId);
      let cart = [];
      if (req.cookies.cart) {
        try {
          cart = JSON.parse(req.cookies.cart); 
        } catch (error) {
          console.error("שגיאה בפענוח JSON:", error);
          cart = []; 
        }
      }
  
      // בדיקה אם המוצר כבר קיים בעגלה
      if (!cart.includes(productId)) {
        cart.push(productId);
      }
  
      // שמירה בעוגיות
      res.cookie('cart', JSON.stringify(cart), { httpOnly: true, path: '/' });
      res.status(200).json({ success: true, cartItemCount: cart.length });
    } catch (error) {
      console.error("שגיאה בשרת:", error);
      res.status(500).json({ success: false, message: "שגיאה בהוספת המוצר לעגלה" });
    }
  };
  
// פונקציה לשליפת מוצרים מהעגלה
exports.getCartItems = (req, res) => {
  try {
    const encryptedCart = req.cookies.cart;
    if (encryptedCart) {
      const decryptedCart = decryptData(encryptedCart);
      const cart = JSON.parse(decryptedCart);
      res.status(200).json({ success: true, data: cart });
    } else {
      res.status(404).json({ success: false, message: "אין מוצרים בעגלה" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "שגיאה בשליפת המוצרים מהעגלה" });
  }
};

// פונקציה לפענוח
function decryptData(encryptedData) {
  const encryptionKey = "my-secret-key"; // אותו מפתח שבו השתמשת להצפנה
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return decryptedBytes.toString(CryptoJS.enc.Utf8);
}
