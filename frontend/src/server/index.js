const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create an Express app
const app = express();
const port = 5000;

// Setup file upload
const upload = multer({ dest: 'uploads/' });

// Handle file transfer
app.post('/api/transfer-file', upload.single('file'), (req, res) => {
    const { destination } = req.body;
    const file = req.file;

    if (!destination || !file) {
        return res.status(400).send('File and destination are required.');
    }

    // Logic to handle the file transfer to the destination
    // This could involve calling other services, transferring the file to a remote server, etc.
    
    // Simulate a file transfer process
    setTimeout(() => {
        // Clean up uploaded file
        fs.unlinkSync(path.join(__dirname, 'uploads', file.filename));
        res.status(200).send('File transferred successfully.');
    }, 2000);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
