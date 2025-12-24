const router = require("express").Router();
const Question = require("../models/Question");

router.post("/", async (req, res) => {
  const { category, count = 10 } = req.body;

  if (!category) return res.status(400).json({ error: "category is required" });

  const n = Math.max(1, Math.min(Number(count) || 10, 68));

  const questions = await Question.aggregate([
    { $match: { category } },
    { $sample: { size: n } },
    {
      $project: {
        q: 1,
        choices: 1,
        // IMPORTANT: do NOT send answerIndex to client
      }
    }
  ]);

  res.json({ questions });
});

module.exports = router;
