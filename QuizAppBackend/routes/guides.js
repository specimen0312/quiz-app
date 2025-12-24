const router = require("express").Router();
const Guide = require("../models/Guide");

router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const guides = await Guide.find(filter).sort({ updatedAt: -1 }).lean();
  res.json({ guides });
});

router.post("/", async (req, res) => {
  const { category, title, content = "" } = req.body;
  if (!category || !title) return res.status(400).json({ error: "category + title required" });

  const guide = await Guide.create({ category, title, content });
  res.json({ guide });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  const guide = await Guide.findByIdAndUpdate(
    id,
    { title, content, category },
    { new: true }
  );

  res.json({ guide });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Guide.findByIdAndDelete(id);
  res.json({ ok: true });
});

module.exports = router;
