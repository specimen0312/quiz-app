const router = require("express").Router();
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

// Save attempt
router.post("/", async (req, res) => {
  const { category, answers = [], timeTakenSec = 0 } = req.body;

  if (!category) return res.status(400).json({ error: "category is required" });

  // answers: [{ questionId, chosenIndex }]
  const ids = answers.map(a => a.questionId).filter(Boolean);

  const dbQuestions = await Question.find({ _id: { $in: ids } }).lean();
  const map = new Map(dbQuestions.map(q => [String(q._id), q]));

  let score = 0;
  const detailed = answers.map(a => {
    const q = map.get(String(a.questionId));
    const correctIndex = q?.answerIndex ?? -1;
    const isCorrect = Number(a.chosenIndex) === correctIndex;
    if (isCorrect) score++;

    return {
      questionId: a.questionId,
      chosenIndex: a.chosenIndex,
      correctIndex,
      isCorrect
    };
  });

  const attempt = await Attempt.create({
    category,
    total: answers.length,
    score,
    timeTakenSec,
    answers: detailed
  });

  res.json({ attemptId: attempt._id, score, total: answers.length });
});

// Get recent attempts
router.get("/", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));
  const attempts = await Attempt.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ attempts });
});

module.exports = router;
