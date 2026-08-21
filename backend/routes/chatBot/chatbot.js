const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Westie, a friendly chatbot inside WasteFreeIndia, specialized ONLY in waste management.
- Always answer questions related to waste management in a simple, short, and easy-to-understand way. Keep answers as brief as possible.
- If the user says "Hello" or similar greetings, respond with a friendly greeting like "Hello! I am Westie from WasteFreeIndia. How can I help with waste management?"
- For any other unrelated questions, politely reply: "I am Westie, the WasteFreeIndia chatbot. I can only answer questions related to waste management."
- Respond in the same language the user asks in.
- Default language is English if the language cannot be detected.
- Keep the tone friendly and encouraging.`;

router.post("/api/chat", async (req, res) => {
  const message = req.body.message || req.query.message;

  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

module.exports = router;