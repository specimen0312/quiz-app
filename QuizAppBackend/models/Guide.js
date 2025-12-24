const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema(
  {
    category: String,
    title: String,
    content: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guide", GuideSchema);
