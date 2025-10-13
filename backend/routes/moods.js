var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Mood = require("../models/moods");
const { protect } = require("../middleware/protect");
const { checkBody } = require("../modules/checkBody");

router.post("/", protect, async (req, res) => {
  try {
    const verif = checkBody(req.body, ["moodValue"]);
    if (!verif)
      return res.status(400).json({ error: "Tu dois donner une note" });

    const newMood = new Mood({
      userId: req.user._id,
      moodValue: req.body.moodValue,
      note: req.body.note || "",
    });

    await newMood.save();

    return res
      .status(201)
      .json({ result: true, message: "Mood sauvegardé", mood: newMood });
  } catch (error) {
    console.error("erreur", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user._id }).sort({ date: -1 });
    if (!moods || moods.length === 0)
      return res.status(404).json({
        result: false,
        error: "Aucun mood trouvé pour cet utilisateur.",
      });
    return res.status(200).json({ result: true, moods: moods });
  } catch (error) {
    console.error("erreur", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { moodValue, note } = req.body;
    const moodId = req.params.id;

    const mood = await Mood.findOne({ _id: moodId, userId: req.user._id });

    if (moodValue !== undefined) mood.moodValue = moodValue;
    if (note !== undefined) mood.note = note;

    await mood.save();
    return res.status(200).json({
      result: true,
      message: "Mood mis à jour avec succès",
      mood,
    });
  } catch (error) {
    console.error("erreur", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
