const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema(
  {
    category: String,
    front: String,
    back: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", FlashcardSchema);
