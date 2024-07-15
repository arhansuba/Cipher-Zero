const express = require('express');
const router = express.Router();

// Mock data
const dashboardData = {
    totalTransactions: 10000,
    activeUsers: 2500,
    totalRewards: 50000,
};

const userMetricsData = (address) => ({
    transactions: 150,
    rewards: 2000,
    computePower: 50,
});

router.get('/dashboard', (req, res) => {
    res.json(dashboardData);
});

router.get('/user-metrics/:address', (req, res) => {
    const { address } = req.params;
    res.json(userMetricsData(address));
});

module.exports = router;
