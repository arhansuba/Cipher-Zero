const express = require('express');
const router = express.Router();
const thetaController = require('../controllers/thetaController');

// Define routes related to Theta blockchain
router.get('/balance/:address', thetaController.getThetaBalance);
router.post('/stake', thetaController.stakeTheta);

module.exports = router;
