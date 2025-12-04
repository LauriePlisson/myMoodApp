var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Mood = require("../models/moods");
const { protect } = require("../middleware/protect");
const { checkBody } = require("../modules/checkBody");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const verif = checkBody(req.body, ["username", "password", "email"]);
    if (!verif) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(201).json({
      result: true,
      message: "Utilisateur créé avec succès",
      user: { username: newUser.username, token },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const verif = checkBody(req.body, ["email", "password"]);
    if (!verif) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      result: true,
      user: { username: user.username, token },
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/delete", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    await Mood.deleteMany({ userId: userId });
    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ result: true, message: "utilisateur supprimé" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

router.put("/update", protect, async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ result: false, error: "Utilisateur introuvable" });
    }

    if (username) {
      if (username.lengt === 0) {
        return res.status(400).json({ result: false, error: "Username vide" });
      }
      user.username = username;
    }

    if (password && newPassword) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Mot de passe actuel incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ result: true, message: "Profil mis à jour" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
