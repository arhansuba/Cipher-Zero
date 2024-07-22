const axios = require('axios');

exports.getTokenBalance = async (userId) => {
    // Implement logic to get token balance
    const response = await axios.get(`http://localhost:3000/token/balance/${userId}`);
    return response.data.balance;
};

exports.transferTokens = async (fromUserId, toUserId, amount) => {
    // Implement logic to transfer tokens
    const response = await axios.post('http://localhost:3000/token/transfer', { fromUserId, toUserId, amount });
    return response.data;
};
