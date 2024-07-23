const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes related to users
router.post('/register', userController.registerUser);
router.post('/auth', userController.authenticateUser);

module.exports = router;
