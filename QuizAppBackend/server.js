require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

app.use(cors()); // ok for dev. later we can restrict origin.
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "Quiz App API" }));

app.use("/api/categories", require("./routes/categories"));
app.use("/api/test", require("./routes/tests"));
app.use("/api/attempts", require("./routes/attempts"));
app.use("/api/flashcards", require("./routes/flashcards"));
app.use("/api/guides", require("./routes/guides"));
app.use("/api/library", require("./routes/library"));

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
})();


