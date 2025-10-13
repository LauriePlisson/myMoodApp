var express = require("express");
var router = express.Router();
import { protect } from "../middleware/protect";
const User = require("../models/users");
const Mood = require("../models/moods");
const { checkBody } = require("../modules/checkBody");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    checkBody(req.body, ["username", "password", "email"]);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      result: true,
      message: "Utilisateur créé avec succès",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    checkBody(req.body, ["email", "password"]);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      result: true,
      user: { username: user.username, token },
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/delete", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    await Mood.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ result: true, message: "utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
