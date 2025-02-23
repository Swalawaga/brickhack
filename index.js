const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;


const filePath = __dirname + "/comments.html";

// Read the file

app.use(express.json());
app.use(express.static(__dirname));
app.post('/save-message', (req, res) => {
    const { message } =  req.body;
    console.log(message);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('File content before append:', data);

        // Append new content
        const newContent = '\nNew data added!';
        fs.appendFile(filePath, newContent, (err) => {
            if (err) {
                console.error('Error appending to file:', err);
                return;
            }
            console.log('Content successfully appended!');
        });
    });
});

// API endpoint to send user input to Gemini API
app.post('/submit', async (req, res) => {
    const userInput = "Your response is being put directly into an html file so make it just html code. Do not use script tags. Use onaction events and html elements " + req.body.user_input;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
            {
                contents: [
                    {
                        parts: [{ text: userInput }]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log the entire API response
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));

        // Check the response structure
        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No AI response";
        res.json({ receivedText: aiResponse.replaceAll("```html", "").replaceAll("```", "") });

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to get AI response' });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
