const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema(
  {
    category: String,
    total: Number,
    score: Number,
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        chosenIndex: Number,
        correctIndex: Number,
        isCorrect: Boolean
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", AttemptSchema);
