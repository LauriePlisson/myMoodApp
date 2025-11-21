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

    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMood = await Mood.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });
    if (existingMood) {
      return res.status(409).json({
        result: false,
        error: "Tu as déjà enregistré ton mood pour aujourd'hui",
      });
    }

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

router.get("/today", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const moodToday = await Mood.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (moodToday) {
      return res.status(200).json({
        result: true,
        message: "Mood déjà existant pour aujourd'hui",
        mood: moodToday,
      });
    } else {
      return res.status(200).json({
        result: false,
        message: "Pas de mood enregistré pour aujourd'hui",
      });
    }
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
    if (!mood)
      return res.status(404).json({ result: false, error: "Mood introuvable" });

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

router.delete("/:id", protect, async (req, res) => {
  try {
    const moodId = req.params.id;
    const mood = await Mood.findOne({ _id: moodId, userId: req.user._id });
    if (!mood)
      return res.status(404).json({ result: false, error: "Mood introuvable" });

    await Mood.deleteOne({
      _id: moodId,
      userId: req.user._id,
    });
    const moods = await Mood.find({ userId: req.user._id });
    return res.status(200).json({
      result: true,
      message: "Mood supprimé",
      moods: moods,
    });
  } catch (error) {
    console.error("erreur", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/period", protect, async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        result: false,
        error:
          "Les paramètres 'start' et 'end' sont requis (format YYYY-MM-DD)",
      });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        result: false,
        error: "Les dates fournies ne sont pas valides",
      });
    }

    endDate.setHours(23, 59, 59, 999);

    const moods = await Mood.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });
    if (!moods) return res.status(404).json("Pas de moods enregistrés");

    return res.status(200).json({
      result: true,
      count: moods.length,
      message: "Moods récupérés avec succès",
      moods,
    });
  } catch (error) {
    console.error("Erreur route GET /moods?start=&end= =>", error);
    return res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
