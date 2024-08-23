const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Define routes related to files
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/download/:fileId', fileController.downloadFile);

module.exports = router;
