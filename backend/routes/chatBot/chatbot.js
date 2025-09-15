const express = require("express");
const router = express.Router();

const axios = require("axios");
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

router.post("/api/chat", async (req, res) => {
  const message = req.body.message || req.query.message;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: `You are Westie, a friendly chatbot inside WasteFreeIndia, specialized ONLY in waste management. 
- Always answer questions related to waste management in a simple, short, and easy-to-understand way. Keep answers as brief as possible. 
- If the user says "Hello" or similar greetings, respond with a friendly greeting like "Hello! I am Westie from WasteFreeIndia. How can I help with waste management?" 
- For any other unrelated questions, politely reply: "I am Westie, the WasteFreeIndia chatbot. I can only answer questions related to waste management." 
- Respond in the same language the user asks in. 
- Default language is English if the language cannot be detected. 
- Keep the tone friendly and encouraging.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

module.exports = router;
