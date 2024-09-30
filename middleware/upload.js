const multer = require('multer');

// הגדרת Multer לאחסון קבצים
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ספרייה בה הקבצים יישמרו
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// יצירת האובייקט של Multer
const upload = multer({ storage: storage });

module.exports = upload;
