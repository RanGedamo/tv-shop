const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController'); // ייבוא הקונטרולר

router.get('/', homeController.getHomePage); // הפנייה לפונקציה המתאימה בקונטרולר

module.exports = router;
