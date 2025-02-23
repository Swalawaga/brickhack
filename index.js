const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

function appendJSON(filePath, newData) {
  try {
    let json = [];

    // Ensure the file exists, if not, create an empty array
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
    }

    // Read existing file data
    const fileData = fs.readFileSync(filePath, 'utf-8');
    json = fileData ? JSON.parse(fileData) : [];

    if (Array.isArray(json)) {
      json.push(newData);
    } else {
      console.error('Existing content is not an array. Resetting file.');
      json = [newData]; // Reset file content if it's not an array
    }

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log('Data appended successfully.');
  } catch (error) {
    console.error('Error appending data:', error);
  }
}

app.use(express.json());
app.use(express.static(__dirname));
app.post('/save-message', (req, res) => {
    const { message } = req.body;
    console.log(req.body);
    appendJSON(__dirname + "/data.json", { req });
    
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
