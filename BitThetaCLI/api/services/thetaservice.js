const axios = require('axios');

exports.getThetaBalance = async (address) => {
    // Implement logic to get Theta balance
    const response = await axios.get(`http://localhost:3000/theta/balance/${address}`);
    return response.data.balance;
};

exports.stakeTheta = async (address, amount) => {
    // Implement logic to stake Theta
    const response = await axios.post('http://localhost:3000/theta/stake', { address, amount });
    return response.data;
};
