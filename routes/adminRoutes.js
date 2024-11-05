const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const userController = require('../controllers/userController');


router.delete('/users/delete/:id', protect, adminOnly, userController.deleteUser);
router.put('/users/update/:id', protect, adminOnly, userController.updateUser);

module.exports = router;
