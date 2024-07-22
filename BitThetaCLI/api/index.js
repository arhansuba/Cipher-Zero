const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./api/routes/index'); // Import the centralized routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
