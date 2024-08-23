const thetaService = require('../services/thetaService');

exports.getThetaBalance = async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await thetaService.getThetaBalance(address);
        res.status(200).json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.stakeTheta = async (req, res) => {
    try {
        const { address, amount } = req.body;
        const result = await thetaService.stakeTheta(address, amount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
