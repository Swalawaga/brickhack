const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (like index.html)
app.use(express.static(__dirname));

// API endpoint to receive text from the frontend
app.post('/send-text', (req, res) => {
    const receivedText = req.body.text; // Extract text from request
    console.log('Received text:', receivedText);
    
    // Respond back to the frontend
    res.json({ message: 'Text received successfully!', receivedText });
});

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
});
