const crypto = require("crypto");
global.crypto = crypto;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Item = require("./models/Item");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Route test
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API fonctionnelle",
  });
});

// 🔹 GET tous les items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ _id: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 POST ajouter item
app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 DELETE item
app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 PATCH (toggle completed)
app.patch("/api/items/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body, // ✅ IMPORTANT : accepte status + name
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});