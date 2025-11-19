const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// POST /api/v1/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email ya registrado" });

    const newUser = new User({
      name,
      email,
      password,
      role,
      status: role === "Proveedor" ? "Pendiente" : "Aprobado", // visitantes se aprueban automáticamente
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en registro" });
  }
});

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { _id: user._id, name: user.name, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en login" });
  }
});

module.exports = router;
