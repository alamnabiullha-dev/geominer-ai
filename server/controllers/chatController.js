const { chatWithAssistant } = require("../utils/aiClient");

// @route POST /api/chat  { message, context }
const chat = async (req, res, next) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ message: "message is required" });

    const result = await chatWithAssistant({ message, context });
    res.json(result);
  } catch (err) {
    res.status(502).json({
      reply: "The AI assistant is temporarily unavailable. Please make sure the AI service is running.",
    });
  }
};

module.exports = { chat };
