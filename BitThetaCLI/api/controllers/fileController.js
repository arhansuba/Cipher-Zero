const fileService = require('../services/fileService');

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const result = await fileService.uploadFile(file);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await fileService.downloadFile(fileId);
        res.status(200).send(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
