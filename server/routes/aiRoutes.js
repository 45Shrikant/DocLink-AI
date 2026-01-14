const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/consult", async (req, res) => {
  try {
    const { symptoms } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful medical assistant. Based on the symptoms described, suggest the type of specialist the patient should see. Keep it short (max 2 sentences)." },
        { role: "user", content: symptoms },
      ],
    });
    res.status(200).send(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send("AI Error");
  }
});

module.exports = router;