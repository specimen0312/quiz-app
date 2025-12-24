const router = require("express").Router();
const Flashcard = require("../models/Flashcard");

router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const cards = await Flashcard.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ cards });
});

router.post("/", async (req, res) => {
  const { category, front, back } = req.body;
  if (!category || !front || !back)
    return res.status(400).json({ error: "category, front, back required" });

  const card = await Flashcard.create({ category, front, back });
  res.json({ card });
});

module.exports = router;
