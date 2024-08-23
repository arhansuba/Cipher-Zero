const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userService.registerUser(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.authenticateUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await userService.authenticateUser(username, password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
