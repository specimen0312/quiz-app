const router = require("express").Router();
const Attempt = require("../models/Attempt");
const Flashcard = require("../models/Flashcard");
const Guide = require("../models/Guide");

router.get("/summary", async (req, res) => {
  const [attempts, guidesCount, flashcardsCount] = await Promise.all([
    Attempt.find().sort({ createdAt: -1 }).limit(10).lean(),
    Guide.countDocuments(),
    Flashcard.countDocuments()
  ]);

  res.json({
    recentAttempts: attempts,
    guidesCount,
    flashcardsCount
  });
});

module.exports = router;
