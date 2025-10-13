const mongoose = require("mongoose");

const moodSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
    moodValue: { type: Number, required: true, min: 0, max: 10 },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Mood = mongoose.model("moods", moodSchema);
module.exports = Mood;
