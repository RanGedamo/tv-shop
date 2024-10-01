exports.getHomePage = (req, res) => {
  const data = require('../services/login'); // משיכת הנתונים (זה יכול להיות גם דינמי ממסד נתונים)
  res.render('home', { data });
};