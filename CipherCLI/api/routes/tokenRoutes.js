const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Define routes related to tokens
router.get('/balance/:userId', tokenController.getTokenBalance);
router.post('/transfer', tokenController.transferTokens);

module.exports = router;
