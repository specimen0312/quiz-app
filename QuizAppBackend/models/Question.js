const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    q: { type: String, required: true },
    choices: { type: [String], required: true },
    answerIndex: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
