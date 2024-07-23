const tokenService = require('../services/tokenService');

exports.getTokenBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const balance = await tokenService.getTokenBalance(userId);
        res.status(200).json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.transferTokens = async (req, res) => {
    try {
        const { fromUserId, toUserId, amount } = req.body;
        const result = await tokenService.transferTokens(fromUserId, toUserId, amount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
