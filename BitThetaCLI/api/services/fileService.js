const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.uploadFile = async (file) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));

    const response = await axios.post('http://localhost:3000/upload', form, {
        headers: form.getHeaders(),
    });
    return response.data;
};

exports.downloadFile = async (fileId) => {
    const response = await axios.get(`http://localhost:3000/download/${fileId}`, {
        responseType: 'stream',
    });
    return response.data;
};
