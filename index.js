// server.js
import express from 'express';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post('/api/chat', async (req, res) => {
  try {
    const { userInput } = req.body;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userInput }],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
