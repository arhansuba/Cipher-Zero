const axios = require('axios');

exports.registerUser = async (username, password) => {
    // Implement user registration logic
    const response = await axios.post('http://localhost:3000/register', { username, password });
    return response.data;
};

exports.authenticateUser = async (username, password) => {
    // Implement user authentication logic
    const response = await axios.post('http://localhost:3000/auth', { username, password });
    return response.data.token;
};
