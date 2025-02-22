const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to send user input to Gemini API
app.post('/submit', async (req, res) => {
    const userInput = "Your response is being put directly into an html file so make it just html code. Do not use script tags. " + req.body.user_input;

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
