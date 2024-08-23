const express = require('express');
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');
const tokenRoutes = require('./tokenRoutes');
const thetaRoutes = require('./thetaRoutes');

const router = express.Router();

// Use the route modules
router.use('/users', userRoutes);
router.use('/files', fileRoutes);
router.use('/tokens', tokenRoutes);
router.use('/theta', thetaRoutes);

module.exports = router;
