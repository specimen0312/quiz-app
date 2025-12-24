const router = require("express").Router();
const Question = require("../models/Question");

router.get("/", async (req, res) => {
  const categories = await Question.distinct("category");
  res.json({ categories });
});

module.exports = router;
